var eejs = require('ep_etherpad-lite/node/eejs/');
var Changeset = require("ep_etherpad-lite/static/js/Changeset");
var Security = require('ep_etherpad-lite/static/js/security');

exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  if (args.renderContext.isReadOnly) return cb();
  args.content = args.content + eejs.require("ep_align/templates/editbarButtons.ejs");
  return cb();
}

// line, apool,attribLine,text
exports.getLineHTMLForExport = async (hookName, context) => {
  var alignment = _analyzeLine(context.attribLine, context.apool);
  if (alignment) {
    context.lineContent = "<p style='text-align:" + alignment + "'>" + Security.escapeHTML(context.text.substring(1)) + "</p>";
    return "<p style='text-align:" + alignment + "'>" + Security.escapeHTML(context.text.substring(1)) + "</p>";
  }
}

function _analyzeLine(alineAttrs, apool) {
  var alignment = null;
  if (alineAttrs) {
    var opIter = Changeset.opIterator(alineAttrs);
    if (opIter.hasNext()) {
      var op = opIter.next();
      alignment = Changeset.opAttributeValue(op, 'align', apool);
    }
  }
  return alignment;
}
