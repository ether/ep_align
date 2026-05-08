'use strict';

const tags = ['left', 'center', 'justify', 'right'];

// Match `text-align: <value>` in a CSS style attribute. The leading
// boundary keeps us from accidentally matching `vertical-align` etc.
const STYLE_TEXT_ALIGN_RE = /(?:^|;|\s)text-align\s*:\s*(left|center|right|justify)\b/i;

exports.collectContentPre = (hookName, context, cb) => {
  const tname = context.tname;
  const state = context.state;
  const lineAttributes = state.lineAttributes;
  const tagIndex = tags.indexOf(tname);
  if (tname === 'div' || tname === 'p') {
    delete lineAttributes.align;
  }
  if (tagIndex >= 0) {
    lineAttributes.align = tags[tagIndex];
  }
  // Pick up `style="text-align:..."` on imported HTML so a round-trip
  // through HTML or DOCX preserves alignment. Etherpad core's
  // `getLineHTMLForExport` already serializes the alignment to an
  // inline style on `<p>` / `<h1..h6>`, but without this the importer
  // dropped it on the way back.
  if (context.styl) {
    const m = STYLE_TEXT_ALIGN_RE.exec(context.styl);
    if (m) {
      lineAttributes.align = m[1].toLowerCase();
    }
  }
  return cb();
};

// I don't even know when this is run..
exports.collectContentPost = (hookName, context, cb) => {
  const tname = context.tname;
  const state = context.state;
  const lineAttributes = state.lineAttributes;
  const tagIndex = tags.indexOf(tname);
  if (tagIndex >= 0) {
    delete lineAttributes.align;
  }
  return cb();
};
