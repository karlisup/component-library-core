'use strict'

var console = require('better-console')
var fs = require('graceful-fs')       // filesystem
var path = require('path')         // paths
var marked = require('marked')
var Twig = require('twig')
var twig = Twig.twig
var processTemplate = require('./compolib.processTemplate.js')
var hljs = require('./vendor/highlight')
var helpers = require('./compolib.helpers')
var url = require('url')

// prevent Twig from caching .html
Twig.cache(false)
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
    // console.log(files.demo)
    if (files.demo !== undefined) component.code.push(this.highlightFileContent('demo', 'Demo', files.demo))
    if (files.markup !== undefined) component.code.push(this.highlightFileContent('tmpl', 'Markup', files.markup))
    if (files.style !== undefined) component.code.push(this.highlightFileContent('style', 'Style', files.style))
    if (files.js !== undefined) component.code.push(this.highlightFileContent('js', 'Javascript', files.js))
    if (files.data !== undefined) component.code.push(this.highlightFileContent('data', 'JSON', JSON.stringify(files.data, null, '\t')))
    // if (files.rawdata !== undefined) component.code.push(this.highlightFileContent('rawdata', 'Raw JSON', JSON.stringify(files.rawdata, null, '\t')))

    // render component itself (e.g. navigation.twig + navigation.json)
    processTemplate(opts, component, files.data)

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
      'searchableItems': opts.searchableItems,
      'compInfo': component.info.compiled,
      'tmplUrl': component.tmpl.path,
      'compCompiled': component.tmpl.compiled,
      'compCode': component.code,
      'compRawUrl': url.resolve(opts.location.root, component.compiled.raw)
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
   * Render all components from array
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
   * Create a simple list of components to pass to search
   * @param  opts Global options
   */
  generateSearch: function generateSearch (opts) {
    for (var key in opts.components) {
      if (opts.components.hasOwnProperty(key)) {
        var component = opts.components[key]
        var demoPath = path.normalize(path.join('/' + component.path, component.name + opts.extensions.output))
        var item = [component.name, component.path.split('/', 1)[0], demoPath]
        opts.searchableItems.push(item)
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
    // TODO write understandable ERROR messages for Humans
    if (component.data !== '') {
      var jsonPath = path.join(opts.location.src, component.data)
      // recursive open .json files and return
      // full json string withour data@ references
      var data = this.fetchData(opts, jsonPath)
      if (data) {
        try {
          files.data = JSON.parse(data, 'utf8')
        } catch (err) {
          console.error(err.message + ' > In: ' + jsonPath)
        }
      } else {
        console.warn(data + 'WorkAround: setting files.data to empty string')
        files.data = ''
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

    // load demo
    if (component.demo) {
      try {
        files.demo = fs.readFileSync(path.join(opts.location.src, component.demo), 'utf8')
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

  /**
   * Prepares source code for displaying it in a raw form.
   * @param  id      Passed for component:tabs purposes
   * @param  title   Title displayed on the tab
   * @param  content code
   * @return         object
   */
  highlightFileContent: function highlightFileContent (id, title, content) {
    var item = {}
    item.id = id
    item.title = title
    item.content = hljs.highlightAuto(content.toString()).value
    item.content = '<pre><code>' + item.content + '</code></pre>'
    return item
  },

  /**
   * Render first page
   * @param  opts global options
   */
  renderDashboard: function renderDashboard (opts) {
    // -------------------------------------
    //  Compose dashboard
    // -------------------------------------
    var componentContents = twig({
      base: opts.location.styleguide,
      path: opts.location.styleguide + 'dashboard.twig',
      async: false
    }).render({
      'root': opts.location.root,
      'searchableItems': opts.searchableItems
    })

    // -------------------------------------
    //  Render component
    // -------------------------------------
    helpers.writeFile(path.join(opts.location.dest, 'index.html'), componentContents, function (err) {
      if (err) {
        console.error(err)
      }
    })
  },

  hasDataFileReference: function hasDataFileReference (data) {
    return (data.indexOf('data@') !== -1)
  },

  fetchData: function fetchData (opts, jsonPath) {
    if (!fs.existsSync(jsonPath)) {
      console.error(jsonPath + ' file does not exist!')
      return {}
    }
    // console.warn(jsonPath + ' file exists')

    var jsonContents = fs.readFileSync(jsonPath, 'utf8')
    if (this.hasDataFileReference(jsonContents)) {
      // console.warn(jsonPath + ' has @data reference')

      var myRe = /["']data@(.*)["']/g
      var match = myRe.exec(jsonContents)
      while (match != null) { // iterate results
        var fileContents = this.fetchData(opts, path.join(opts.location.src, match[1]))
        fileContents = fileContents || 'undefined' // if exists use data if not string 'undefined'
        jsonContents = jsonContents.replace(match[0], fileContents) // replace data@ with data
        // console.log(jsonContents)
        // console.log(match[1])
        match = myRe.exec(jsonContents)
      }
      return jsonContents
    } else {
      // console.warn('NO @data reference')
      return jsonContents
    }
  }

}

