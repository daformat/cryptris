
var MAX_BOARD_LENGTH = 12;
var COLUMN_TYPE_1 = 'type1';
var COLUMN_TYPE_2 = 'type2';
var COLUMN_TYPE_3 = 'empty';

var KEY_TYPE_NORMAL = 0;
var KEY_TYPE_REVERSE = 1;

var DEFAULT_SPACE_WIDTH = 4;
var DEFAULT_SQUARE_WIDTH = 40;
var DEFAULT_COLUMN_WIDTH = DEFAULT_SQUARE_WIDTH + 3;
var DEFAULT_SQUARE_HEIGHT = 20;
var DEFAULT_SPACE_HEIGHT = 4;

function GameBoxOption() {
	this.SQUARE_WIDTH = DEFAULT_SQUARE_WIDTH;
	this.COLUMN_WIDTH = DEFAULT_COLUMN_WIDTH;
	this.SQUARE_HEIGHT = DEFAULT_SQUARE_HEIGHT;
	this.SPACE_WIDTH = DEFAULT_SPACE_WIDTH;
	this.SPACE_HEIGHT = DEFAULT_SPACE_HEIGHT;
	this.BORDER_HEIGHT = 2 * this.SPACE_HEIGHT;
	this.BORDER_WIDTH = 8;

	this.paused = false;

	this.ColorLeft = { 'type2' : 'rgba(20, 115, 158, 1)', 'type1' : 'rgba(107, 141, 167, 1)', 'empty' : null };
	this.Color = { 'type2' : 'rgba(1, 76, 131, 1)', 'type1' : 'rgba(53, 120, 157, 1)', 'empty' : null };
	this.blurColorLeft = { 'type1' : '#4dd0ff', 'type2' : '#e6e6e6', 'empty' : null };
	this.blurColor = { 'type1' : ' #0099ff', 'type2' : '#8ac7e6', 'empty' : null };

	this.StrokeColor = { 'type2' : 'rgba(0, 143, 148, 1)', 'type1' : 'rgba(178, 190, 201, 1)', 'empty' : null };
	this.blurStrokeColor = { 'type2' : 'rgba(255, 255, 255, 1)', 'type1' : 'rgba(0, 187, 178, 1)', 'empty' : null };

	this.defaultStrokeColor = { 'type2' : 'rgba(0, 143, 148, 1)', 'type1' : 'rgba(178, 190, 201, 1)', 'empty' : null };
	this.fullStrokeColor = { 'type2' : 'rgba(0, 143, 148, 0.5)', 'type1' : 'rgba(178, 190, 201, 0.5)', 'empty' : null };

	this.columnColor = 'rgba(0, 113, 187, 0.2)';
	this.objectsInMove = [];
	this.maxKeyNumber = 1;
	this.keyNeedToUpdate = false;
	this.endResolved = null;

	this.setDefaultColor = function() {
		this.StrokeColor = this.defaultStrokeColor;
	}

	this.setFullColor = function() {
		this.StrokeColor = this.fullStrokeColor;
	}

	this.numberColor = "#00e770";
	this.numberGrow = "#00FF9D";
}

function RivalBoxOption() {
	this.SQUARE_WIDTH = DEFAULT_SQUARE_WIDTH;
	this.COLUMN_WIDTH = this.SQUARE_WIDTH + 3;
	this.SQUARE_HEIGHT = DEFAULT_SQUARE_HEIGHT;
	this.SPACE_WIDTH = DEFAULT_SPACE_WIDTH;
	this.SPACE_HEIGHT = DEFAULT_SPACE_HEIGHT;
	this.BORDER_HEIGHT = 2 * this.SPACE_HEIGHT;
	this.BORDER_WIDTH = 8;
	
	this.paused = false;

	this.ColorLeft = { 'type2' : 'rgba(116, 109, 116, 1)', 'type1' : 'rgba(103, 70, 116, 1)', 'empty' : null };
	this.Color = { 'type2' : 'rgba(88, 83, 119, 1)', 'type1' : 'rgba(82, 34, 103, 1)', 'empty' : null };
	this.blurColorLeft = { 'type1' : '#b17bcc', 'type2' : '#e6dada', 'empty' : null };
	this.blurColor = { 'type1' : '#9f37cc', 'type2' : '#b5b1ff', 'empty' : null };

	this.StrokeColor = { 'type2' : 'rgba(189, 187, 191, 1)', 'type1' : 'rgba(125, 75, 142, 1)', 'empty' : null };
	this.blurStrokeColor = { 'type2' : 'rgba(255, 255, 255, 1)', 'type1' : 'rgba(163, 96, 187, 1)', 'empty' : null };

	this.defaultStrokeColor = { 'type2' : 'rgba(189, 187, 191, 1)', 'type1' : 'rgba(125, 75, 142, 1)', 'empty' : null };
	this.fullStrokeColor = { 'type2' : 'rgba(189, 187, 191, 0.5)', 'type1' : 'rgba(125, 75, 142, 0.5)', 'empty' : null };

	this.columnColor = 'rgba(187, 53, 0, 0.2)';
	this.objectsInMove = [];
	this.maxKeyNumber = 1;
	this.keyNeedToUpdate = false;
	this.endResolved = null;

	this.setDefaultColor = function() {
		this.StrokeColor = this.defaultStrokeColor;
	}

	this.setFullColor = function() {
		this.StrokeColor = this.fullStrokeColor;
	}
	this.numberColor = "#d30088";
	this.numberGrow = "#fc56fc";
}
