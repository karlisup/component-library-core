'use strict'

// General dependencies
// var path = require('path')

// Twig
var Twig = require('twig')
var twig = Twig.twig
Twig.cache(false)

// TooklitTemplate2
//var tt2 = require('tt2')
//var Template = tt2.Template

module.exports = function (opts, component, data) {
  if (!component.tmpl.path) throw new Error('processTemplate: template path is not available')
  // console.log(component.tmpl.path)
  var passedData = (data !== undefined) ? data : ''

  if (opts.extensions.template === '.twig') { // Twig
    processTwig()
  }/* else if (opts.extensions.template === '.tt') { // tt2
    processTt2()
  }*/

  /**
   * process Twig template
   * result is saved in component.tmpl.compiled
   * original site:
   * js version: https://github.com/davidfoliveira/node-tt2
   */
  function processTwig () {
    component.tmpl.compiled = twig({
      base: opts.location.src,
      path: opts.location.src + ((component.demo) ? component.demo : component.tmpl.path) ,
      async: false
    }).render(passedData)
  }

  /**
   * process Template Toolkit2 template
   * result is saved in component.tmpl.compiled
   * original site:
   * js version: https://github.com/davidfoliveira/node-tt2
   */
    /*function processTt2 () {
    var t = new Template({INCLUDE_PATH: opts.location.src})
    t.process(opts.location.src + component.tmpl.path, { data: passedData }, function (err, output) { // TODO: error if just passedData passed
      if (err) console.warn(err)
      component.tmpl.compiled = output
    })
  }*/
}
