'use strict'
// TODO: change expect to be object to reasonable expectations

var chai = require('chai')
var expect = chai.expect
var getOptions = require('../lib/compolib.getOptions')


describe('CompoLib.getOptions', function () {
  // if value passed - passed value is taken
  it('should return passed option', function () {
    expect(
      getOptions({
        location: {
          dest: '../other-location/'
        }
      })
    ).to.be.an('object')
  })

  // if value not passed - default value is taken
  it('should return default option', function () {
    expect(getOptions({})).to.be.an('object')
  })

  // Support for Windows & Unix like URLs
  it('should support Windows & Unix like URLs', function () {
    expect(
      getOptions({
        location: {
          dest: '/dest/',
          src: '\\src\\'
        }
      })
    ).to.be.an('object')
  })
})
