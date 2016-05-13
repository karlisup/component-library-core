'use strict'

var helpers = require('./compolib.helpers')
var filetreeToJSON = require('./compolib.filetreeToJSON')

module.exports = function build (opts) {
  // TODO make sure that there are no components in dest folder before creating new
  // could be the situation when .json files are missing/deleted, but dest component folder is still there
  opts.treeStructure['data'] = filetreeToJSON(opts.location.src, true, function (err) {
    if (err) {
      return console.log(err)
    }
    navigationRender(opts.treeStructure)
    renderAllComponents(opts.components, function (err) {
      if (err) {
        return console.log(err)
      }

    })
  })


  console.table(opts.treeStructure)
  console.table(opts.components)

  // save tree structure & components in .json files
  helpers.writeFile(
    opts.location.styleguide + 'treeStructure.json',
    JSON.stringify(opts.treeStructure, null, 4)
  )
  helpers.writeFile(
    opts.location.styleguide + 'components.json',
    JSON.stringify(opts.components, null, 4)
  )
}
