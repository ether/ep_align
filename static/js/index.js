var _, $, jQuery;

var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');

// All our tags are block elements, so we just return them.
var tags = ['left', 'center', 'justify', 'right'];
exports.aceRegisterBlockElements = function(){
  return tags;
}

// Bind the event handler to the toolbar buttons
exports.postAceInit = function(hook, context){
  var hs = $('#align-selection');
  hs.on('change', function(){
    var value = $(this).val();
    var intValue = parseInt(value,10);
    if(!_.isNaN(intValue)){
      context.ace.callWithAce(function(ace){
        ace.ace_doInsertAlign(intValue);
      },'insertalign' , true);
      hs.val("dummy");
    }
  })
};

// On caret position change show the current align
exports.aceEditEvent = function(hook, call, cb){

  // If it's not a click or a key event and the text hasn't changed then do nothing
  var cs = call.callstack;
  if(!(cs.type == "handleClick") && !(cs.type == "handleKeyEvent") && !(cs.docTextChanged)){
    return false;
  }
  // If it's an initial setup event then do nothing..
  if(cs.type == "setBaseText" || cs.type == "setup") return false;

  // It looks like we should check to see if this section has this attribute
  setTimeout(function(){ // avoid race condition..
    var attributeManager = call.documentAttributeManager;
    var rep = call.rep;
    var firstLine, lastLine;
    var activeAttributes = {};
    $("#align-selection").val(-2);

    firstLine = rep.selStart[0];
    lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));
    var totalNumberOfLines = 0;

    _(_.range(firstLine, lastLine + 1)).each(function(line){
      totalNumberOfLines++;
      var attr = attributeManager.getAttributeOnLine(line, "align");
      if(!activeAttributes[attr]){
        activeAttributes[attr] = {};
        activeAttributes[attr].count = 1;
      }else{
        activeAttributes[attr].count++;
      }
    });

    $.each(activeAttributes, function(k, attr){
      if(attr.count === totalNumberOfLines){
        // show as active class
        var ind = tags.indexOf(k);
        $("#align-selection").val(ind);
      }
    });

  },250);

}

// Our align attribute will result in a heaading:left.... :left class
exports.aceAttribsToClasses = function(hook, context){
  if(context.key == 'align'){
    return ['align:' + context.value ];
  }
}

// Here we convert the class align:left into a tag
exports.aceDomLineProcessLineAttributes = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var alignType = /(?:^| )align:([A-Za-z0-9]*)/.exec(cls);
  var tagIndex;
  if (alignType) tagIndex = _.indexOf(tags, alignType[1]);
  if (tagIndex !== undefined && tagIndex >= 0){
    var tag = tags[tagIndex];
    var modifier = {
      preHtml: '<'+tag+' style="width:100%;margin:0 auto;list-style-position:inside;display:block;text-align:' + tag + '">',
      postHtml: '</'+tag+'>',
      processedMarker: true
    };
    return [modifier];
  }
  return [];
};

// Find out which lines are selected and assign them the align attribute.
// Passing a level >= 0 will set a alignment on the selected lines, level < 0 
// will remove it
function doInsertAlign(level){
  var rep = this.rep,
    documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd) || (level >= 0 && tags[level] === undefined))
  {
    return;
  }

  var firstLine, lastLine;

  firstLine = rep.selStart[0];
  lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));
  _(_.range(firstLine, lastLine + 1)).each(function(i){
    if(level >= 0){
      documentAttributeManager.setAttributeOnLine(i, 'align', tags[level]);
    }else{
      documentAttributeManager.removeAttributeOnLine(i, 'align');
    }
  });
}


// Once ace is initialized, we set ace_doInsertAlign and bind it to the context
exports.aceInitialized = function(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertAlign = _(doInsertAlign).bind(context);
}


