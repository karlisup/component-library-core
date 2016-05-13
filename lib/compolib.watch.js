'use strict';

var console = require('better-console');
var watch 	= require('watch');
// var shame 		= require('./lib/compolib.shame');		// all the functions yet I don't know to put 

module.exports = function(opts){
	console.info('Starting watching folder: '+opts.location.src);
	// shame()

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
				componentRender(component);
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
	});
}