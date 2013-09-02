
var COLUMN_TYPE_1 = 'type1';
var COLUMN_TYPE_2 = 'type2';
var COLUMN_TYPE_3 = 'empty';

var KEY_TYPE_NORMAL = 0;
var KEY_TYPE_REVERSE = 1;

function GameBoxOption() {
	this.SQUARE_WIDTH = 40;
	this.COLUMN_WIDTH = this.SQUARE_WIDTH + 3;
	this.SQUARE_HEIGHT = parseInt(getQuerystring("s", 20));
	this.SPACE_WIDTH = 4;
	this.SPACE_HEIGHT = 4;
	this.BORDER_HEIGHT = 2 * this.SPACE_HEIGHT;
	this.BORDER_WIDTH = 8;

	this.ColorLeft = { 'type2' : '#8a9bc7', 'type1' : '#1f97c3', 'empty' : null };
	this.Color = { 'type2' : '#4f87bf', 'type1' : '#016db5', 'empty' : null };
	this.StrokeColor = { 'type2' : '#ffffff', 'type1' : '#00bbb2', 'empty' : null };
	this.columnColor = 'rgba(0, 113, 187, 0.2)';
}

function RivalBoxOption() {
	this.SQUARE_WIDTH = 40;
	this.COLUMN_WIDTH = this.SQUARE_WIDTH + 3;
	this.SQUARE_HEIGHT = parseInt(getQuerystring("s", 20));
	this.SPACE_WIDTH = 4;
	this.SPACE_HEIGHT = 4;
	this.BORDER_HEIGHT = 2 * this.SPACE_HEIGHT;
	this.BORDER_WIDTH = 8;

	this.ColorLeft = { 'type2' : '#c8c8bf', 'type1' : '#9d6db5', 'empty' : null };
	this.Color = { 'type2' : '#9c9bc7', 'type1' : '#9835c3', 'empty' : null };
	this.StrokeColor = { 'type2' : '#ffffff', 'type1' : '#a360bb', 'empty' : null };
	this.columnColor = 'rgba(187, 53, 0, 0.2)';
}

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