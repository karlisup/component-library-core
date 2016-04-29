

// load dependencies
const fs = require('fs');					//filesystem
const path	= require('path');					//paths
const console = require('better-console');
const Twig = require('twig');
const twig = Twig.twig;						//twig render function
const watch = require('watch');
// local dependencies
const helpers = require('./helpers');

// -------------------------------------
//  Helper functions
// -------------------------------------
helpers.init();
var objTypeString = Object.prototype.toString; // http://blog.niftysnippets.org/2010/09/say-what.html



// *************************************
//  COMPONENT LIBRARY GENERATOR
//  
// *************************************

// -------------------------------------
//  Settings
// -------------------------------------
 
// input
var location = {
	src  : '..\\..\\src\\components\\',
	dest : '..\\..\\dest\\components\\',
	styleguide : '..\\..\\src\\styleguide\\'
}
var extensions = {
	template: '.twig',
	output: '.html'

}

function Component(filePath){
	this.path = ''; // relateive url
	this.name = '';
	this.tmpl = '';
	this.data = '';
	this.info = '';

	if(filePath){
		this.path = path.dirname(filePath).split(location.src)[1]; // relative folder url
		this.name = path.basename(filePath, extensions.template); ///foo/bar/baz/asdf/quux.html ==> quux;
		this.tmpl = path.join(this.path, this.name+extensions.template);
	}
}

// output
var treeStructure = [];			// folder structure (for navigation)
var components = [];			// list of components
try {
	treeStructure = fs.readFileSync(location.styleguide+'treeStructure.json').toString();
	components = fs.readFileSync(location.styleguide+'components.json').toString();
} catch (e) {
	console.warn('File Not found: '+e.path);
	console.warn('Running script for the first time?');
	console.info('Running build() function');
	build();
}

// recursive function
function treeToJSON(dir, buildComponentsList = false){

	var output = [];				// variable which later will be returned.
	// var re = /(?:\.([^.]+))?$/; 	// get extension regexp TODO:deprecated

	// Produce this JSON structure:
	// [{
	// 	"name": "january",
	// 	"path": "winter/january",
	// 	"type": "directory",
	// 	"children": [
	// 		{
	// 			"path": "winter/january/ski.png",
	// 			"name": "ski.png",
	// 			"type": "png"
	// 		},
	// 		{
	// 			"path": "winter/january/snowboard.jpg",
	// 			"name": "snowboard.jpg",
	// 			"type": "jpg"
	// 		}
	// 	]
	// }]
	// 
	// Save components in array like:
	// [{
	// 	"path": "src/to/",
	// 	"name": "component",
	// 	"tmpl": "src/to/component.tmpl",
	// 	"data": "src/to/component.json",
	// 	"info": "src/to/component.md",
	// }]
	fs.readdirSync(dir).filter(function(file){
		var whitelisted = false;
		var item = {};
		item.name = file;
		item.path = path.join(dir, file);
		item.type = (path.extname(file) === '')? 'folder': path.extname(file).toLowerCase();
		var isDirectory = fs.statSync(item.path).isDirectory();
		if(isDirectory){
			// if directory call function on new path
			item.children = treeToJSON(item.path);
			whitelisted = true;
		}
		else{
			// if file, make sure it's whitelisted
			if(extensions.template === item.type){
				whitelisted = true;
				// assamble Component
				if(buildComponentsList){
					var component = new Component(item.path);
					assembleComponent(component);
				}
			}
		}
		if(whitelisted) output.push(item);
	});
	return output;
}

function assembleComponent(component) {
	// var re = /(?:\.([^.]+))?$/; 	// get extension regexp TODO:deprecated
	fs.readdirSync(location.src+component.path).filter(function(file){
		var extension = (path.extname(file) == undefined)? 'folder': path.extname(file).toLowerCase();
		if(file.substr(0, file.indexOf('.')) === component.name){ // only files with the same name as template
			switch (extension) {
				case '.json':
				component.data = path.join(component.path, file);
				break;
				case '.md':
				component.info = path.join(component.path, file);
				break;
			}
		}
	});
	components.push(component);
}



function build(){
	// TODO make sure that there are no components in dest folder before creating new
	// could be the situation when .json files are missing/deleted, but dest component folder is still there
	treeStructure = treeToJSON(location.src, true);

	for (var key in components) {
		if (components.hasOwnProperty(key)) {
			componentRender(components[key]);
		}
	}

	// save tree structure & components in .json files
	console.table(treeStructure);
	// console.log(JSON.stringify(treeStructure, null, 4));
	console.table(components);
	// console.log(location.styleguide+'treeStructure.json');
	// console.log(location.styleguide+'components.json');
	// helpers.writeFile(location.styleguide+'treeStructure.json', JSON.stringify(treeStructure, null, 4));
	// helpers.writeFile(location.styleguide+'components.json', JSON.stringify(components, null, 4));
}


// -------------------------------------
//  Watch task
// -------------------------------------
watch.createMonitor(location.src, function (monitor) {
	monitor.on("created", function (filePath, stat) {
		console.log('created', filePath);
		// if new template --> assembleComponent
		// if new file with same name as template - update .json(s)
		var extension = path.extname(filePath).toLowerCase();
		console.log(extension);
		if(extension === extensions.template){
			var component = new Component(filePath);
			assembleComponent(component);
		}
		else if(extension === ''){} // folder
		else{
			var component = componentExist(filePath);
			if(component){
				componentUpdate(component, filePath);
				componentRender(component);
			}
		}
	})
	monitor.on("changed", function (f, curr, prev) {
		console.log('changed', f);
		// Handle file changes
	})
	monitor.on("removed", function (f, stat) {
		console.log('removed', f);
		// Handle removed files
	})
// monitor.stop(); // Stop watching
})


// -------------------------------------
//  component related functions
// -------------------------------------
function componentRender(component){
	var templateData = '';
	var	templateContents = fs.readFileSync(location.src+component.tmpl).toString();
	if(component.data !== ''){
		templateData = fs.readFileSync(location.src+component.data).toString();
	}
	
	// compile template with given data
	var template = twig({ data: templateContents});
	var output = template.render({ templateData });
	component.compiled = component.path+component.name+extensions.output;

	// create file
	helpers.writeFile(location.dest+components[key].compiled, output);
}

function componentExist(filePath){
	//TODO if passed colors.txt -- will still return colors object (there are no limitation for .extensions)
	//unique ID - path to item + name or tmpl name
	var compPath = path.dirname(filePath).split(location.src)[1]; // relative folder url
	var compExtension = path.extname(filePath).toLowerCase();
	var compName = path.basename(filePath, compExtension); ///foo/bar/baz/asdf/quux.html ==> quux;
	console.log(compPath, compName, compExtension);
	for (var key in components) {
		if (components.hasOwnProperty(key)) {
			if(components[key].path === compPath && components[key].name === compName){
				return components[key];
			}
		}
	}
	return false;
}

function componentUpdate(component, filePath){
	if(['.md','.json'].indexOf(extension) > -1){
		var relativeFileLocation = filePath.split(location.src)[1]; // relative file url
		switch (extension) {
			case '.json':
			component.data = relativeFileLocation;
			break;
			case '.md':
			component.info = relativeFileLocation;
			break;
		}
		reloadTreeStructure()
	}
}





/**
 * Function to update JSON tree structure (if file added/removed).
 */
function reloadTreeStructure(){
	treeStructure = treeStructure = treeToJSON(location.src);
	helpers.writeFile(location.styleguide+'treeStructure.json', JSON.stringify(treeStructure, null, 4));
}









// module.exports = function(){


	// // *************************************
	// //  COMPONENT LIBRARY GENERATOR
	// //	
	// //	...
	// //	
	// // *************************************
	
	// // -------------------------------------
	// //  Settings
	// // -------------------------------------
	// var location.src = 'src/components';
	// var allowedFileExtensions = ['md', 'json', 'Nunjucks', 'njk'];


	// // -------------------------------------
	// //  Helper functions
	// // -------------------------------------
	// helpers.init();
	// var objTypeString = Object.prototype.toString; // http://blog.niftysnippets.org/2010/09/say-what.html

	// /**
	//  * Initialize calls 3 basic functions
	//  * a) save treeToJSON
	//  * b) generateNavigation
	//  * c) generateContent
	//  */
	// function initialization(){

	// 	// -------------------------------------
	// 	//  save fileTree to JSON
	// 	// -------------------------------------
	// 	console.info("Save Directory Tree in JSON");
	// 	console.time("Timer");
	// 	var fileTree = treeToJSON(location.src, allowedFileExtensions);
	// 	// console.table(fileTree);
	// 	// console.log(fileTree);
	// 	console.timeEnd("Timer");


	// 	// -------------------------------------
	// 	//  generate navigation
	// 	// -------------------------------------
	// 	// console.info("Generate navigation");
	// 	// console.time("Timer");
	// 	// generateNavigation(fileTree);
	// 	// // console.table(fileTree);
	// 	// console.timeEnd("Timer");

	// 	// -------------------------------------
	// 	//  generate content
	// 	// -------------------------------------
	// 	// console.info("Generate content");
	// 	// console.time("Timer");
	// 	var content = generateContent(fileTree);
	// 	// // console.table(fileTree);
	// 	// console.timeEnd("Timer");
		

	// 	// -------------------------------------
	// 	//  filling template
	// 	// -------------------------------------
	// 	var placeholder = {
	// 		styleguide: /\[\[\[styleguide-placeholder]]]/g
	// 	},
	// 		pageTemplate 	= 'src/styleguide/source/page.template',
	// 		resultUrl 	 	= 'src/styleguide/index.njk',
	// 		pageSource 		= fs.readFileSync(pageTemplate).toString(),
	// 		newSource	 	= pageSource
	// 							.replace(placeholder.styleguide, content);
	// 							// .replace(placeholder.url, tmpl[index].replace(/\\/g,"/"))
	// 	// console.log(content);
	// 	// console.log(newSource);
	// 	fs.writeFileSync(resultUrl, newSource);
	// }


	// /**
	//  * Recursive function which walks the file-tree and saves it in to the JSON
	//  * @param  {string} dir - recursion starting directory
	//  * @param  {array} allowedFileExtensions - array of allowedFileExtensions file types (otherwise, ignore is more complicated)
	//  * @return {JSON}  
	//  */
	// function treeToJSON(dir, allowedFileExtensions){
	// 	var output = [];				// variable which later will be returned.
	// 	var re = /(?:\.([^.]+))?$/; 	// get extension regexp 
	// 	allowedFileExtensions.toLowerCase();   		// convert allowedFileExtensions filetypes to lowercase

	// 	// Produce this JSON structure:
	// 	// [{
	// 	// 	"name": "january",
	// 	// 	"path": "winter/january",
	// 	// 	"type": "directory",
	// 	// 	"children": [
	// 	// 		{
	// 	// 			"path": "winter/january/ski.png",
	// 	// 			"name": "ski.png",
	// 	// 			"type": "png"
	// 	// 		},
	// 	// 		{
	// 	// 			"path": "winter/january/snowboard.jpg",
	// 	// 			"name": "snowboard.jpg",
	// 	// 			"type": "jpg"
	// 	// 		}
	// 	// 	]
	// 	// }]
	// 	fs.readdirSync(dir).filter(function(file) {
	// 		var whitelisted = false;
	// 		var item = {};
	// 		item.name = file;
	// 		item.path = path.join(dir, file);
	// 		item.type = (re.exec(file)[1] == undefined)? 'folder': re.exec(file)[1].toLowerCase();

	// 		var isDirectory = fs.statSync(item.path).isDirectory();
	// 		if(isDirectory){
	// 			// if directory call function on new path
	// 			item.children = treeToJSON(item.path, allowedFileExtensions);
	// 			// console.table(item.children);
	// 			whitelisted = true;
	// 		}
	// 		else{
	// 			// if file, make sure it's whitelisted
	// 			if(objTypeString.call(allowedFileExtensions) == "[object Array]"){
	// 				if(allowedFileExtensions.indexOf(item.type) > -1){
	// 					whitelisted = true;
	// 				}
	// 			}
	// 			else if(objTypeString.call(allowedFileExtensions) == "[object String]"){
	// 				if(allowedFileExtensions==item.type){
	// 					whitelisted = true;
	// 				}
	// 			}
	// 		}
	// 		if(whitelisted) output.push(item);
	// 	});
	// 	return output;
	// }


	// function generateNavigation(tree){

	// }


	// function generateContent(tree){
	// 	var folderTemplate 	= 'src/styleguide/source/folder.template';
	// 	var templateTemplate 	= 'src/styleguide/source/template.template';
	// 	var outputUrl 			= 'src/styleguide/index.njk';
	// 	var content 			= 'There are no components in components folder';
	// 	var placeholder = {
	// 		url: /\[\[\[template-url]]]/g,
	// 		data: /\[\[\[template-data]]]/g,
	// 		info: /\[\[\[folder-info]]]/g,
	// 		tmpl: /\[\[\[folder-templates]]]/g
	// 	};


	// 	// -------------------------------------
	// 	//  get array of components
	// 	// -------------------------------------
	// 	var components = JSONtoFile(tree);
	// 	//console.table(components);
	// 	// console.log(components.length);

	// 	// -------------------------------------
	// 	//  read template
	// 	// -------------------------------------
	// 	var folderContents = fs.readFileSync(folderTemplate).toString();
	// 	var templateContents = fs.readFileSync(templateTemplate).toString();

	// 	// -------------------------------------
	// 	//  walk the tree
	// 	// -------------------------------------
	// 	if(components.length>0) content = "";
	// 	for (var key in components) {
	// 		if (components.hasOwnProperty(key)) {
	// 			console.info("Building a folder");
	// 			var tmplContent = '';
	// 			var tmpl = components[key].tmpl;
	// 			// var info = (objTypeString.call(components[key].info[0]) == "[object String]") ?
	// 			// 	fs.readFileSync(components[key].info[0]).toString() : "";
	// 			var info = (objTypeString.call(components[key].info[0]) == "[object String]") ?
	// 				components[key].info[0] : "";
	// 			var data = (objTypeString.call(components[key].data[0]) == "[object String]") ?
	// 				fs.readFileSync(components[key].data[0]).toString() : "''";

	// 			for (var index in tmpl) {
	// 				if (tmpl.hasOwnProperty(index)) {
	// 					// replace template & data placeholders
	// 					tmplContent += templateContents
	// 						.replace(placeholder.url, tmpl[index].replace(/\\/g,"/"))
	// 						.replace(placeholder.data, data);
	// 				}
	// 			}

	// 			// replace README & looping content placeholders
	// 			content += folderContents
	// 				.replace(placeholder.info, info.replace(/\\/g,"/"))
	// 				.replace(placeholder.tmpl, tmplContent);
	// 		}
	// 	}

	// 	//console.log(content);
	// 	return content;
	// }

	// /**
	//  * Recursive function which walks the JSON tree and
	//  * returns an array of objects (components).
	//  * Object consist of - template, data and info files.
	//  * @param {json} items - file structure in JSON format
	//  */
	// function JSONtoFile(items){
	// 	// console.info("----------- calling JSONtoFile -----------");
	// 	var results = [],
	// 		folder  = {},
	// 		tmplExt = ['nunjucks', 'njk'],
	// 		dataExt = ['json'],
	// 		infoExt = ['markdown','md'];
	// 	folder.tmpl = [];
	// 	folder.data = [];
	// 	folder.info = [];

	// 	//http://stackoverflow.com/questions/684672/loop-through-javascript-object
	// 	for (var key in items) {
	// 		if (items.hasOwnProperty(key)) {
	// 			if(items[key].type==='folder'){
	// 				// console.info(objTypeString.call(items[key].children));
	// 				if(objTypeString.call(items[key].children) != "[object Undefined]"){ //if has children
	// 					var output = JSONtoFile(items[key].children);
	// 					if(objTypeString.call(output)!="[object Undefined]"){
	// 						// console.table(output);
	// 						results = results.concat(output); 
	// 					}
	// 				}
	// 			}
	// 			else{
	// 				if(tmplExt.indexOf(items[key].type) > -1){
	// 					// console.info(items[key].type+" is a template!");
	// 					folder.tmpl.push(items[key].path);
	// 				}
	// 				else if(dataExt.indexOf(items[key].type) > -1){
	// 					// console.info(items[key].type+" is a data!");
	// 					folder.data.push(items[key].path);
	// 				}
	// 				else if(infoExt.indexOf(items[key].type) > -1){
	// 					// console.info(items[key].type+" is a documentation!");
	// 					folder.info.push(items[key].path);
	// 				}
	// 			}
	// 		}
	// 	}

	// 	// merge arrays
	// 	if(folder.tmpl.length > 0 || folder.data.length > 0 || folder.info.length > 0){
	// 		// console.log(folder);
	// 		results.push(folder)
	// 	}

	// 	// console.table(results);
	// 	if (results.length > 0) return results;
	// }

	// initialization();
// }
