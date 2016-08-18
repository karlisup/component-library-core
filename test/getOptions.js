/* globals describe, it */
'use strict'

var path = require('path')
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
    ).to.have.deep.property('location.dest', '../other-location/')
  })

  // if value not passed - default value is taken
  it('should return default option', function () {
    expect(
      getOptions({})
    ).to.have.deep.property('location.dest', 'dest/components/')
  })

  // Support for Windows & Unix like URLs
  // http://stackoverflow.com/a/15364898/492457
  // should return normalized URL (On Windows: \\dest\\ | On Linux /dest/)
  it('should support Windows & Unix like URLs', function () {
    expect(
      getOptions({
        location: {
          dest: '/dest/'
        }
      })
    ).to.have.deep.property('location.dest', path.normalize('/dest/'))
  })
})
