module.exports = {
	init: function () {
		// -------------------------------------
		//  Helper functions
		// -------------------------------------
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
	}
};
