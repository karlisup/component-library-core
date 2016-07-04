'use strict'

// var console = require('better-console')
var path = require('path')

module.exports = function (options) {

  function n(pathString) {
    return path.normalize(pathString)
  }

  var opts = options || {}

  opts.location = (opts.location) ? opts.location : {}
  opts.extensions = (opts.extensions) ? opts.extensions : {}

  opts.location.root = opts.location.root || '/'
  opts.location.src = n(opts.location.src) || n('../../src/components/')
  opts.location.dest = n(opts.location.dest) || n('../../dest/components/')
  opts.location.styleguide = n(opts.location.styleguide) || n('../../src/styleguide/')

  opts.extensions.template = opts.extensions.template || '.twig'
  opts.extensions.output = opts.extensions.output || '.html'

  // console.warn(opts)
  return opts
}
