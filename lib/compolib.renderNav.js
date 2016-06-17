// /* jslint node: true */
// 'use strict'

// var fs = require('graceful-fs')       // filesystem
// var path = require('path')
// var console = require('better-console')
// var Twig = require('twig')
// var twig = Twig.twig                // twig render function

// function renderNav (opts) {
//   if (opts.treeStructure) {
//     try {
//       // overkill (testing twig AJAX & inline templates)
//       opts.navigationContents = fs.readFileSync(path.join(opts.location.src, 'navigation/navigation.twig')).toString()
//       var pathy = path.join(opts.location.src, 'navigation/navigation.twig').toString()
//       // console.log(pathy)
//       var template = twig({
//         path: pathy,
//         allowInlineIncludes: true,
//         autoescape: true,
//         data: opts.navigationContents
//       })
//       // console.info(template, typeof (template.path))
//       opts.navigationContents = template.render(opts.treeStructure)
//     } catch (e) {
//       console.error(e)
//     }
//   } else {
//     console.error('Tree JSON is not defined')
//   }

//   // console.warn(opts.navigationContents)
// }

// module.exports = renderNav

