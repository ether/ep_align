var _ = require('ep_etherpad-lite/static/js/underscore');

var tags = ['left', 'center', 'justify', 'right'];

var collectContentPre = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(tags, tname);
  if(tname === "div" || tname === "p"){
    delete lineAttributes['align'];
  }
  if(tagIndex >= 0){
    lineAttributes['align'] = tags[tagIndex];
  }
};

// I don't even know when this is run..
var collectContentPost = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(tags, tname);
  if(tagIndex >= 0){
    delete lineAttributes['align'];
  }
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
