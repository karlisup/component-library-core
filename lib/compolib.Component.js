'use strict'

var path = require('path')         // paths

function Component (filePath) {
  this.path = '' // relateive url
  this.name = ''
  this.tmpl = ''
  this.data = ''
  this.info = ''

  if (filePath) {
    this.path = path.dirname(filePath).split(this.opts.location.src)[1] // relative folder url
    this.name = path.basename(filePath, this.opts.extensions.template) // foo/bar/baz/asdf/quux.html ==> quux
    this.tmpl = path.join(this.path, this.name + this.opts.extensions.template)
  }
}

module.exports = Component
