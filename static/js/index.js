const $ = require('ep_etherpad-lite/static/js/rjquery').$;
const _ = require('ep_etherpad-lite/static/js/underscore');

// All our tags are block elements, so we just return them.
var tags = ['left', 'center', 'justify', 'right'];
exports.aceRegisterBlockElements = function () {
  return tags;
};

// Bind the event handler to the toolbar buttons
exports.postAceInit = function (hook, context) {
  $('body').on('click', '.ep_align', function () {
    const value = $(this).data('align');
    const intValue = parseInt(value, 10);
    if (!_.isNaN(intValue)) {
      context.ace.callWithAce((ace) => {
        ace.ace_doInsertAlign(intValue);
      }, 'insertalign', true);
    }
  });

  return;
};

// On caret position change show the current align
exports.aceEditEvent = function (hook, call) {
  // If it's not a click or a key event and the text hasn't changed then do nothing
  const cs = call.callstack;
  if (!(cs.type == 'handleClick') && !(cs.type == 'handleKeyEvent') && !(cs.docTextChanged)) {
    return false;
  }
  // If it's an initial setup event then do nothing..
  if (cs.type == 'setBaseText' || cs.type == 'setup') return false;

  // It looks like we should check to see if this section has this attribute
  return setTimeout(() => { // avoid race condition..
    const attributeManager = call.documentAttributeManager;
    const rep = call.rep;
    let firstLine, lastLine;
    const activeAttributes = {};
    // $("#align-selection").val(-2); // TODO commented this out

    firstLine = rep.selStart[0];
    lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));
    let totalNumberOfLines = 0;

    _(_.range(firstLine, lastLine + 1)).each((line) => {
      totalNumberOfLines++;
      const attr = attributeManager.getAttributeOnLine(line, 'align');
      if (!activeAttributes[attr]) {
        activeAttributes[attr] = {};
        activeAttributes[attr].count = 1;
      } else {
        activeAttributes[attr].count++;
      }
    });

    $.each(activeAttributes, (k, attr) => {
      if (attr.count === totalNumberOfLines) {
        // show as active class
        const ind = tags.indexOf(k);
        // $("#align-selection").val(ind); // TODO commnented this out
      }
    });

    return;
  }, 250);
};

// Our align attribute will result in a heaading:left.... :left class
exports.aceAttribsToClasses = function (hook, context) {
  if (context.key == 'align') {
    return [`align:${context.value}`];
  }
};

// Here we convert the class align:left into a tag
exports.aceDomLineProcessLineAttributes = function (name, context) {
  const cls = context.cls;
  const domline = context.domline;
  const alignType = /(?:^| )align:([A-Za-z0-9]*)/.exec(cls);
  let tagIndex;
  if (alignType) tagIndex = _.indexOf(tags, alignType[1]);
  if (tagIndex !== undefined && tagIndex >= 0) {
    const tag = tags[tagIndex];
    const modifier = {
      preHtml: `<${tag} style="width:100%;margin:0 auto;list-style-position:inside;display:block;text-align:${tag}">`,
      postHtml: `</${tag}>`,
      processedMarker: true,
    };
    return [modifier];
  }
  return [];
};

// Find out which lines are selected and assign them the align attribute.
// Passing a level >= 0 will set a alignment on the selected lines, level < 0
// will remove it
function doInsertAlign(level) {
  const rep = this.rep;
  const documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd) || (level >= 0 && tags[level] === undefined)) {
    return;
  }

  let firstLine, lastLine;

  firstLine = rep.selStart[0];
  lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));
  _(_.range(firstLine, lastLine + 1)).each((i) => {
    if (level >= 0) {
      documentAttributeManager.setAttributeOnLine(i, 'align', tags[level]);
    } else {
      documentAttributeManager.removeAttributeOnLine(i, 'align');
    }
  });
}


// Once ace is initialized, we set ace_doInsertAlign and bind it to the context
exports.aceInitialized = function (hook, context) {
  const editorInfo = context.editorInfo;
  editorInfo.ace_doInsertAlign = _(doInsertAlign).bind(context);

  return;
}

exports.postToolbarInit = function (hook_name, context) {
  const editbar = context.toolbar; // toolbar is actually editbar - http://etherpad.org/doc/v1.5.7/#index_editbar

  editbar.registerCommand('alignLeft', function () {
    align(context, 0);
  });

  editbar.registerCommand('alignCenter',  function () {
    align(context, 1);
  });

  editbar.registerCommand('alignJustify',  function () {
    align(context, 2);
  });

  editbar.registerCommand('alignRight',  function () {
    align(context, 3);
  });

  return true;
};

function align(context, alignment){
  context.ace.callWithAce(function(ace){
    ace.ace_doInsertAlign(alignment);
    ace.ace_focus();
  },'insertalign' , true);
}

