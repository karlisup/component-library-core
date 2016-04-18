

// load dependencies
var fs = require('fs'),						//filesystem
	path = require('path'),					//paths
	recursive = require('recursive-readdir'),
	escape = require('escape-html'),
	console = require('better-console');



module.exports = function(){

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
	// http://blog.niftysnippets.org/2010/09/say-what.html
	var what = Object.prototype.toString;

	
	// -------------------------------------
	//  V2 Going through folders
	// -------------------------------------
	var srcpath = 'src/components';
	var fileTree;

	// var filteredTree = directoryTree('/some/path', ['.jpg', '.png']);
	/**
	 * Recursive function which walks the file-tree and saves it in to the JSON
	 * @param  {string} dir - recursion starting directory
	 * @param  {array} accepted - array of accepted file types (otherwise, ignore is more complicated)
	 * @return {JSON}  
	 */
	function treeToJSON(dir, accepted){
		var output = [];				// variable which later will be returned.
		var re = /(?:\.([^.]+))?$/; 	// get extension regexp
		accepted.toLowerCase();   		// convert accepted filetypes to lowercase

		//TODO try on edge cases (.DS_Store / files w/o extension etc.)
		fs.readdirSync(dir).filter(function(file) {
			var whitelisted = false;
			var item = {};
			item.name = file;
			item.path = path.join(dir, file);
			item.type = (re.exec(file)[1] == undefined)? 'folder': re.exec(file)[1].toLowerCase();

			var isDirectory = fs.statSync(item.path).isDirectory();
			if(isDirectory){
				// if directory call function on new path
				item.children = treeToJSON(item.path, accepted);
				// console.table(item.children);
				whitelisted = true;
			}
			else{
				// if file, make sure it's whitelisted
				if(what.call(accepted) == "[object Array]"){
					if(accepted.indexOf(item.type) > -1){
						whitelisted = true;
					}
				}
				else if(what.call(accepted) == "[object String]"){
					if(accepted.toLowerCase()==item.type){
						whitelisted = true;
					}
				}
			}
			if(whitelisted) output.push(item);
		});
		return output;
	}


	function generateNavigation(tree){

	}


	function generateContent(tree){
		var tmplPage = 'src/styleguide/source/page.template';
		var resultUrl = 'src/styleguide/index.nunjucks';
		var placeholderContent = '[[[styleguide-placeholder]]]';
		var content = 'There are no components in components folder';

		// -------------------------------------
		//  read files
		// -------------------------------------
		var contentsPage = fs.readFileSync(tmplPage).toString();
		

		// console.log(tree, tree.length);
		console.log(JSONtoFile(tree));
		// for(let m=0)

		
		// for(var i=0; i<count; i++){
		// 	//tmp solution (doesn't regenerate on template modifications)
		// 	var sourceCode = fs.readFileSync(files[i],'utf8');
		// 	content += contentsElem
		// 		.replace(plhdFileUrl, files[i].replace(/\\/g,"/"))
		// 		.replace(plhdFileSrc, escape(sourceCode))
		// 		.replace(plhdFileMD , escape(sourceCode));
		// }
		// contentsPage = contentsPage.replace(plhdLoop, content); 
		// // -------------------------------------
		// //  write files
		// // -------------------------------------
		// fs.writeFileSync(resultUrl, contentsPage);

	}
	function JSONtoFile(items){
		var results = [],
			folder  = {},
			tmplExt = ['nunjucks', 'nj'],
			dataExt = ['json'],
			infoExt = ['markdown','md'];
		folder.tmpl = [];
		folder.data = [];
		folder.info = [];

		//http://stackoverflow.com/questions/684672/loop-through-javascript-object
		for (var key in items) {
			if (items.hasOwnProperty(key)) {
				if(items[key].type==='folder'){
					if(typeof items[key].children != "undefined"){
						// console.log(JSONtoFile(items[key].children));
						var output = JSONtoFile(items[key].children);
						if(what.call(output)!="[object Undefined]"){
							// results.concat(output);
							results = output;
							// console.log(results);
						}
						// if(output != undefined) 
						console.log(results);
						// console.log();
					}
				}
				else{
					if(tmplExt.indexOf(items[key].type) > -1){
						// console.info(items[key].type+" is a template!");
						folder.tmpl.push(items[key].path);
					}
					else if(dataExt.indexOf(items[key].type) > -1){
						// console.info(items[key].type+" is a data!");
						folder.data.push(items[key].path);
					}
					else if(infoExt.indexOf(items[key].type) > -1){
						// console.info(items[key].type+" is a documentation!");
						folder.info.push(items[key].path);
					}
				}
			}
		}

		// merge arrays
		if(folder.tmpl.length > 0 || folder.data.length > 0 || folder.info.length > 0){
			// console.log(folder);
			results.push(folder)
		}

		// console.table(results);
		if (results.length > 0) return results;
	}

	// function replaceTemplate(data){
	// 	var contentsElem = fs.readFileSync(tmplElem).toString(),
	// 		placeholderUrl 	= "/\[\[\[file-url]]]/g",
	// 		placeholderInfo = "/\[\[\[file-description]]]/g";


	// 	console.log(data);
	// }



	function initialization(){

		// -------------------------------------
		//  save fileTree to JSON
		// -------------------------------------
		console.info("Save Directory Tree in JSON");
		console.time("Timer");
		fileTree = treeToJSON(srcpath, ['md', 'json', 'Nunjucks']);
		// console.table(fileTree);
		console.timeEnd("Timer");


		// // -------------------------------------
		// //  generate navigation
		// // -------------------------------------
		// console.info("Generate navigation");
		// console.time("Timer");
		// generateNavigation(fileTree);
		// // console.table(fileTree);
		// console.timeEnd("Timer");

		// -------------------------------------
		//  generate content
		// -------------------------------------
		console.info("Generate content");
		console.time("Timer");
		generateContent(fileTree);
		// console.table(fileTree);
		console.timeEnd("Timer");

	}


	initialization();



}
// }
// photos
// ├── summer
// │   └── june
// │       └── windsurf.jpg
// └── winter
//     └── january
//         ├── ski.png
//         └── snowboard.jpg



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



















// ****** GARBAGE *******
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




// 
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