/* jslint node: true */
'use strict'

var console = require('better-console')

var getOptions 	= require('./lib/compolib.getOptions')
var build = require('./lib/compolib.build')
// var watch = require('./lib/compolib.watch')

function CompoLib (options) {
  var opts = getOptions(options)

  opts.treeStructure = []
  opts.components = []
  opts.navigationContents = ''

  console.info('Building Component Library')
  build(opts)
  // watch(opts)
}

module.exports = CompoLib


