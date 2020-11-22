const eejs = require('ep_etherpad-lite/node/eejs/');
const Changeset = require('ep_etherpad-lite/static/js/Changeset');
const Security = require('ep_etherpad-lite/static/js/security');

exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  if (args.renderContext.isReadOnly) return cb();
  args.content += eejs.require('ep_align/templates/editbarButtons.ejs');
  return cb();
};

// line, apool,attribLine,text
exports.getLineHTMLForExport = async (hookName, context) => {
  const alignment = _analyzeLine(context.attribLine, context.apool);
  if (alignment) {
    context.lineContent = `<p style='text-align:${alignment}'>${Security.escapeHTML(context.text.substring(1))}</p>`;
    return `<p style='text-align:${alignment}'>${Security.escapeHTML(context.text.substring(1))}</p>`;
  }
};

function _analyzeLine(alineAttrs, apool) {
  let alignment = null;
  if (alineAttrs) {
    const opIter = Changeset.opIterator(alineAttrs);
    if (opIter.hasNext()) {
      const op = opIter.next();
      alignment = Changeset.opAttributeValue(op, 'align', apool);
    }
  }
  return alignment;
}
