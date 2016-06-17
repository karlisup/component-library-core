'use strict'

var console = require('better-console')
var watch = require('watch')
var path = require('path')
var rimraf = require('rimraf')
var build = require('./compolib.build')

module.exports = function (opts) {
  // -------------------------------------
  //  Watch task
  // -------------------------------------
  var watchedFiletypes = ['.json', '.md', '.markdown', '.twig']
  watch.createMonitor(opts.location.src, function (monitor) {
    monitor.on('created', function (filePath) {
      console.warn('created: ' + filePath)
      var extension = path.extname(filePath).toLowerCase()
      if (watchedFiletypes.indexOf(extension) > -1) {
        rimraf(opts.location.dest, function (error) {
          console.log('Error: ', error)
        })
        console.log('Rebuilding Library')
        build(opts)
      }
    })
    monitor.on('changed', function (filePath) {
      console.warn('changed: ' + filePath)
      var extension = path.extname(filePath).toLowerCase()
      if (watchedFiletypes.indexOf(extension) > -1) {
        rimraf(opts.location.dest, function (error) {
          if (error) {
            console.log('Error: ', error)
          } else {
            console.log('1.Removed dest folder. 2.Rebuilding Library')
            build(opts)
          }
        })
      }
    })
    monitor.on('removed', function (filePath) {
      console.warn('removed: ' + filePath)
      var extension = path.extname(filePath).toLowerCase()
      if (watchedFiletypes.indexOf(extension) > -1) {
        console.log('Rebuilding Library')
        build(opts)
      }
    })
  })
}
