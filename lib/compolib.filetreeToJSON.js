'use strict'

var fs = require('graceful-fs')
var path = require('path')
var Component = require('./compolib.Component')

var filetreeToJson = function filetreeToJSON (opts, dir, buildComponentsList) {
  buildComponentsList = typeof buildComponentsList !== 'undefined' ? buildComponentsList : false
  var output = []        // variable which later will be returned.

  fs.readdirSync(dir).filter(function (file) {
    if (file.charAt(0) === '.') return // ignore hidden files
    if ( /^.*\.demo\.[^.\n]+$/.test(file) ) return // ignore *.demo.* files
    var whitelisted = false
    var item = {}
    item.title = file                                    // filename.twig
    item.folder = dir.split(opts.location.src)[1]
    item.type = (path.extname(file) === '') ? 'folder' : path.extname(file).toLowerCase()  // folder || .json/.md/.twig..
    item.basename = path.basename(file, item.type)                     // filename
    if (item.type !== 'folder') {
      item.src = path.join('/components/' + item.folder, item.basename + opts.extensions.output)
    } else {
      item.src = path.join(dir, file)
    }

    if (item.type === 'folder') {
      // if directory call function on new path
      item.children = filetreeToJSON(opts, item.src, buildComponentsList)
      whitelisted = true
    } else {
      // if file, make sure it's whitelisted
      if (opts.extensions.template === item.type) {
        whitelisted = true
        // assamble Component
        if (buildComponentsList) {
          var component = new Component(opts, path.join(dir, file))
          component.assemble(opts)
        }
      }
    }
    if (whitelisted) output.push(item)
  })
  return output
}

module.exports = filetreeToJson
