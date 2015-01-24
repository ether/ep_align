var eejs = require('ep_etherpad-lite/node/eejs/');
var Changeset = require("ep_etherpad-lite/static/js/Changeset");
exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_align/templates/editbarButtons.ejs");
  return cb();
}

exports.eejsBlock_dd_format = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_align/templates/fileMenu.ejs");
  return cb();
}

exports.getLineHTMLForExport = function (hook, context) {
  var align = _analyzeLine(context.attribLine, context.apool);
  if (align) {
    return '<div style="width:100%;margin:0 auto;list-style-position:inside;text-align:' + align + '">' + context.lineContent + '</div>';
  }
}

function _analyzeLine(alineAttrs, apool) {
  var align = null;
  if (alineAttrs) {
    var opIter = Changeset.opIterator(alineAttrs);
    if (opIter.hasNext()) {
      var op = opIter.next();
      align = Changeset.opAttributeValue(op, 'align', apool);
    }
  }
  return align;
}
