[![Build Status](https://travis-ci.org/karlisup/component-library-core.svg?branch=master)](https://travis-ci.org/karlisup/component-library-core)
[![Coverage Status](https://coveralls.io/repos/github/karlisup/component-library-core/badge.svg?branch=master)](https://coveralls.io/github/karlisup/component-library-core?branch=master)

# Component Library Generator core
It does the dirty job. From `src` folder it takes each `.twig` template file and by adding 
* description (.md *optional*),
* test data (.json *optional*),
* style (.scss *optional*)
* javascript (.js *optional*)
* demo (.demo.twig *optional*) (thanks to @davbizz )
generates **beautiful preview**

![Component Preview](http://www.neteye-blog.com/wp-content/uploads/2016/08/notification.png)

## Usage
This is how it is used in [Gulp](http://gulpjs.com/).
```javascript
gulp.task('styleguide', function (done) {
  styleguide({
    location: {
      root: '/',
      src: 'src/components/',
      dest: 'dest/components/'
    },
    extensions: {
      template: '.twig'
    }
  })
  done()
})
```

## Develping

 - Clone the github project in a new directory `git clone https://github.com/karlisup/component-library-core`
 - Install npm dependencies `npm install`
 - Create a global link to the module `npm link`
 - Create a new project otside the compnent-library-core project
 - Install compnent-library-core in the new project `npm install component-library-core`
 - Set te link to the local project `npm link component-library-core`


## TODO
This is work in progress. It lacks
- [ ] real documentation
- [ ] `.tt` template support (important in ongoing project)
- [x] __option to pass JSON test data width `data@`__
```json
{"sidebar": {
    "title": "Some title",
		"navigation": "data@pathToNavigation.json"
	}
}
```
- [ ] write 3 more tests (_"action not perfection"_)

Sincerely Yours,

Karlis ☝
