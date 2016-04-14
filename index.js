

// load dependencies
var fs = require('fs'),						//filesystem
	path = require('path'),					//paths
	recursive = require('recursive-readdir');


module.exports = function(){
	var tmplPage = 'src/styleguide/source/page.template';
	var tmplElem = 'src/styleguide/source/element.template';
	var resultUrl = 'src/styleguide/index.nunjucks';
	var plhdLoop = '[[[styleguide-placeholder]]]';
	var plhdFileUrl = "[[[file-url]]]";
	var content = 'There are no components in components folder';
	// find content placeholder
	// replace it with includes of the files
	 
	// -------------------------------------
	//  read files
	// -------------------------------------
	var contentsPage = fs.readFileSync(tmplPage).toString();
	var contentsElem = fs.readFileSync(tmplElem).toString();

	// -------------------------------------
	//  get all components
	// -------------------------------------
	recursive('src/components',['*.json', '*.scss', '*.md'] , function (err, files) {
		var count = files.length;
		if(count===0) return;
		content = '';
		for(var i=0; i<count; i++){
			// var re = new RegExp(plhdFileUrl,"g");
			// console.log(re);
			content += contentsElem.replace(/\[\[\[file-url]]]/g, files[i].replace(/\\/g,"/"));

		}
		contentsPage = contentsPage.replace(plhdLoop, content); 
		// -------------------------------------
		//  write files
		// -------------------------------------
		fs.writeFileSync(resultUrl, contentsPage);
	});
}


// function initPatterLibrary(files){
// 	var tmplPage = 'src/styleguide/source/page.template';
// 	var tmplElem = 'src/styleguide/source/element.template';
// 	var resultUrl = 'src/styleguide/index.nunjucks';
// 	var plhdLoop = '[[[styleguide-placeholder]]]';
// 	var plhdFileUrl = "[[[file-url]]]";
// 	var content = 'There are no components in components folder';
// 	// find content placeholder
// 	// replace it with includes of the files
	 
// 	// -------------------------------------
// 	//  read files
// 	// -------------------------------------
// 	var contentsPage = fs.readFileSync(tmplPage).toString();
// 	var contentsElem = fs.readFileSync(tmplElem).toString();

// 	// -------------------------------------
// 	//  get all components
// 	// -------------------------------------
// 	recursive('src/components',['*.json', '*.scss', '*.md'] , function (err, files) {
// 		var count = files.length;
// 		if(count===0) return;
// 		content = '';
// 		for(var i=0; i<count; i++){
// 			// var re = new RegExp(plhdFileUrl,"g");
// 			// console.log(re);
// 			content += contentsElem.replace(/\[\[\[file-url]]]/g, files[i].replace(/\\/g,"/"));

// 		}
// 		contentsPage = contentsPage.replace(plhdLoop, content); 
// 		// -------------------------------------
// 		//  write files
// 		// -------------------------------------
// 		fs.writeFileSync(resultUrl, contentsPage);
// 	});
	
// }

// initPatterLibrary();






















// ****** GARBAGE *******
// 
// // function getDirectories(srcpath) {
//   return fs.readdirSync(srcpath).filter(function(file) {
//   	console.log(file);
//   	// console.log(fs.statSync(path.join(srcpath, file)).isDirectory())
//     // return fs.statSync(path.join(srcpath, file)).isDirectory();
//   });
// }

// console.log(getDirectories('src'));


// concat([
// 	'src/a.txt',
// 	'src/b.txt',
// 	'src/subfolder/c.txt'
// 	], 'dest/concat.txt', function() {
// 		console.log('done');
// 	}
// );
// 
// 
// function concat(files, destination) {
// 	var fs = require('fs');
// 	var result = '';

// 	files.forEach(function(file) {
// 		result += fs.readFileSync(file).toString();
// 	});

// 	try {
// 		fs.writeFileSync(destination, result);
// 	} catch (err) {
// 		console.log(err);
// 	}
// }