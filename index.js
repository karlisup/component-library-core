

// load dependencies
var fs = require('fs'),						//filesystem
	path = require('path'),					//paths
	recursive = require('recursive-readdir'),
	escape = require('escape-html');



module.exports = function(){
	var tmplPage = 'src/styleguide/source/page.template';
	var tmplElem = 'src/styleguide/source/element.template';
	var resultUrl = 'src/styleguide/index.nunjucks';
	var plhdLoop = '[[[styleguide-placeholder]]]';
	var plhdFileUrl = "/\[\[\[file-url]]]/g";
	var plhdFileSrc = "/\[\[\[file-source]]]/g";
	var plhdFileMD  = "/\[\[\[file-description]]]/g";
	var content = 'There are no components in components folder';
	// find content placeholder
	// replace it with includes of the files
	 
	// -------------------------------------
	//  read files
	// -------------------------------------
	var contentsPage = fs.readFileSync(tmplPage).toString();
	var contentsElem = fs.readFileSync(tmplElem).toString();

	// -------------------------------------
	//  V1 Going through files
	// -------------------------------------
	// recursive('src/components',['*.json', '*.scss', '*.md'] , function (err, files) {
	// 	var count = files.length;
	// 	if(count===0) return;
	// 	content = '';
	// 	for(var i=0; i<count; i++){
	// 		//tmp solution (doesn't regenerate on template modifications)
	// 		var sourceCode = fs.readFileSync(files[i],'utf8');
	// 		content += contentsElem
	// 			.replace(plhdFileUrl, files[i].replace(/\\/g,"/"))
	// 			.replace(plhdFileSrc, escape(sourceCode))
	// 			.replace(plhdFileMD , escape(sourceCode));
	// 	}
	// 	contentsPage = contentsPage.replace(plhdLoop, content); 
	// 	// -------------------------------------
	// 	//  write files
	// 	// -------------------------------------
	// 	fs.writeFileSync(resultUrl, contentsPage);
	// });


	// -------------------------------------
	//  V2 Going through folders
	// -------------------------------------
	var srcpath = 'src/components';
	function recursiveWalkTree(dir){
		fs.readdirSync(dir).filter(function(file) {
			// console.log(dir,file);
			var dirPath = path.join(dir, file);
			var isDirectory = fs.statSync(dirPath).isDirectory();
			console.log(file, isDirectory);
			if(isDirectory) recursiveWalkTree(dirPath);
		// console.log(fs.statSync(path.join(srcpath, file)).isDirectory())
		// return fs.statSync(path.join(srcpath, file)).isDirectory();
		});
	}
	recursiveWalkTree(srcpath);



}





















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