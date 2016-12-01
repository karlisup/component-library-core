'use strict'

// var util = require('util')
var console = require('better-console')
// var renderNav = require('./compolib.renderNav')
var filetreeToJSON = require('./compolib.filetreeToJSON')
var components = require('./compolib.components')
var ncp = require('ncp').ncp

module.exports = function build (opts) {
  // copy assets to public folder
  ncp('node_modules/component-library-core/doc-template/assets', opts.location.dest + '/assets', function (err) {
    if (err) {
      return console.error(err)
    }
  })

  // TODO make sure that there are no components in dest folder before creating new
  // could be the situation when .json files are missing/deleted, but dest component folder is still there
  opts.components = [] // before build, reset components
  opts.treeStructure['data'] = filetreeToJSON(opts, opts.location.src, true)
  // renderNav(opts)

  // create simple list of components
  // Saves data in opts.searchableItems
  components.generateSearch(opts)

  // render all components
  // - ( component.html & raw.component.html ) + navigation
  // - enrich components array with new data (style, info, data file locations)
  // Saves data in opts.components
  components.renderAll(opts)

  components.renderDashboard(opts)

  // console.log(util.inspect(opts.searchableItems, {showHidden: false, depth: null}))

  console.log('[CL] ' + opts.components.length + ' components rendered (' + opts.location.src + ')')
}
