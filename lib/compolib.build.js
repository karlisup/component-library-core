'use strict'

var console = require('better-console')
// var renderNav = require('./compolib.renderNav')
var filetreeToJSON = require('./compolib.filetreeToJSON')
var components = require('./compolib.components')

module.exports = function build (opts) {
  // TODO make sure that there are no components in dest folder before creating new
  // could be the situation when .json files are missing/deleted, but dest component folder is still there
  opts.components = [] // before build, reset components
  opts.treeStructure['data'] = filetreeToJSON(opts, opts.location.src, true)
  // renderNav(opts)

  // var components = new Components()
  components.renderAll(opts)

  // console.info('Tree structure: ')
  // console.log(opts.treeStructure)
  
  // console.info('Components: ')
  // console.table(opts.components)
  // 
  console.log('[CL] ' + opts.components.length + ' components rendered (' + opts.location.src + ')')
}
