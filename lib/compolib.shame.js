'use strict';

function shame(CompoLib){

	CompoLib.prototype.componentRender = function(component){
		console.info('Rendering component: '+component.name);
		var templateData;
		var	templateContents = fs.readFileSync(opts.location.src+component.tmpl).toString();
		if(component.data !== ''){
			try{
				templateData = JSON.parse(fs.readFileSync(path.join(opts.location.src, component.data), 'utf8'));
			}catch(e){
				console.error(e);
			}
		}
	}
}


	

	// // -------------------------------------
	// //  component related functions
	// // -------------------------------------
	
		
	// 	// compile template with given data
	// 	var template = twig({ data: templateContents});
	// 	var output = template.render(templateData);
	// 	component.compiled = path.join(component.path, component.name+opts.extensions.output);

	// 	// create file
	// 	helpers.writeFile(path.join(opts.location.dest, component.compiled), output, function(err){
	// 		if(err){
	// 			console.error(err);
	// 		}
	// 	});
	// }

	// function componentExist(filePath){
	// 	//TODO if passed colors.txt -- will still return colors object (there are no limitation for .extensions)
	// 	//unique ID - path to item + name or tmpl name
	// 	var compPath = path.dirname(filePath).split(opts.location.src)[1]; // relative folder url
	// 	var compExtension = path.extname(filePath).toLowerCase();
	// 	var compName = path.basename(filePath, compExtension); ///foo/bar/baz/asdf/quux.html ==> quux;
	// 	// console.log(compPath, compName, compExtension);
	// 	for (var key in components) {
	// 		if (components.hasOwnProperty(key)) {
	// 			if(components[key].path === compPath && components[key].name === compName){
	// 				return components[key];
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }

	// function componentUpdate(component, filePath, action){
	// 	console.info('Updating component: '+action+' '+component.name);
	// 	var extension = path.extname(filePath).toLowerCase();

	// 	if(['.md','.json'].indexOf(extension) > -1){

	// 		if(action==='add'){
	// 			var relativeFileLocation = filePath.split(opts.location.src)[1]; // relative file url
	// 			switch (extension) {
	// 				case '.json':
	// 				component.data = relativeFileLocation;
	// 				break;
	// 				case '.md':
	// 				component.info = relativeFileLocation;
	// 				break;
	// 			}
	// 		}
	// 		else if(action==='rm'){
	// 			switch (extension) {
	// 				case '.json':
	// 				component.data = '';
	// 				break;
	// 				case '.md':
	// 				component.info = '';
	// 				break;
	// 			}
	// 		}
	// 		reloadTreeStructure();
	// 	}
	// }

	// function componentDelete(component){
	// 	console.warn('Deleting component: '+component.name+' from: '+component.path);
	// 	rimraf(path.join(opts.location.dest, component.path) , function(err) {
	// 		if (err){
	// 			// throw err;
	// 			console.error('unable to delete component because: '+err);
	// 		}
	// 		else{
	// 			console.log('folder successfully removed, deleting component:'+ JSON.stringify(component, null, 4) );
	// 			// is this the best way to do it?
	// 			var componentIndex = components.indexOf(component);
	// 			delete components[componentIndex]; // remove component from components array
	// 			reloadTreeStructure(); // remove files from accessing from treeStructure array
	// 			console.table(components);
	// 		}
	// 	});
	// }