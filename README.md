# assemble-middleware-kssnode

> Generates Assemble pages from Knyle Style Sheets (KSS) documented CSS. 

Originally forked from [assemble-middleware-styleguide
](https://github.com/tomsky/assemble-middleware-styleguide) with modifications from [KSS Node](https://github.com/kss-node/kss-node). This middleware does pretty much the same thing except that it relies directly on KSS node rather than another fork. Another reason to make this module was the need include KSS node generated pages in the site navigation as well as being able to parse arbitrary CSS files.

## Installation
from the the command line, run:

```bash
npm install assemble-middleware-kssnode --save-dev
```

## Getting started 

To register the plugin with Assemble in your project's Gruntfile you can simply add the module's name to the `plugins` option:

```js
assemble: {
	options {
		layout: ['test/templates/layouts/default.hbs'],
	}
  styleguide: {
	  options: {
	  	layout: ['test/templates/layouts/default.hbs'],
      partials: ['test/templates/partials/**/*.hbs'],
	    plugins: ['assemble-middleware-kssnode', 'other/plugins/*.js'],
	    kssnode: {
	      page: 'templates/pages/styleguide.hbs', // Page template for each section
	      dest: 'dist',
	      src: 'src/css'
	      mask: '*.css' // Optional
	    }
	  },
	  files: {
    	'dist/index.html': ['templates/pages/index.hbs']
    }
  }
}
```

Running the task creates an [Assemble Page Object](http://assemble.io/docs/Collections.html) for each [KSS](https://github.com/kneath/kss/blob/master/SPEC.md) root section and exposes a `sections` collection that is created with the [KSS Node Module API](https://github.com/kss-node/kss-node/wiki/Module-API) in every instance of the provided [Handlebars](http://handlebarsjs.com) template.
