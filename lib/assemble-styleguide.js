'use strict';

var _ = require('lodash-node');
var inflection = require('inflection');
var matter = require('gray-matter');

/**
 * Generate static html files from KSS documentation.
 *
 * @param {Object} `object` Main Assemble object.
 * @param {String} `string` Handlebars layout content
 * @param {Object} `object` KSS Node Styleguide collection
 * @param {Object} `object` Options
 * @param {Function} `function` Callback.
 */
function assembleStyleguide(assemble, page, styleguide, options, callback) {

  var sections = styleguide.section(),
    sectionCount = sections.length,
    sectionRoots = [],
    rootCount,
    currentRoot,
    childSections = [],
    pages = {},
    i;

  var parsedPage = matter(page);

  console.log(styleguide.data.files.map(function(file) {
    return ' - ' + file;
  }).join('\n'));

  if (sectionCount === 0) {
    return callback(new Error('No KSS documentation discovered in source files.'));
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
        assemble.options.collections[key] = assemble.util.update(item, pageObj, pageContext);
      }
    });
  }

  return callback(null);
}

/**
 * Get this sections parent path
 *
 * @param {String} `string` Section path
 */
function getParentRef (str) {
  'use strict';

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

/**
 * Convert an array of `KssSection` instances to a JSON object.
 *
 * @param {Array} `array` List of sections
 */
function jsonSections (sections) {
  'use strict';

  return sections.map(function(section) {
    return {
      header: section.header(),
      description: section.description(),
      reference: section.reference(),
      depth: section.depth(),
      deprecated: section.deprecated(),
      experimental: section.experimental(),
      markup: section.markup(),
      modifiers: jsonModifiers(section.modifiers()),
      parentRef: getParentRef(section.reference())
    };
  });
}

/**
 * Convert an array of `KssModifier` instances to a JSON object.
 *
 * @param {Array} `array` List of modifiers
 */
function jsonModifiers (modifiers) {
  'use strict';

  return modifiers.map(function(modifier) {
    return {
      name: modifier.name(),
      description: modifier.description(),
      className: modifier.className(),
      modifierMarkup: modifier.markup()
    };
  });
}

module.exports = assembleStyleguide;