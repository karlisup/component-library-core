

// load dependencies
var fs = require('fs'),						//filesystem
	path = require('path'),					//paths
	recursive = require('recursive-readdir'),
	escape = require('escape-html'),
	console = require('better-console');



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
	var fileTree = [];

	// var filteredTree = directoryTree('/some/path', ['.jpg', '.png']);
	/**
	 * Recursive function which walks the file-tree and saves it in to the JSON
	 * @param  {string} dir - recursion starting directory
	 * @param  {array} accepted - array of accepted file types (otherwise, ignore is more complicated)
	 * @return {JSON}  
	 */
	function recursiveWalkTree(dir, accepted){
		var output = [];
		fs.readdirSync(dir).filter(function(file) {
			// console.log(a);
			var item = {};
			item.name = file;
			item.path = path.join(dir, file);

			var isDirectory = fs.statSync(item.path).isDirectory();
			if(isDirectory){
				// if directory call function on new path
				item.children = recursiveWalkTree(item.path);
				console.table(item.children);
			}
			else{
				// if file, make sure it's whitelisted
				// http://blog.niftysnippets.org/2010/09/say-what.html
				var what = Object.prototype.toString;
				if(what.call(accepted) == "[object Array]"){
					//geez
				}
				elseif(what.call(accepted) == "[object String]"){
					//geez
				}
			}
			output.push(item);
		});
		return output;
	}

	console.info("Save Directory Tree in JSON");
	console.time("Timer");
	fileTree = recursiveWalkTree(srcpath, ['.md', '.']);
	console.table(fileTree);
	console.timeEnd("Timer");
	// console.log(fileTree);



// }
// photos
// ├── summer
// │   └── june
// │       └── windsurf.jpg
// └── winter
//     └── january
//         ├── ski.png
//         └── snowboard.jpg


// {
//   "path": "",
//   "name": "photos",
//   "type": "directory",
//   "children": [
//     {
//       "path": "winter/january",
//       "name": "january",
//       "type": "directory",
//       "children": [
//         {
//           "path": "winter/january/ski.png",
//           "name": "ski.png",
//           "type": "file"
//         },
//         {
//           "path": "winter/january/snowboard.jpg",
//           "name": "snowboard.jpg",
//           "type": "file"
//         }
//       ]
//     }
//   ]

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