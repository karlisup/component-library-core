'use strict'

function filetreeToJSON (dir, buildComponentsList) {
  buildComponentsList = typeof buildComponentsList !== 'undefined' ? buildComponentsList : false;
  var output = [];        // variable which later will be returned.

  fs.readdirSync(dir).filter(function(file){
    var whitelisted = false;
    var item = {};
    item.title = file;                                    // filename.twig
    item.folder = dir.split(opts.location.src)[1];
    // console.log(dir, opts.location.src, item.folder);                  // relative folder url
    item.type = (path.extname(file) === '')? 'folder': path.extname(file).toLowerCase();  // folder || .json/.md/.twig..
    item.basename = path.basename(file, item.type);                     // filename
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