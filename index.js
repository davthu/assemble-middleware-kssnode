/*
 * assemble-middleware-kssnode
 */

'use strict';

var fs = require('fs');
var kss = require('kss');
var _ = require('lodash-node');
var matter = require('gray-matter');
var inflection = require('inflection');

module.exports = function(params, done) {
  var grunt = params.grunt;
  var assemble = params.assemble;
  var options = assemble.options.kssnode || {};
  var page = fs.readFileSync(options.page, 'utf8');
  var parsedPage = matter(page);

  console.log('assemble-middleware-kssnode');


  function updateCollection(col, page, context) {
    if (!context[col.name]) {
      return col;
    }

    var singularName = col.inflection || inflection.singularize(col.name);
    var pageCol = context[col.name] || [];
    if (!Array.isArray(pageCol)) {
      pageCol = [pageCol];
    }

    pageCol.forEach(function(pageItem) {
      var i = _.findIndex(col.items, function(item) {
        return item[singularName] === pageItem;
      });

      if (i === -1) {
        var obj = {};
        obj[singularName] = pageItem;
        obj.pages = [page];
        col.items.push(obj);
      } else {
        col.items[i].pages.push(page);
      }
    });

    return col;
  }

  function getParentRef(str) {
    var a = str.indexOf('.');
    var b = str.lastIndexOf('.');
    if (a < 0) {
      return null;
    }
    else if (a === b) {
      return str.substring(0, 1);
    }
    else {
      return str.substring(a - 1, b);
    }
  }

  // Convert an array of `KssSection` instances to a JSON object.
  function jsonSections(sections) {
    return sections.map(function(section) {
      return {
        header: section.header(),
        description: section.description(),
        reference: section.reference(),
        depth: section.data.refDepth,
        deprecated: section.deprecated(),
        experimental: section.experimental(),
        markup: section.markup(),
        modifiers: jsonModifiers(section.modifiers()),
        parentRef: getParentRef(section.reference())
      };
    });
  }

  // Convert an array of `KssModifier` instances to a JSON object.
  function jsonModifiers(modifiers) {
    return modifiers.map(function(modifier) {
      return {
        name: modifier.name(),
        description: modifier.description(),
        className: modifier.className(),
        modifierMarkup: modifier.markup()
      };
    });
  }

  kss.traverse(options.src, {
    mask: options.mask || '*.css'
  }, function(err, styleguide) {
    if (err) {
      throw err;
    }

    var sections = styleguide.section('*.'),
      sectionCount = sections.length,
      sectionRoots = [],
      rootCount,
      currentRoot,
      childSections = [],
      pages = {},
      i;

    console.log(styleguide.data.files.map(function(file) {
      return ' - ' + file;
    }).join('\n'));

    if (sectionCount === 0) {
      throw 'No KSS documentation discovered in source files.';
    }

    // Accumulate all of the sections' first indexes
    // in case they don't have a root element.
    for (i = 0; i < sectionCount; i += 1) {
      currentRoot = sections[i].reference().match(/[0-9]*\.?/)[0].replace('.', '');
      if (!~sectionRoots.indexOf(currentRoot)) {
        sectionRoots.push(currentRoot);
      }
    }
    sectionRoots.sort();
    rootCount = sectionRoots.length;

    console.log("Assemble Styleguide:", sectionRoots);

    // Now, group all of the sections by their root
    // reference, and make a page for each.
    for (i = 0; i < rootCount; i += 1) {
      childSections = styleguide.section(sectionRoots[i] + '.*');
      var rootSection = styleguide.section(sectionRoots[i]);

      var pageContext = _.clone(parsedPage.data, true);

      var pageObj = {
        data: _.extend(pageContext, {
          sections: jsonSections(childSections),
          rootNumber: sectionRoots[i],
          sectionRoots: sectionRoots,
          title: rootSection.header(),
          section: 'styleguide'
        }),
        dest: options.dest + '/styleguide-' + sectionRoots[i] + '.html',
        page: parsedPage.content
      };

      assemble.options.collections.pages.items[0].pages.push(pageObj);
      _(assemble.options.collections).forEach(function(item, key) {
        if (key !== 'pages') {
          assemble.options.collections[key] = updateCollection(item, pageObj, pageContext);
        }
      });
    }

    done();
  });

};

module.exports.options = {
  stage: 'assemble:post:pages'
};
