// // 'use strict'
// // 
// // 
// // This doesn't seem as unit tests
// // Seems not right to test whole building process.

// // var chai = require('chai')
// // var expect = chai.expect
// // var getOptions = require('../lib/compolib.getOptions')
// // var build = require('../lib/compolib.build')

// // describe('CompoLib.getOptions', function () {
// //   // if value passed - passed value is taken
// //   it('should return passed option', function () {
// //     expect(function () {
// //       var opts = getOptions({
// //         location: {
// //           src: '/src/',
// //           dest: '/dest/'
// //         }
// //       })
// //       build(opts)
// //     }).to.be.an('object') // new HTML files created
// //   })

// //   // if value not passed - default value is taken
// //   it('should return default option', function () {
// //     expect(getOptions({})).to.be.an('object')
// //   })

// //   // Support for Windows & Unix like URLs
// //   it('should support Windows & Unix like URLs', function () {
// //     expect(
// //       getOptions({
// //         location: {
// //           dest: '/dest/',
// //           src: '\\src\\'
// //         }
// //       })
// //     ).to.be.an('object')
// //   })
// // })


// 'use strict'

// var fs = require('graceful-fs')
// var path = require('path')
// var console = require('better-console') // [optional]
// var debug = false

// /**
//  * Creating new component
//  * @param opts    
//  * @param filePath
//  */
// var Component = function Component (opts, filePath) {
//   // general information
//   this.path = '' // relateive url
//   this.name = '' // component name
//   this.code = [] // array of file markups
//   // component related files
//   this.tmpl = {} // ->path & ->compiled
//   this.info = {} // ->path & ->compiled
//   this.data = '' // .json
//   this.style = '' // .sass (and others)
//   this.js = '' // .js

//   if (filePath) {
//     this.path = path.dirname(filePath).split(opts.location.src)[1] // relative folder url
//     this.name = path.basename(filePath, opts.extensions.template) // foo/bar/baz/asdf/quux.html ==> quux
//     this.tmpl.path = path.join(this.path, this.name + opts.extensions.template)
//   }
// }
// // TODO test
// // - creating component with wierd extension
// // - creating component on windows / mac
// // - weird user passed template extension

// /**
//  * Find other parts of component (data, info, etc.)
//  * @param  component
//  * @return component
//  */
// Component.prototype.assemble = function assemble (opts) {
//   var _this = this
//   if (debug) console.info('Assembling component: ' + _this.name)
//   fs.readdirSync(opts.location.src + _this.path).filter(function (file) {
//     var extension = (path.extname(file) === undefined) ? 'folder' : path.extname(file).toLowerCase()
//     // only files with the same name as template or '_' in front
//     if (file.substr(0, file.indexOf('.')) === _this.name ||
//         file.substr(0, file.indexOf('.')) === '_' + _this.name) {
//       switch (extension) {
//         case '.json':
//           _this.data = path.join(_this.path, file)
//           break
//         case '.md':
//           _this.info.path = path.join(_this.path, file)
//           break
//         case '.js':
//           _this.js = path.join(_this.path, file)
//           break
//         case '.scss':
//           _this.style = path.join(_this.path, file)
//           break
//       }
//     }
//   })

//   opts.components.push(_this)
//   return _this
// }
// // TODO test
// // - pass folder url and check if all files are registred in component object
// // - try breaking readdirSync(opts.location.src + _this.path)

// module.exports = Component
