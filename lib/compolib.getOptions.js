'use strict'

var console = require('better-console')

module.exports = function (options) {
  var opts = options || {}

  opts.location = (opts.location) ? opts.location : {}
  opts.extensions = (opts.extensions) ? opts.extensions : {}

  opts.location.src = opts.location.src || '..\\..\\src\\components\\'
  opts.location.dest = opts.location.dest || '..\\..\\dest\\components\\'
  opts.location.styleguide = opts.location.styleguide || '..\\..\\src\\styleguide\\'

  opts.extensions.template = opts.extensions.template || '.twig'
  opts.extensions.output = opts.extensions.output || '.html'

  console.warn(opts)
  return opts
}
