var SQUARE_WIDTH = 40;
var SQUARE_HEIGHT = parseInt(getQuerystring("s", 20));
var SPACE_WIDTH = 8;
var SPACE_HEIGHT = 4;
var BORDER_HEIGHT = 2 * SPACE_HEIGHT;

var STROKE_COLOR = '#000000';
var COLUMN_TYPE_1 = 'type1';
var COLUMN_TYPE_2 = 'type2';
var COLUMN_TYPE_3 = 'empty';
var ColorLeft = { 'type2' : '#8a9bc7', 'type1' : '#1f97c3', 'empty' : null };
var Color = { 'type2' : '#4f87bf', 'type1' : '#016db5', 'empty' : null };
var StrokeColor = { 'type2' : '#ffffff', 'type1' : '#00bbb2', 'empty' : null };

var KEY_TYPE_NORMAL = 0;
var KEY_TYPE_REVERSE = 1;

var crypt_key = null;
var objects_in_move = [];

function getQuerystring(key, default_) {
  if (default_==null) default_=""; 
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}