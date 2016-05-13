'use strict'

var fs = require('graceful-fs')       // filesystem
var path = require('path')         // paths

var Components = function (components) {
  return components || {}
}

Components.prototype.render = function render (component) {
  console.info('Rendering component: ' + component.name)
  var templateData
  var templateContents = fs.readFileSync(this.opts.location.src + component.tmpl).toString()
  if (component.data !== '') {
    try {
      templateData = JSON.parse(fs.readFileSync(path.join(this.opts.location.src, component.data), 'utf8'))
    } catch (e) {
      return console.error(e)
    }
  }
}

Components.prototype.exist = function exist (filePath) {
  var compPath = path.dirname(filePath).split(this.opts.location.src)[1] // relative folder url
  var compExtension = path.extname(filePath).toLowerCase()
  var compName = path.basename(filePath, compExtension) // foo/bar/baz/asdf/quux.html ==> quux
  for (var key in this.components) {
    if (this.components.hasOwnProperty(key)) {
      if (this.components[key].path === compPath && this.components[key].name === compName) {
        return this.components[key]
      }
    }
  }
  return false
}

module.exports = Components







function componentExist(filePath){
    
  }


function update(component, filePath, action){
  console.info('Updating component: '+action+' '+component.name)
  var extension = path.extname(filePath).toLowerCase()

  if(['.md','.json'].indexOf(extension) > -1){

    if(action==='add'){
      var relativeFileLocation = filePath.split(opts.location.src)[1] // relative file url
      switch (extension) {
        case '.json':
        component.data = relativeFileLocation
        break
        case '.md':
        component.info = relativeFileLocation
        break
      }
    }
    else if(action==='rm'){
      switch (extension) {
        case '.json':
        component.data = ''
        break
        case '.md':
        component.info = ''
        break
      }
    }
    reloadTreeStructure()
  }
}

function cdelete (component) {
  console.warn('Deleting component: '+component.name+' from: '+component.path)
  rimraf(path.join(opts.location.dest, component.path) , function(err) {
    if (err){
      // throw err
      console.error('unable to delete component because: '+err)
    }
    else{
      console.log('folder successfully removed, deleting component:'+ JSON.stringify(component, null, 4) )
      // is this the best way to do it?
      var componentIndex = components.indexOf(component)
      delete components[componentIndex] // remove component from components array
      reloadTreeStructure() // remove files from accessing from treeStructure array
      console.table(components)
    }
  })
}