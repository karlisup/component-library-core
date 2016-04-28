var mkdirp = require('mkdirp');
var fs = require('fs');
var getDirName = require('path').dirname;

// -------------------------------------
		//  Helper functions
		// -------------------------------------
module.exports = {
	init: function () {
		// for IE8 support
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i++) {
					if (this[i] === obj) { return i; }
				}
				return -1;
			}
		}
		if (!Array.prototype.toLowerCase) {
			Array.prototype.toLowerCase = function() { 
				for (var i = 0; i < this.length; i++) {
					this[i] = this[i].toString().toLowerCase(); 
				}
			}
		}
	},

	writeFile: function(path, contents, cb) {
		// when creating file - create missing folders as well
		mkdirp(getDirName(path), function (err) {
			if (err) return cb(err);

			fs.writeFile(path, contents, cb);
		});
	}
};
