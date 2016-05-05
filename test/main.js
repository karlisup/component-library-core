'use strict';

var chai = require('chai');
var expect = chai.expect;
var CompoLib = require('../index');

describe('CompoLib.getOptions', function(){
	it('should return default options', function(){
		var compoLib = new CompoLib();
		expect(compoLib.getOptions()).to.be.an('object');
	});

	it('passed options should override defaults', function(){
		var options = {
			location: {
				src  : 'src\\components\\',
			}
		}
		var result = {
			location: {
				src  : 'src\\components\\',
				dest : '..\\..\\dest\\components\\',
				styleguide : '..\\..\\src\\styleguide\\'
			}
		}
		var compoLib = new CompoLib();
		console.log(compoLib.getOptions(options).location.src, result.location.src);
		expect(compoLib.getOptions(compoLib.getOptions(options).location.src)).to.members(result.location.src);
	});
});