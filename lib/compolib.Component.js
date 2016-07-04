'use strict'

var fs = require('graceful-fs')
var path = require('path')
var console = require('better-console')
var debug = false

var Component = function Component (opts, filePath) {
  this.path = '' // relateive url
  this.name = '' // component name
  this.tmpl = {} // template
  this.data = '' // json
  this.style = ''
  this.js = ''
  this.info = {} // markdown source & HTML 
  this.code = [] // array of file markups

  if (filePath) {
    this.path = path.dirname(filePath).split(opts.location.src)[1] // relative folder url
    this.name = path.basename(filePath, opts.extensions.template) // foo/bar/baz/asdf/quux.html ==> quux
    this.tmpl.path = path.join(this.path, this.name + opts.extensions.template)
  }
}

/**
 * Find other parts of component (data, info, etc.)
 * @param  component
 * @return component
 */
Component.prototype.assemble = function assemble (opts) {
  var _this = this
  if (debug) console.info('Assembling component: ' + _this.name)
  fs.readdirSync(opts.location.src + _this.path).filter(function (file) {
    var extension = (path.extname(file) === undefined) ? 'folder' : path.extname(file).toLowerCase()
    if (file.substr(0, file.indexOf('.')) === _this.name ||
        file.substr(0, file.indexOf('.')) === '_'+_this.name) { // only files with the same name as template or '_' in front
      switch (extension) {
        case '.json':
          _this.data = path.join(_this.path, file)
          break
        case '.md':
          _this.info.path = path.join(_this.path, file)
          break
        case '.js':
          _this.js = path.join(_this.path, file)
          break
        case '.scss':
          _this.style = path.join(_this.path, file)
          break
      }
    }
  })

  opts.components.push(_this)
  return _this
}

module.exports = Component
