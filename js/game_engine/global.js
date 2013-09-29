var MIN_BOARD_LENGTH = 8;
var MEDIUM_BOARD_LENGTH = 10;
var MAX_BOARD_LENGTH = 12;
var COLUMN_TYPE_1 = 'type1';
var COLUMN_TYPE_2 = 'type2';
var COLUMN_TYPE_3 = 'empty';

var KEY_TYPE_NORMAL = 0;
var KEY_TYPE_REVERSE = 1;

function game() {
	this.username = "PLAYER";
	this.ianame = "RJ-45";

    this.director = null;
	this.scenes = null;

    this.playerKeyInfo = null;

    this.iaCreateKeyTimer = null;
    this.goToDialog7 = false;

    this.maxNewKeyMove = 5;
    this.keyIsPregenerated = false;
    this.keyIsInPlace = false;
    this.nbrKeyClipping = 0;
    this.maxKeyClipping = 3;
    this.displayKey = false;

    this.createKeySceneActive = false;
    this.playSceneActive = false;

    this.deactivateScenes = function() {
    	this.createKeySceneActive = false;
    	this.playSceneActive = false;
    }
}

function ResizeOption(currentLength, numberBoard) {

	this.DEFAULT_SPACE_WIDTH = 4;
	this.DEFAULT_SQUARE_WIDTH = 40;
	this.DEFAULT_COLUMN_WIDTH = this.DEFAULT_SQUARE_WIDTH + 3;
	this.DEFAULT_SQUARE_HEIGHT = 20;
	this.DEFAULT_SPACE_HEIGHT = 4;
	this.DEFAULT_BORDER_WIDTH = 8;
	this.DEFAULT_BORDER_HEIGHT = 8;
	this.DEFAULT_SPACE_INFOCOLUMN_GAMEBOX = 10;
	this.DEFAULT_INFOCOLUMN_WIDTH = 240;
	this.DEFAULT_OUTSIDE_SPACE = 60;
	this.DEFAULT_BOTTOM_MARGIN = 100;
	this.DEFAULT_RELATIVE_Y = 110
	this.currentLength = currentLength;
	this.numberBoard = numberBoard;

}

function getRelativeX(resizeOption) {
    resizeOption.DEFAULT_SQUARE_WIDTH = 40 + 1;
    resizeOption.DEFAULT_COLUMN_WIDTH = resizeOption.DEFAULT_SQUARE_WIDTH + 3;

    var windowWidth = $(window).width();
    var canvasWidth = windowWidth + 1;

    var infoColumnWidth = resizeOption.numberBoard * resizeOption.DEFAULT_SPACE_INFOCOLUMN_GAMEBOX + resizeOption.DEFAULT_INFOCOLUMN_WIDTH;
    var margin = 2 * resizeOption.DEFAULT_OUTSIDE_SPACE;

    while (canvasWidth > windowWidth && resizeOption.DEFAULT_COLUMN_WIDTH > 10) {
        resizeOption.DEFAULT_SQUARE_WIDTH = resizeOption.DEFAULT_SQUARE_WIDTH - 1;
        resizeOption.DEFAULT_COLUMN_WIDTH = resizeOption.DEFAULT_COLUMN_WIDTH - 1;

        var gameBoxWidth = resizeOption.numberBoard * ((resizeOption.DEFAULT_COLUMN_WIDTH + resizeOption.DEFAULT_SPACE_WIDTH) * resizeOption.currentLength - resizeOption.DEFAULT_SPACE_WIDTH + 2 * resizeOption.DEFAULT_BORDER_WIDTH);
        canvasWidth = gameBoxWidth + infoColumnWidth + margin;
    }

    var relativeX = parseInt((windowWidth - canvasWidth + margin) / 2);
    return relativeX;
}

/**
 * For information:
 * type1 : white blocks
 * type2 : colored blocks
 */
var playerBoardColorInfo = {
	'colorLeft' : { 'type1' : 'rgba(107, 141, 167, 1)', 'type2' : 'rgba(20, 115, 158, 1)', 'empty' : null },
	'colorRight' : { 'type1' : 'rgba(53, 120, 157, 1)', 'type2' : 'rgba(1, 76, 131, 1)', 'empty' : null },
	'blurColorLeft' : { 'type1' : '#e6e6e6', 'type2' : '#4dd0ff', 'empty' : null },
	'blurColorRight' : { 'type1' : '#8ac7e6', 'type2' : ' #0099ff', 'empty' : null },
	'strokeColor' : { 'type1' : 'rgba(178, 190, 201, 1)', 'type2' : 'rgba(0, 143, 148, 1)', 'empty' : null },
	'blurStrokeColor' : { 'type1' : 'rgba(255, 255, 255, 1)', 'type2' : 'rgba(0, 187, 178, 1)', 'empty' : null },
	'defaultStrokeColor' : { 'type1' : 'rgba(178, 190, 201, 1)', 'type2' : 'rgba(0, 143, 148, 1)', 'empty' : null },
	'fullStrokeColor' : { 'type1' : 'rgba(178, 190, 201, 0.5)', 'type2' : 'rgba(0, 143, 148, 0.5)', 'empty' : null },
	'columnColor' : 'rgba(0, 113, 187, 0.2)',
	'numberColor' : '#00e770',
	'numberGrow' : '#00FF9D'
}
var iaBoardColorInfo = {
	'colorLeft' : { 'type2' : 'rgba(103, 70, 116, 1)', 'type1' : 'rgba(116, 109, 116, 1)', 'empty' : null },
	'colorRight' : { 'type2' : 'rgba(82, 34, 103, 1)', 'type1' : 'rgba(88, 83, 119, 1)', 'empty' : null },
	'blurColorLeft' : { 'type2' : '#b17bcc', 'type1' : '#e6dada', 'empty' : null },
	'blurColorRight' : { 'type2' : '#9f37cc', 'type1' : '#b5b1ff', 'empty' : null },
	'strokeColor' : { 'type2' : 'rgba(125, 75, 142, 1)', 'type1' : 'rgba(189, 187, 191, 1)', 'empty' : null },
	'blurStrokeColor' : { 'type2' : 'rgba(163, 96, 187, 1)', 'type1' : 'rgba(255, 255, 255, 1)', 'empty' : null },
	'defaultStrokeColor' : { 'type2' : 'rgba(125, 75, 142, 1)', 'type1' : 'rgba(189, 187, 191, 1)', 'empty' : null },
	'fullStrokeColor' : { 'type2' : 'rgba(125, 75, 142, 0.5)', 'type1' : 'rgba(189, 187, 191, 0.5)', 'empty' : null },
	'columnColor' : 'rgba(187, 53, 0, 0.2)',
	'numberColor' : '#d30088',
	'numberGrow' : '#fc56fc'
}

var playerPSceneTime = {
	'waitingIATime' : 250, // ms
	'keyFirstMoveTime' : 250, // ms
	'keyDownSpeed' : 10, // multiplicator of the initial speed.
	'levelUpNumberTime' : 750, // ms
	'blockDestroyedTime' : 250, // ms
	'messageUpTime' : 1000 // ms
}

var rivalPSceneTime = {
	'waitingIATime' : 250, // ms
	'keyFirstMoveTime' : 250, // ms
	'keyDownSpeed' : 10, // multiplicator of the initial speed.
	'levelUpNumberTime' : 750, // ms
	'blockDestroyedTime' : 250, // ms
	'messageUpTime' : 1000 // ms
}

/*
var createKeySceneTime = {
	'waitingIATime' : 100, // ms
	'keyFirstMoveTime' : 250, // ms
	'keyDownSpeed' : 10, // multiplicator of the initial speed.
	'levelUpNumberTime' : 750, // ms
	'blockDestroyedTime' : 250, // ms
	'messageUpTime' : 1000 // ms
}
*/

var createKeySceneTime = {
	'waitingIATime' : 50, // ms
	'keyFirstMoveTime' : 50, // ms
	'keyDownSpeed' : 5, // multiplicator of the initial speed.
	'levelUpNumberTime' : 50, // ms
	'blockDestroyedTime' : 50, // ms
	'messageUpTime' : 1000, // ms
	'keyAppearTime' : 2500, // ms (only necessary here.)
	'keyClippingTime' : 1000 // ms (only necessary here.)
}

function BoxOption(scene, resizeOption, boardColorInfo, timeInfo) {
	this.SQUARE_WIDTH = resizeOption.DEFAULT_SQUARE_WIDTH;
	this.COLUMN_WIDTH = resizeOption.DEFAULT_COLUMN_WIDTH;
	this.SQUARE_HEIGHT = resizeOption.DEFAULT_SQUARE_HEIGHT;
	this.SPACE_WIDTH = resizeOption.DEFAULT_SPACE_WIDTH;
	this.SPACE_HEIGHT = resizeOption.DEFAULT_SPACE_HEIGHT;
	this.BORDER_HEIGHT = resizeOption.DEFAULT_BORDER_HEIGHT;
	this.BORDER_WIDTH = resizeOption.DEFAULT_BORDER_WIDTH;

	this.resizeOption = resizeOption;
	this.scene = scene;

	this.boardColorInfo = boardColorInfo;
	this.timeInfo = timeInfo;
	this.objectsInMove = [];
	this.maxKeyNumber = 1;
	this.keyNeedToUpdate = false;
	this.endResolved = null;

	this.setDefaultColor = function() {
		this.boardColorInfo.strokeColor = this.boardColorInfo.defaultStrokeColor;
	}

	this.setFullColor = function() {
		this.boardColorInfo.strokeColor = this.boardColorInfo.fullStrokeColor;
	}
}
