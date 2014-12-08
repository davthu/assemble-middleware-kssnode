# assemble-middleware-kssnode

> Generates Assemble pages from KSS documented CSS


## Getting started
In the command line, run:

```bash
npm install assemble-middleware-kssnode --save-dev
```
To register the plugin with Assemble in your project's Gruntfile you can simply add the module's name to the `plugins` option:

```js
assemble: {
  options: {
    plugins: ['assemble-middleware-kssnode', 'other/plugins/*.js'],
    kssnode: {
      page: 'templates/pages/styleguide.hbs',
      dest: 'dist/docs',
      src: 'src/css'
    }
  }
}
```