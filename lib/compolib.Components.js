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
var debug = false

module.exports = {
  /**
   * Main function that renders one components
   * Here you should change the rendering engine to another one.
   * @param  opts      Global options
   * @param  component Component which has to be rendered
   * TODO: make this simple enough
   */
  renderOne: function (opts, component) {
    if (debug) console.info('Rendering component: ' + component.name)

    var files = this.loadFiles(opts, component)

    // -------------------------------------
    //  Prepare content
    // -------------------------------------

    // compile Markdown to HTML
    if (files.info !== undefined) component.info.compiled = marked(files.info)
    // highlight data, info, markup, style, js
    if (files.markup !== undefined) component.code.push(this.highlightFileContent ("tmpl", "Markup", files.markup))
    if (files.style !== undefined) component.code.push(this.highlightFileContent ("style", "Style", files.style))
    if (files.js !== undefined) component.code.push(this.highlightFileContent ("js", "Javascript", files.js))
    if (files.data !== undefined) component.code.push(this.highlightFileContent ("data", "Data", JSON.stringify(files.data, null, "\t")))

    // render component itself (e.g. navigation.twig + navigation.json)
    if (component.tmpl.path) {
      var passedData = (files.data !== undefined) ? files.data : ''
      component.tmpl.compiled = twig({
        base: opts.location.src,
        path: opts.location.src + component.tmpl.path,
        async: false
      }).render(passedData)
    }

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
      'compCode': component.code,
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
  },

  /**
   * Loads file content/-s in to the object
   * @param  opts      
   * @param  component 
   * @return object     object with multiple files loaded
   */
  loadFiles: function loadFiles (opts, component) {
    // -------------------------------------
    //  Load files
    // -------------------------------------
    var files = {} // data, info, markup, style, js

    // load data from .json
    if (component.data !== '') {
      try {
        files.data = JSON.parse(fs.readFileSync(path.join(opts.location.src, component.data), 'utf8'))
      } catch (e) {
        helpers.dumpError(e)
      }
    }

    // load description from .markdown
    if (component.info && component.info.path !== undefined) {
      try {
        files.info = fs.readFileSync(path.join(opts.location.src, component.info.path), 'utf8')
      } catch (e) {
        helpers.dumpError(e)
      }
    }

    // load markup from template ( .twig / .jade / .moustache / ...)
    if (component.tmpl && component.tmpl.path !== '') {
      try {
        files.markup = fs.readFileSync(path.join(opts.location.src, component.tmpl.path), 'utf8')
      } catch (e) {
        helpers.dumpError(e)
      }
    }

    // load style from stylesheet (.css, .less, .sass, .stylus)
    if (component.style !== '') {
      try {
        files.style = fs.readFileSync(path.join(opts.location.src, component.style), 'utf8')
      } catch (e) {
        helpers.dumpError(e)
      }
    }

    // load javasscript from .js
    if (component.js !== '') {
      try {
        files.js = fs.readFileSync(path.join(opts.location.src, component.js), 'utf8')
      } catch (e) {
        helpers.dumpError(e)
      }
    }

    return files
  },

  highlightFileContent : function highlightFileContent (id, title, content) {
    // console.log(id, title, content)
    var item = {}
    item.id = id
    item.title = title
    item.content = hljs.highlightAuto(content.toString()).value
    item.content = '<pre><code>' + item.content + '</code></pre>'
    return item
  }
}
