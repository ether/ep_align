'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const ejs = require('ep_etherpad-lite/node_modules/ejs');

const root = path.resolve(__dirname, '..', '..', '..', '..');
const render = (name) =>
  ejs.render(fs.readFileSync(path.join(root, 'templates', name), 'utf8'), {});
const locales = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'en.json'), 'utf8'));
const epJson = JSON.parse(fs.readFileSync(path.join(root, 'ep.json'), 'utf8'));

// Maps the localization id of every alignment control in a template to the
// data-align value its click handler reads.
const alignments = (html) => {
  const found = {};
  for (const chunk of html.split('<li')) {
    const id = chunk.match(/data-l10n-id="(ep_align\.toolbar\.\w+\.title)"/);
    const value = chunk.match(/data-align="(\d+)"/);
    if (id && value) found[id[1]] = value[1];
  }
  return found;
};

describe(__filename, function () {
  let fileMenu;

  before(function () {
    fileMenu = render('fileMenu.ejs');
  });

  // https://github.com/ether/ether-plugins/issues/51
  it('file menu offers every alignment', function () {
    assert.deepEqual(Object.keys(alignments(fileMenu)).sort(), [
      'ep_align.toolbar.center.title',
      'ep_align.toolbar.justify.title',
      'ep_align.toolbar.left.title',
      'ep_align.toolbar.right.title',
    ]);
  });

  it('file menu and editbar agree on the align values', function () {
    // postAceInit binds one '.ep_align' handler that reads data-align, so an
    // entry with the wrong value would silently align the wrong way.
    assert.deepEqual(alignments(fileMenu), alignments(render('editbarButtons.ejs')));
  });

  it('the entries are localized', function () {
    for (const id of Object.keys(alignments(fileMenu))) {
      assert(locales[id], `${id} is missing from locales/en.json`);
    }
  });

  it('registers the entries in the paragraph formatting group', function () {
    // dd_format_block is the block right below Outdent in
    // ep_file_menu_toolbar's Format menu.
    assert.equal(epJson.parts[0].hooks.eejsBlock_dd_format_block, 'ep_align/index');
    assert.equal(typeof require(root).eejsBlock_dd_format_block, 'function');
  });
});
