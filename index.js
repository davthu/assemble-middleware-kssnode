/*
 * assemble-middleware-kssnode
 */

'use strict';

var fs = require('fs');
var kss = require('kss');
var assembleStyleguide = require('./lib/assemble-styleguide');

module.exports = function(params, next) {
  var grunt = params.grunt;
  var assemble = params.assemble;
  var options = assemble.options.kssnode || {};

  console.log('Running "assemble-middleware-kssnode" plugin...');

  fs.readFile(options.page, 'utf8', function(err, data) {
    if (err) return next(err);

    if(!fs.lstatSync(options.src).isDirectory()) {
      return next(new Error('"' + options.src + '" is not a directory!'));
    }

    kss.traverse(options.src, {mask: options.mask || '*.css'}, function(err, styleguide) {
      // TODO: This callback will never be executed if no files are found!
      if (err) return next(err);

      assembleStyleguide(assemble, data, styleguide, options, function(err, data) {
        if (err) return next(err);

        next();
      });
    });
  });
  

    

};

module.exports.options = {
  stage: 'assemble:post:pages'
};
