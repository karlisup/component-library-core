// 'use strict'
// 
// 
// This doesn't seem as unit tests
// Seems not right to test whole building process.

// var chai = require('chai')
// var expect = chai.expect
// var getOptions = require('../lib/compolib.getOptions')
// var build = require('../lib/compolib.build')

// describe('CompoLib.getOptions', function () {
//   // if value passed - passed value is taken
//   it('should return passed option', function () {
//     expect(function () {
//       var opts = getOptions({
//         location: {
//           src: '/src/',
//           dest: '/dest/'
//         }
//       })
//       build(opts)
//     }).to.be.an('object') // new HTML files created
//   })

//   // if value not passed - default value is taken
//   it('should return default option', function () {
//     expect(getOptions({})).to.be.an('object')
//   })

//   // Support for Windows & Unix like URLs
//   it('should support Windows & Unix like URLs', function () {
//     expect(
//       getOptions({
//         location: {
//           dest: '/dest/',
//           src: '\\src\\'
//         }
//       })
//     ).to.be.an('object')
//   })
// })
