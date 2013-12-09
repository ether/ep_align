var _ = require('ep_etherpad-lite/static/js/underscore');

var tags = ['left', 'center', 'right', 'justify'];

var collectContentPre = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(tags, tname);
  if(tagIndex >= 0){
    lineAttributes['align'] = tags[tagIndex];
  }
};

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
