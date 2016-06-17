'use strict'

var console = require('better-console')
var fs = require('graceful-fs')       // filesystem
var path = require('path')         // paths
var marked = require('marked')
var Twig = require('twig')
var twig = Twig.twig
var hljs = require('./vendor/highlight')
var helpers = require('./compolib.helpers')
var url = require('url')

Twig.cache(false) // wehen deleting dest folder & composing Components it doesn't cash old template files

module.exports = {
  /**
   * Main function that renders one components
   * Here you should change the rendering engine to another one.
   * @param  opts      Global options
   * @param  component Component which has to be rendered
   * TODO: make this simple enough
   */
  renderOne: function (opts, component) {
    console.info('Rendering component: ' + component.name)
    // -------------------------------------
    //  Load files
    // -------------------------------------

    // load template
    // var templateContents = fs.readFileSync(opts.location.src + component.tmpl.path).toString()
    // var componentContents = fs.readFileSync(opts.location.styleguide + 'component.twig').toString()
    // var layoutContents = fs.readFileSync(opts.location.styleguide + 'layout.twig').toString()

    // load data
    var templateData
    if (component.data !== '') {
      try {
        templateData = JSON.parse(fs.readFileSync(path.join(opts.location.src, component.data), 'utf8'))
      } catch (e) {
        console.error(e)
      }
    }

    // load markdown (readme)
    var templateInfo
    if (component.info.path !== undefined) {
      try {
        templateInfo = fs.readFileSync(path.join(opts.location.src, component.info.path), 'utf8')
      } catch (e) {
        console.error(e)
      }
    }

    // -------------------------------------
    //  Prepare content
    // -------------------------------------

    // compile Markdown to HTML
    if (templateInfo) component.info.compiled = marked(templateInfo)

    // compile raw template content to Raw Code Example [TODO: make this look good]
    var templateContents = fs.readFileSync(opts.location.src + component.tmpl.path).toString()
    var templateContents2 = templateContents.replace(/^((<[^>]+>|\t)+)/gm, function (match, p1) {
      return p1.replace(/\t/g, '    ')
    })
    component.tmpl.raw = hljs.highlightAuto(templateContents2).value

    // render component itself
    component.tmpl.compiled = twig({
      base: opts.location.src,
      path: opts.location.src + component.tmpl.path,
      async: false
    }).render(templateData)

    // put component in raw file layout
    var componentRawContents = twig({
      base: opts.location.styleguide,
      path: opts.location.styleguide + 'layout--raw.twig',
      async: false
    }).render({
      'root': opts.location.root,
      'title': component.name,
      'content': component.tmpl.compiled
    })
    component.compiled = {}
    component.compiled.raw = path.join(component.path, 'raw.' + component.name + opts.extensions.output)

    // -------------------------------------
    //  Compose component
    // -------------------------------------
    var componentContents = twig({
      base: opts.location.styleguide,
      path: opts.location.styleguide + 'component.twig',
      async: false
    }).render({
      'root': opts.location.root,
      'compInfo': component.info.compiled,
      'tmplUrl': component.tmpl.path,
      'compCompiled': component.tmpl.compiled,
      'compRaw': component.tmpl.raw,
      'compRawUrl': url.resolve(opts.location.root, 'components/' + component.compiled.raw)
    })
    component.compiled.demo = path.join(component.path, component.name + opts.extensions.output)

    // -------------------------------------
    //  Render component
    // -------------------------------------

    // create file
    helpers.writeFile(path.join(opts.location.dest, component.compiled.demo), componentContents, function (err) {
      if (err) {
        console.error(err)
      }
    })
    // create raw file
    helpers.writeFile(path.join(opts.location.dest, component.compiled.raw), componentRawContents, function (err) {
      if (err) {
        console.error(err)
      }
    })
  },

  /**
   * Go threw array and render all components
   * @param  opts Global options
   */
  renderAll: function renderAll (opts) {
    for (var key in opts.components) {
      if (opts.components.hasOwnProperty(key)) {
        this.renderOne(opts, opts.components[key])
      }
    }
  }
}
