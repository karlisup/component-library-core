/*jslint node: true */
'use strict';

// load dependencies
const fs = require('graceful-fs');				//filesystem
const path	= require('path');					//paths
const console = require('better-console');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();
const Twig = require('twig');
const twig = Twig.twig;						//twig render function
const watch = require('watch');
const rimraf = require('rimraf'); 			// remove folder
// const hl = require('highlight').Highlight;  // code highlighter
// const showdown = require('showdown').Converter();
const marked = require('marked');     		// markdown to HTML + higlight.js
// local dependencies
const helpers = require('./helpers');
const render = require('./TemplateEngine');
const hljs = require('./highlight');
// -------------------------------------
//  Configuration & Helper functions
// -------------------------------------
marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

// hljs.configure({tabReplace: '    '}); // 4 spaces  doesn't work! TODO

helpers.init();


// *************************************
//  COMPONENT LIBRARY GENERATOR
//  
// *************************************

// -------------------------------------
//  Settings
// -------------------------------------
 
module.exports = function(options){

	function getOptions (options) {
		var opts = options || {};

		opts.location.src = opts.location.src || '..\\..\\src\\components\\';
		opts.location.dest = opts.location.dest || '..\\..\\dest\\components\\';
		opts.location.styleguide = opts.location.styleguide || '..\\..\\src\\styleguide\\';

		opts.extensions.template = opts.extensions.template || '.twig';
		opts.extensions.output = opts.extensions.output || '.html';
		return opts;
	}

	var opts = getOptions(options);
	// console.log(options);

	function Component(filePath){
		this.path = ''; // relateive url
		this.name = '';
		this.tmpl = {};
		this.data = '';
		this.info = {};

		if(filePath){
			this.path = path.dirname(filePath).split(opts.location.src)[1]; // relative folder url
			this.name = path.basename(filePath, opts.extensions.template); ///foo/bar/baz/asdf/quux.html ==> quux;
			this.tmpl.path = path.join(this.path, this.name+opts.extensions.template);
		}
	}

	// INIT
	// output
	var treeStructure = [];			// folder structure (for navigation)
	var components = [];			// list of components
	var navigationContents = '';
	try {
		treeStructure = JSON.parse(fs.readFileSync(opts.location.styleguide+'treeStructure.json'), 'utf8');
		components = JSON.parse(fs.readFileSync(opts.location.styleguide+'components.json'), 'utf8');

	} catch (e) {
		console.warn('File Not found: '+e.path);
		console.warn('Running script for the first time?');
		console.info('Running build() function');
		build();
	}

	// recursive function
	function treeToJSON(dir, buildComponentsList){
		buildComponentsList = typeof buildComponentsList !== 'undefined' ? buildComponentsList : false;
		var output = [];				// variable which later will be returned.

		fs.readdirSync(dir).filter(function(file){
			var whitelisted = false;
			var item = {};
			item.title = file;																		// filename.twig
			item.folder = dir.split(opts.location.src)[1];
			// console.log(dir, opts.location.src, item.folder);									// relative folder url
			item.type = (path.extname(file) === '')? 'folder': path.extname(file).toLowerCase();	// folder || .json/.md/.twig..
			item.basename = path.basename(file, item.type);											// filename
			if(item.type !== 'folder'){
				item.src = path.join('/components/'+item.folder, item.basename + opts.extensions.output);
				// item.src = path.normalize(item.src).replace(/\//g, '\/');;
			}
			else{
				item.src = path.join(dir, file);
			}

			if(item.type == 'folder'){
				// if directory call function on new path
				item.children = treeToJSON(item.src, buildComponentsList);
				whitelisted = true;
			}
			else{
				// if file, make sure it's whitelisted
				if(opts.extensions.template === item.type){
					whitelisted = true;
					// assamble Component
					if(buildComponentsList){
						var component = new Component(path.join(dir, file));
						assembleComponent(component);
					}
				}
			}
			if(whitelisted) output.push(item);
		});
		return output;
	}

	function assembleComponent(component) {
		console.info('Assembling component: '+component.name);
		// var re = /(?:\.([^.]+))?$/; 	// get extension regexp TODO:deprecated
		fs.readdirSync(opts.location.src+component.path).filter(function(file){
			var extension = (path.extname(file) === undefined)? 'folder': path.extname(file).toLowerCase();
			if(file.substr(0, file.indexOf('.')) === component.name){ // only files with the same name as template
				switch (extension) {
					case '.json':
					component.data = path.join(component.path, file);
					break;
					case '.md':
					component.info.path = path.join(component.path, file);
					break;
				}
			}
		});
		components.push(component);
		return component;
	}



	function build(){
		// TODO make sure that there are no components in dest folder before creating new
		// could be the situation when .json files are missing/deleted, but dest component folder is still there
		treeStructure['data'] = treeToJSON(opts.location.src, true);
		navigationRender(treeStructure);
		renderAllComponents();

		// save tree structure & components in .json files
		console.table(treeStructure);
		console.table(components);
		// helpers.writeFile(opts.location.styleguide+'treeStructure.json', JSON.stringify(treeStructure, null, 4));
		// helpers.writeFile(opts.location.styleguide+'components.json', JSON.stringify(components, null, 4));
	}




	// -------------------------------------
	//  component related functions
	// -------------------------------------

	function componentExist(filePath){
		//TODO if passed colors.txt -- will still return colors object (there are no limitation for .extensions)
		//unique ID - path to item + name or tmpl name
		var compPath = path.dirname(filePath).split(opts.location.src)[1]; // relative folder url
		var compExtension = path.extname(filePath).toLowerCase();
		var compName = path.basename(filePath, compExtension); ///foo/bar/baz/asdf/quux.html ==> quux;
		// console.log(compPath, compName, compExtension);
		for (var key in components) {
			if (components.hasOwnProperty(key)) {
				if(components[key].path === compPath && components[key].name === compName){
					return components[key];
				}
			}
		}
		return false;
	}

	function componentUpdate(component, filePath, action){
		console.info('Updating component: '+action+' '+component.name);
		var extension = path.extname(filePath).toLowerCase();

		if(['.md','.json'].indexOf(extension) > -1){

			if(action==='add'){
				var relativeFileLocation = filePath.split(opts.location.src)[1]; // relative file url
				switch (extension) {
					case '.json':
					component.data = relativeFileLocation;
					break;
					case '.md':
					component.info.path = relativeFileLocation;
					break;
				}
			}
			else if(action==='rm'){
				switch (extension) {
					case '.json':
					component.data = '';
					break;
					case '.md':
					component.info.path = '';
					break;
				}
			}
			reloadTreeStructure();
		}
	}

	function componentDelete(component){
		console.warn('Deleting component: '+component.name+' from: '+component.path);
		rimraf(path.join(opts.location.dest, component.path) , function(err) {
			if (err){
				// throw err;
				console.error('unable to delete component because: '+err);
			}
			else{
				console.log('folder successfully removed, deleting component:'+ JSON.stringify(component, null, 4) );
				// is this the best way to do it?
				var componentIndex = components.indexOf(component);
				delete components[componentIndex]; // remove component from components array
				reloadTreeStructure(); // remove files from accessing from treeStructure array
				console.table(components);
			}
		});
	}

	/**
	 * How many template files does component have?
	 * @param  {object} component
	 * @return {int}          
	 */
	function templatesInFolder(component){
		var templateCount = 0;
		fs.readdirSync(opts.location.src+component.path).filter(function(file){
			templateCount += (path.extname(file) === opts.extensions.template)? 1 : 0;
		});

		return templateCount;
	}

	function templateDelete(component){
		console.warn('Deleting template: '+component.tmpl.path);
		var templateUrl = path.join(opts.location.dest, component.tmpl.compiled);
		fs.exists(templateUrl, function(exists) {
			if(exists) {
				fs.unlinkSync(templateUrl);			// delete destination file (template)
				var componentIndex = components.indexOf(component);
				delete components[componentIndex]; 	// remove component from components array
				reloadTreeStructure(); 				// remove files from accessing from treeStructure array
				console.table(components);
			} else {
				console.warn('Trying to delete file witch doesn\'t exist');
			}
		});
	}




	/**
	 * Function to update JSON tree structure (if file added/removed).
	 */
	function reloadTreeStructure(){
		treeStructure['data'] = treeToJSON(opts.location.src);
		helpers.writeFile(opts.location.styleguide+'treeStructure.json', JSON.stringify(treeStructure, null, 4));
	}

	function renderAllComponents(){
		for (var key in components) {
			if (components.hasOwnProperty(key)) {
				componentRender(components[key]);
			}
		}
	}


	function componentRender(component){
		console.info('Rendering component: '+component.name);
		

		// -------------------------------------
		//  Load files
		// -------------------------------------
		
		// load template
		var	templateContents = fs.readFileSync(opts.location.src+component.tmpl.path).toString();
		var componentContents = fs.readFileSync(opts.location.styleguide+'component.twig').toString();
		var layoutContents = fs.readFileSync(opts.location.styleguide+'layout.twig').toString();

		// load data
		var templateData;
		if(component.data !== ''){
			try{
				templateData = JSON.parse(fs.readFileSync(path.join(opts.location.src, component.data), 'utf8'));
			}catch(e){
				console.error(e);
			}
		}

		// load markdown (readme)
		var templateInfo;
		if(component.info.path !== undefined){
			try{
				templateInfo = fs.readFileSync(path.join(opts.location.src, component.info.path), 'utf8');
			}catch(e){
				console.error(e);
			}
		}

		
		// -------------------------------------
		//  Prepare content
		// -------------------------------------

		// compile Markdown to HTML
		if(templateInfo) component.info.compiled = marked(templateInfo);

		// compile template with given data
		// HERE SWITCH templating engine to prefered one
		// 
		// 
		// 
		
		// component.tmpl.compiled = twig({
		// 	allowInlineIncludes: true,
		// 	path: opts.location.src+component.tmpl.path
		// 	// data: templateContents
		// })
		// .render(templateData);
		// component.tmpl.compiled = template.render(templateData);

		component.tmpl.compiled = twig({
			allowInlineIncludes: true,
			href: opts.location.src+component.tmpl.path,
			async: false
			// data: templateContents
		})
		.render(templateData);


		//
		//
		//
		// compile raw template content to Raw Code Example [TODO: make this look good]
		var templateContents2 = templateContents.replace(/^((<[^>]+>|\t)+)/gm, function(match, p1) {
		return p1.replace(/\t/g, '    ');
		});
		component.tmpl.raw = hljs.highlightAuto(templateContents2).value;


		// -------------------------------------
		//  Compose component
		// -------------------------------------

		var componentTemplate = twig({ data: componentContents});
		var layoutTemplate = twig({ data: layoutContents});
		componentContents = componentTemplate.render({'data':{
			'compInfo': component.info.compiled,
			'tmplUrl': component.tmpl.path,
			'compCompiled': component.tmpl.compiled,
			'compRaw': component.tmpl.raw
		}});
		componentContents = layoutTemplate.render({'content': componentContents, 'navigation': navigationContents});


		// -------------------------------------
		//  Render component
		// -------------------------------------
		component.compiled = path.join(component.path, component.name+opts.extensions.output);
		// create file
		helpers.writeFile(path.join(opts.location.dest, component.compiled), componentContents, function(err){
			if(err){
				console.error(err);
			}
		});
	}

	function navigationRender(treeJSON){

		if(treeJSON){
			try{
				navigationContents = fs.readFileSync(path.join(opts.location.src, 'navigation/navigation.twig')).toString();;
				var template = twig({ data: navigationContents});
				navigationContents = template.render(treeJSON);
			}catch(e){
				console.error(e);
			}
			
		}
		else{
			console.error("Tree JSON is not defined");
		}
		
		console.warn(navigationContents);
	}



	// -------------------------------------
	//  Watch task
	// -------------------------------------
	watch.createMonitor(opts.location.src, function (monitor) {
		monitor.on('created', function (filePath) {
			console.warn('created: '+filePath);
			// if new template --> assembleComponent
			// if new file with same name as template - update .json(s)
			var extension = path.extname(filePath).toLowerCase();
			if(extension === opts.extensions.template){
				//TODO CHECK IF COMPONENT ALREADY EXISTS!
				let component = new Component(filePath);
				component = assembleComponent(component);
				componentRender(component);
			}
			else if(extension === ''){} // folder
			else{
				let component = componentExist(filePath);
				if(component){
					componentUpdate(component, filePath, 'add');
					componentRender(component);
				}
			}

			console.table(components);
		});
		monitor.on('changed', function (filePath) {
			console.warn('changed: '+filePath);
			// if file changed - check if component exists
			// if exist re-render component
			var component = componentExist(filePath);
			if(component){
				renderAllComponents();
				// componentRender(component);
			}
			
		});
		monitor.on('removed', function (filePath) {
			console.warn('removed: '+filePath);
			// if template deleted - remove component
			// if other file deleted - remove link & re-render component
			var extension = path.extname(filePath).toLowerCase();
			if(extension === opts.extensions.template){
				// folder can contain multiple tamplates
				let component = componentExist(filePath);
				if(component){
					var count = templatesInFolder(component);
					console.warn('templates in folder: '+count);
					if (count === 0){
						componentDelete(component);
					}
					else if(count > 0){
						templateDelete(component);
					}
				}
			}
			else if(extension === ''){} // folder
			else{
				let component = componentExist(filePath);
				if(component){
					componentUpdate(component, filePath, 'rm');
				}
			}		 
			 
			console.table(components);
		});
	// monitor.stop(); // Stop watching
	});
};