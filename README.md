[![Build Status](https://travis-ci.org/karlisup/component-library-core.svg?branch=master)](https://travis-ci.org/karlisup/component-library-core)

# Component Library Generator core
It does the dirty job. In `components` folder, for each template file (.twig, .hb, .mustache, .tt2, etc.)
* description (.md)
* test data (.json)
is been added.
Returns
a) documentation
b) how does component looks like in iframe (so you can put e.g. 'position: fixed' elements in there)
c) see raw template / style (.sass, .less) / data 


## Steps
Simple things it does:
* get / set options
  ```javascript
  module.exports = function (options) {
    var opts = options || {}
  
    opts.location = (opts.location) ? opts.location : {}
    opts.extensions = (opts.extensions) ? opts.extensions : {}
  
    opts.location.root = opts.location.root || '/'
    opts.location.src = opts.location.src || '..\\..\\src\\components\\'
    opts.location.dest = opts.location.dest || '..\\..\\dest\\components\\'
    opts.location.styleguide = opts.location.styleguide || '..\\..\\src\\styleguide\\'
  
    opts.extensions.template = opts.extensions.template || '.twig'
    opts.extensions.output = opts.extensions.output || '.html'
  
    return opts
  }
  ```
* saves components from folder into JSON
* renders
  * component (documentation, navigation)
  * raw.component
  * dashboard (could be style guidelines or any other components you want to highlight) 
