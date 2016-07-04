var mkdirp = require('mkdirp')
var fs = require('fs')
var console = require('better-console')
var getDirName = require('path').dirname

// -------------------------------------
//  Helper functions
// -------------------------------------
module.exports = {
  init: function () {
    // for IE8 support
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function (obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
          if (this[i] === obj) { return i }
        }
        return -1
      }
    }
    if (!Array.prototype.toLowerCase) {
      Array.prototype.toLowerCase = function () {
        for (var i = 0; i < this.length; i++) {
          this[i] = this[i].toString().toLowerCase()
        }
      }
    }
  },

  writeFile: function (path, contents, cb) {
    // when creating file - create missing folders as well
    mkdirp(getDirName(path), function (err) {
      if (err) return cb(err)

      fs.writeFile(path, contents, cb)
    })
  },

  replaceTabs: function (text, replacement) {
    text.replace(/^((<[^>]+>|\t)+)/gm, function (match, p1) {
      return p1.replace(/\t/g, replacement)
    })
  },

  dumpError: function (err) {
    if (typeof err === 'object') {
      if (err.message) {
        console.error('\nMessage: ' + err.message)
      }
      if (err.stack) {
        console.log('\nStacktrace:')
        console.log('====================')
        console.log(err.stack);
      }
    } else {
      console.log('dumpError :: argument is not an object');
    }
  }
}
