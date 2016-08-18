[![Build Status](https://travis-ci.org/karlisup/component-library-core.svg?branch=master)](https://travis-ci.org/karlisup/component-library-core)

# Component Library Generator core
It does the dirty job. From `src` folder it takes each `.twig` template file and by adding 
* description (.md *optional*),
* test data (.json *optional*),
* style (.scss *optional*)
* javascript (.js *optional*)
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


## TODO
This is work in progress. It lacks
- [ ] real documentation
- [ ] `.tt` template support (important in ongoing project)
- [ ] option to pass JSON test data width `data@`
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
