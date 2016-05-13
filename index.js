/* jslint node: true */
'use strict'

// load dependencies
// const path = require('path')         // paths
var fs = require('graceful-fs')				// filesystem
var console = require('better-console')
// const Twig = require('twig')
// const twig = Twig.twig						// twig render function
// const watch = require('watch')
// const rimraf = require('rimraf') 			// remove folder
// // local dependencies
// const helpers = require('./helpers')

// helpers.init()

var getOptions 	= require('./lib/compolib.getOptions')
var build     = require('./lib/compolib.build')
var watch 		= require('./lib/compolib.watch')

function CompoLib (options) {
  var opts = getOptions(options)

  opts.treeStructure = []
  opts.components = []
  opts.navigationContents = ''

  try {
    // trying to load navigation and components
    opts.treeStructure = JSON.parse(fs.readFileSync(opts.location.styleguide + 'treeStructure.json'), 'utf8')
    opts.components = JSON.parse(fs.readFileSync(opts.location.styleguide + 'components.json'), 'utf8')
  } catch (e) {
    // files do not exist. Build()
    console.warn('File Not found: ' + e.path)
    console.warn('Running script for the first time?')
    console.info('Running build() function')
    build(opts, function (err) {
      if (err) {
        return console.log(err)
      }
    })
  }

  // start watching
  // watch(this.opts)
}

// var inst = new CompoLib()
module.exports = CompoLib

// module.exports = function(options){

// 	function getOptions (options) {
// 		var opts = options || {};

// 		opts.location.src = opts.location.src || '..\\..\\src\\components\\';
// 		opts.location.dest = opts.location.dest || '..\\..\\dest\\components\\';
// 		opts.location.styleguide = opts.location.styleguide || '..\\..\\src\\styleguide\\';

// 		opts.extensions.template = opts.extensions.template || '.twig';
// 		opts.extensions.output = opts.extensions.output || '.html';
// 		return opts;
// 	}

// 	var opts = getOptions(options);
// 	// console.log(options);

// 	function Component(filePath){
// 		this.path = ''; // relateive url
// 		this.name = '';
// 		this.tmpl = '';
// 		this.data = '';
// 		this.info = '';

// 		if(filePath){
// 			this.path = path.dirname(filePath).split(opts.location.src)[1]; // relative folder url
// 			this.name = path.basename(filePath, opts.extensions.template); ///foo/bar/baz/asdf/quux.html ==> quux;
// 			this.tmpl = path.join(this.path, this.name+opts.extensions.template);
// 		}
// 	}

// 	// INIT
// 	// output
// 	var treeStructure = [];			// folder structure (for navigation)
// 	var components = [];			// list of components
// 	try {
// 		treeStructure = JSON.parse(fs.readFileSync(opts.location.styleguide+'treeStructure.json'), 'utf8');
// 		components = JSON.parse(fs.readFileSync(opts.location.styleguide+'components.json'), 'utf8');
// 	} catch (e) {
// 		console.warn('File Not found: '+e.path);
// 		console.warn('Running script for the first time?');
// 		console.info('Running build() function');
// 		build();
// 	}

// 	// recursive function
// 	function treeToJSON(dir, buildComponentsList){
// 		buildComponentsList = typeof buildComponentsList !== 'undefined' ? buildComponentsList : false;
// 		var output = [];				// variable which later will be returned.
// 		// var re = /(?:\.([^.]+))?$/; 	// get extension regexp TODO:deprecated

// 		// Produce this JSON structure:
// 		// [{
// 		// 	"name": "january",
// 		// 	"path": "winter/january",
// 		// 	"type": "directory",
// 		// 	"children": [
// 		// 		{
// 		// 			"path": "winter/january/ski.png",
// 		// 			"name": "ski.png",
// 		// 			"type": "png"
// 		// 		},
// 		// 		{
// 		// 			"path": "winter/january/snowboard.jpg",
// 		// 			"name": "snowboard.jpg",
// 		// 			"type": "jpg"
// 		// 		}
// 		// 	]
// 		// }]
// 		// 
// 		// Save components in array like:
// 		// [{
// 		// 	"path": "src/to/",
// 		// 	"name": "component",
// 		// 	"tmpl": "src/to/component.tmpl",
// 		// 	"data": "src/to/component.json",
// 		// 	"info": "src/to/component.md",
// 		// }]
// 		fs.readdirSync(dir).filter(function(file){
// 			var whitelisted = false;
// 			var item = {};
// 			item.name = file;
// 			item.path = path.join(dir, file);
// 			item.type = (path.extname(file) === '')? 'folder': path.extname(file).toLowerCase();
// 			var isDirectory = fs.statSync(item.path).isDirectory();
// 			if(isDirectory){
// 				// if directory call function on new path
// 				item.children = treeToJSON(item.path, buildComponentsList);
// 				whitelisted = true;
// 			}
// 			else{
// 				// if file, make sure it's whitelisted
// 				if(opts.extensions.template === item.type){
// 					whitelisted = true;
// 					// assamble Component
// 					if(buildComponentsList){
// 						var component = new Component(item.path);
// 						assembleComponent(component);
// 					}
// 				}
// 			}
// 			if(whitelisted) output.push(item);
// 		});
// 		return output;
// 	}

// 	function assembleComponent(component) {
// 		console.info('Assembling component: '+component.name);
// 		// var re = /(?:\.([^.]+))?$/; 	// get extension regexp TODO:deprecated
// 		fs.readdirSync(opts.location.src+component.path).filter(function(file){
// 			var extension = (path.extname(file) === undefined)? 'folder': path.extname(file).toLowerCase();
// 			if(file.substr(0, file.indexOf('.')) === component.name){ // only files with the same name as template
// 				switch (extension) {
// 					case '.json':
// 					component.data = path.join(component.path, file);
// 					break;
// 					case '.md':
// 					component.info = path.join(component.path, file);
// 					break;
// 				}
// 			}
// 		});
// 		components.push(component);
// 		return component;
// 	}



// 	function build(){
// 		// TODO make sure that there are no components in dest folder before creating new
// 		// could be the situation when .json files are missing/deleted, but dest component folder is still there
// 		treeStructure = treeToJSON(opts.location.src, true);

// 		for (var key in components) {
// 			if (components.hasOwnProperty(key)) {
// 				componentRender(components[key]);
// 			}
// 		}

// 		// save tree structure & components in .json files
// 		console.table(treeStructure);
// 		// console.log(JSON.stringify(treeStructure, null, 4));
// 		console.table(components);
// 		// console.log(opts.location.styleguide+'treeStructure.json');
// 		// console.log(opts.location.styleguide+'components.json');
// 		helpers.writeFile(opts.location.styleguide+'treeStructure.json', JSON.stringify(treeStructure, null, 4));
// 		helpers.writeFile(opts.location.styleguide+'components.json', JSON.stringify(components, null, 4));
// 	}




// 	// -------------------------------------
// 	//  component related functions
// 	// -------------------------------------
// 	function componentRender(component){
// 		console.info('Rendering component: '+component.name);
// 		var templateData;
// 		var	templateContents = fs.readFileSync(opts.location.src+component.tmpl).toString();
// 		if(component.data !== ''){
// 			try{
// 				templateData = JSON.parse(fs.readFileSync(path.join(opts.location.src, component.data), 'utf8'));
// 			}catch(e){
// 				console.error(e);
// 			}
// 		}
		
// 		// compile template with given data
// 		var template = twig({ data: templateContents});
// 		var output = template.render(templateData);
// 		component.compiled = path.join(component.path, component.name+opts.extensions.output);

// 		// create file
// 		helpers.writeFile(path.join(opts.location.dest, component.compiled), output, function(err){
// 			if(err){
// 				console.error(err);
// 			}
// 		});
// 	}

// 	function componentExist(filePath){
// 		//TODO if passed colors.txt -- will still return colors object (there are no limitation for .extensions)
// 		//unique ID - path to item + name or tmpl name
// 		var compPath = path.dirname(filePath).split(opts.location.src)[1]; // relative folder url
// 		var compExtension = path.extname(filePath).toLowerCase();
// 		var compName = path.basename(filePath, compExtension); ///foo/bar/baz/asdf/quux.html ==> quux;
// 		// console.log(compPath, compName, compExtension);
// 		for (var key in components) {
// 			if (components.hasOwnProperty(key)) {
// 				if(components[key].path === compPath && components[key].name === compName){
// 					return components[key];
// 				}
// 			}
// 		}
// 		return false;
// 	}

// 	function componentUpdate(component, filePath, action){
// 		console.info('Updating component: '+action+' '+component.name);
// 		var extension = path.extname(filePath).toLowerCase();

// 		if(['.md','.json'].indexOf(extension) > -1){

// 			if(action==='add'){
// 				var relativeFileLocation = filePath.split(opts.location.src)[1]; // relative file url
// 				switch (extension) {
// 					case '.json':
// 					component.data = relativeFileLocation;
// 					break;
// 					case '.md':
// 					component.info = relativeFileLocation;
// 					break;
// 				}
// 			}
// 			else if(action==='rm'){
// 				switch (extension) {
// 					case '.json':
// 					component.data = '';
// 					break;
// 					case '.md':
// 					component.info = '';
// 					break;
// 				}
// 			}
// 			reloadTreeStructure();
// 		}
// 	}

// 	function componentDelete(component){
// 		console.warn('Deleting component: '+component.name+' from: '+component.path);
// 		rimraf(path.join(opts.location.dest, component.path) , function(err) {
// 			if (err){
// 				// throw err;
// 				console.error('unable to delete component because: '+err);
// 			}
// 			else{
// 				console.log('folder successfully removed, deleting component:'+ JSON.stringify(component, null, 4) );
// 				// is this the best way to do it?
// 				var componentIndex = components.indexOf(component);
// 				delete components[componentIndex]; // remove component from components array
// 				reloadTreeStructure(); // remove files from accessing from treeStructure array
// 				console.table(components);
// 			}
// 		});
// 	}

// 	/**
// 	 * How many template files does component have?
// 	 * @param  {object} component
// 	 * @return {int}          
// 	 */
// 	function templatesInFolder(component){
// 		var templateCount = 0;
// 		fs.readdirSync(opts.location.src+component.path).filter(function(file){
// 			templateCount += (path.extname(file) === opts.extensions.template)? 1 : 0;
// 		});

// 		return templateCount;
// 	}

// 	function templateDelete(component){
// 		console.warn('Deleting template: '+component.tmpl);
// 		var templateUrl = path.join(opts.location.dest, component.compiled);
// 		fs.exists(templateUrl, function(exists) {
// 			if(exists) {
// 				fs.unlinkSync(templateUrl);			// delete destination file (template)
// 				var componentIndex = components.indexOf(component);
// 				delete components[componentIndex]; 	// remove component from components array
// 				reloadTreeStructure(); 				// remove files from accessing from treeStructure array
// 				console.table(components);
// 			} else {
// 				console.warn('Trying to delete file witch doesn\'t exist');
// 			}
// 		});
// 	}




// 	/**
// 	 * Function to update JSON tree structure (if file added/removed).
// 	 */
// 	function reloadTreeStructure(){
// 		treeStructure = treeStructure = treeToJSON(opts.location.src);
// 		helpers.writeFile(opts.location.styleguide+'treeStructure.json', JSON.stringify(treeStructure, null, 4));
// 	}


// 	// -------------------------------------
// 	//  Watch task
// 	// -------------------------------------
// 	watch.createMonitor(opts.location.src, function (monitor) {
// 		monitor.on('created', function (filePath) {
// 			console.warn('created: '+filePath);
// 			// if new template --> assembleComponent
// 			// if new file with same name as template - update .json(s)
// 			var extension = path.extname(filePath).toLowerCase();
// 			if(extension === opts.extensions.template){
// 				//TODO CHECK IF COMPONENT ALREADY EXISTS!
// 				let component = new Component(filePath);
// 				component = assembleComponent(component);
// 				componentRender(component);
// 			}
// 			else if(extension === ''){} // folder
// 			else{
// 				let component = componentExist(filePath);
// 				if(component){
// 					componentUpdate(component, filePath, 'add');
// 					componentRender(component);
// 				}
// 			}

// 			console.table(components);
// 		});
// 		monitor.on('changed', function (filePath) {
// 			console.warn('changed: '+filePath);
// 			// if file changed - check if component exists
// 			// if exist re-render component
// 			var component = componentExist(filePath);
// 			if(component){
// 				componentRender(component);
// 			}
			
// 		});
// 		monitor.on('removed', function (filePath) {
// 			console.warn('removed: '+filePath);
// 			// if template deleted - remove component
// 			// if other file deleted - remove link & re-render component
// 			var extension = path.extname(filePath).toLowerCase();
// 			if(extension === opts.extensions.template){
// 				// folder can contain multiple tamplates
// 				let component = componentExist(filePath);
// 				if(component){
// 					var count = templatesInFolder(component);
// 					console.warn('templates in folder: '+count);
// 					if (count === 0){
// 						componentDelete(component);
// 					}
// 					else if(count > 0){
// 						templateDelete(component);
// 					}
// 				}
// 			}
// 			else if(extension === ''){} // folder
// 			else{
// 				let component = componentExist(filePath);
// 				if(component){
// 					componentUpdate(component, filePath, 'rm');
// 				}
// 			}		 
			 
// 			console.table(components);
// 		});
// 	// monitor.stop(); // Stop watching
// 	});
// };