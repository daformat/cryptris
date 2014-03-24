

/**
 *  Level board width (in columns)
 */

var MIN_BOARD_LENGTH = 8;
var MEDIUM_BOARD_LENGTH = 10;
var MAX_BOARD_LENGTH = 12;
var SUPER_MAX_BOARD_LENGTH = 14;
var MEGA_MAX_BOARD_LENGTH = 16;



/**
 *  Columns identifiers
 */

var COLUMN_TYPE_1 = 'type1';
var COLUMN_TYPE_2 = 'type2';
var COLUMN_TYPE_3 = 'empty';



/**
 *  Maximum allowed column value, if any column reaches a greater 
 *  (absolute) value than this setting, we'll throw a dialog explaining
 *  that the player is doing it wrong and give the option to restart 
 *  the game or to give up
 */

var MAX_BLOCKS_IN_A_COLUMN = 600;

/**
 *  Key type identifiers
 */

var KEY_TYPE_NORMAL = 0;
var KEY_TYPE_REVERSE = 1;


/**
 *  In-game level messages
 */

var FIRST_MESSAGE = "OK";
var FIRST_BATTLE_MESSAGE = "24";
var SECOND_BATTLE_MESSAGE = "78";
var THIRD_BATTLE_MESSAGE = " 31";


/**
 *  Arcade messages
 */

var FIRST_CHALLENGE_MESSAGE = "24";
var SECOND_CHALLENGE_MESSAGE = "74";
var THIRD_CHALLENGE_MESSAGE = "131";
var FOURTH_CHALLENGE_MESSAGE = "435";
var FIFTH_CHALLENGE_MESSAGE = "1337";


/**
 *  TODO
 */

var indexToReset = MIN_BOARD_LENGTH;


/**
 *
 */

function game() {
	this.username = "JOUEUR";
	this.ianame = "LOGICIEL ESPION";

	this.miniScreen = false;
	this.validateCurrentBoard = false;

	this.professorScene = false;

	this.playerKeyType = "private";
	this.iaKeyType = "public";

	this.hookTest = {};
	this.animateEncryptionMove = null;
	this.lastAnimateEncryptionMove = null;

    this.createKeySceneActiveTime = 0;
    this.playMinSceneActiveTime = 0;
    this.playMediumSceneActiveTime = 0;
    this.playMaxSceneActiveTime = 0;
    this.playSuperMaxSceneActiveTime = 0;
    this.playMegaMaxSceneActiveTime = 0;
    this.playSoloSceneActiveTime = 0;
    this.playChercheuseSceneActiveTime = 0;

    this.director = null;
	this.scenes = null;

    this.playerKeyInfo = null;

    this.iaCreateKeyTimer = null;
    this.goToNextDialog = false;
    this.gameOver = false;

    this.maxNewKeyMove = 6; // How many moves needed before lauching automatic key generation
    this.keyIsPregenerated = false;
    this.keyIsInPlace = false;
    this.nbrKeyClipping = 0;
    this.maxKeyClipping = 3; // times key blinks before stopping
    this.displayKey = false;
    this.stopCreateKeyAfterResolve = false;

    this.createKeySceneActive = false;
    this.playMinSceneActive = false;
    this.playMediumSceneActive = false;
    this.playMaxSceneActive = false;
    this.playSuperMaxSceneActive = false;
    this.playMegaMaxSceneActive = false;
    this.playSoloSceneActive = false;
    this.playChercheuseSceneActive = false;

    this.deactivateScenes = function(hookActive) {
    	if (hookActive !== 'createKeySceneActive') {
	    	this.createKeySceneActive = false;
	    }
	    if (hookActive !== 'playMinSceneActive') {
	    	this.playMinSceneActive = false;
	    }
	    if (hookActive !== 'playMediumSceneActive') {
	    	this.playMediumSceneActive = false;
	    }
	    if (hookActive !== 'playMaxSceneActive') {
	    	this.playMaxSceneActive = false;
	    }
	    if (hookActive !== 'playSuperMaxSceneActive') {
	    	this.playSuperMaxSceneActive = false;
	    }
	    if (hookActive !== 'playMegaMaxSceneActive') {
	    	this.playMaxMegaSceneActive = false;
	    }
	    if (hookActive !== 'playSoloSceneActive') {
	    	this.playSoloSceneActive = false;
	    }
	    if (hookActive !== 'playChercheuseSceneActive') {
	    	this.playChercheuseSceneActive = false;
	    }
    }
}

function ResizeMiniBoardOption(currentLength) {

	this.DEFAULT_SPACE_WIDTH = 4;
	if (currentLength === MAX_BOARD_LENGTH) {
		this.DEFAULT_SQUARE_WIDTH = 24;
	} else if (currentLength === MEDIUM_BOARD_LENGTH) {
		this.DEFAULT_SQUARE_WIDTH = 30;
	} else if (currentLength === MIN_BOARD_LENGTH) {
		this.DEFAULT_SQUARE_WIDTH = 40;
	} else if (currentLength === SUPER_BOARD_LENGTH) {
		this.DEFAULT_SQUARE_WIDTH = 10;
	} else if (currentLength === MEGA_BOARD_LENGTH) {
		this.DEFAULT_SQUARE_WIDTH = 10;
	}
	this.DEFAULT_COLUMN_WIDTH = this.DEFAULT_SQUARE_WIDTH + 3;
	this.DEFAULT_SQUARE_HEIGHT = 20;
	this.DEFAULT_SPACE_HEIGHT = 4;
	this.DEFAULT_BORDER_WIDTH = 8;
	this.DEFAULT_BORDER_HEIGHT = 8;
	this.DEFAULT_SPACE_INFOCOLUMN_GAMEBOX = 10;
	this.DEFAULT_OUTSIDE_SPACE = 60;
	this.DEFAULT_BOTTOM_MARGIN = 100;
	this.DEFAULT_RELATIVE_Y = 0
	this.currentLength = currentLength;
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
	this.DEFAULT_RELATIVE_Y = 110;
	this.DEFAULT_RELATIVE_Y_WITH_GAUGE = 90;
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
 * type1 : white blocks (positive)
 * type2 : colored blocks (negative)
 * colorLeft : In a block, this is the left color of the linearGradient.
 * colorRight : In a block, this is the right color of the linearGradient.
 */

var playerBoardColorInfo = {
	'colorLeft' : { 'type1' : 'rgba(107, 141, 167, 1)', 'type2' : 'rgba(20, 115, 158, 1)', 'empty' : null },
	'colorRight' : { 'type1' : 'rgba(53, 120, 157, 1)', 'type2' : 'rgba(1, 76, 131, 1)', 'empty' : null },
	'blurColorLeft' : { 'type1' : '#e6e6e6', 'type2' : '#4dd0ff', 'empty' : null },
	'blurColorRight' : { 'type1' : '#8ac7e6', 'type2' : '#0099ff', 'empty' : null },
	'strokeColor' : { 'type1' : 'rgba(178, 190, 201, 1)', 'type2' : 'rgba(0, 143, 148, 1)', 'empty' : null },
	'blurStrokeColor' : { 'type1' : 'rgba(255, 255, 255, 1)', 'type2' : 'rgba(0, 187, 178, 1)', 'empty' : null },
	'defaultStrokeColor' : { 'type1' : 'rgba(178, 190, 201, 1)', 'type2' : 'rgba(0, 143, 148, 1)', 'empty' : null },
	'fullStrokeColor' : { 'type1' : 'rgba(178, 190, 201, 0.5)', 'type2' : 'rgba(0, 143, 148, 0.5)', 'empty' : null },
	'columnColor' : 'rgba(0, 113, 187, 0.2)',
	'numberColor' : '#00e770',
	'numberGrow' : '#00FF9D',
	'letterBoxColor' : '#00FF9D',
	'letterColor' : '#ffffff',
	'letterColorGrow' : '#00FF9D',
	'enveloppe' : 'icn-mini-player-enveloppe',
	'key-symbol' : 'icn-mini-player-key-symbol',
	'keychain' : 'keychain-player',
	'padlock-closed' : 'icn-mini-player-padlock-closed',
	'padlock-open' : 'icn-mini-player-padlock-open'
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
	'numberGrow' : '#fc56fc',
	'letterBoxColor' : '#fc56fc',
	'letterColor' : '#ffffff',
	'letterColorGrow' : '#fc56fc',
	'enveloppe' : 'icn-mini-ia-enveloppe',
	'key-symbol' : 'icn-mini-ia-key-symbol',
	'keychain' : 'keychain-ia',
	'padlock-closed' : 'icn-mini-ia-padlock-closed',
	'padlock-open' : 'icn-mini-ia-padlock-open'
}

var playerPSceneTime = {
	'waitingIATime' : 250, // ms
	'keyFirstMoveTime' : 250, // ms
	'keyDownSpeed' : 10, // multiplicator of the initial speed.
	'levelUpNumberTime' : 750, // ms
	'blockDestroyedTime' : 250, // ms
}

var rivalPSceneTime = {
	'waitingIATime' : 250, // ms
	'keyFirstMoveTime' : 250, // ms
	'keyDownSpeed' : 10, // multiplicator of the initial speed.
	'levelUpNumberTime' : 750, // ms
	'blockDestroyedTime' : 250, // ms
}

var rivalPMinSceneTime = {
	'waitingIATime' : 250, // ms
	'keyFirstMoveTime' : 250, // ms
	'keyDownSpeed' : 10, // multiplicator of the initial speed.
	'levelUpNumberTime' : 750, // ms
	'blockDestroyedTime' : 250, // ms
}

var rivalPMediumSceneTime = {
	'waitingIATime' : 100, // ms
	'keyFirstMoveTime' : 200, // ms
	'keyDownSpeed' : 6, // multiplicator of the initial speed.
	'levelUpNumberTime' : 500, // ms
	'blockDestroyedTime' : 200, // ms
}

var rivalPMaxSceneTime = {
	'waitingIATime' : 50, // ms
	'keyFirstMoveTime' : 100, // ms
	'keyDownSpeed' : 4, // multiplicator of the initial speed.
	'levelUpNumberTime' : 200, // ms
	'blockDestroyedTime' : 100, // ms
}

var createKeySceneTime = {
	'waitingIATime' : 100, // ms
	'keyFirstMoveTime' : 250, // ms
	'keyDownSpeed' : 8, // multiplicator of the initial speed.
	'levelUpNumberTime' : 750, // ms
	'blockDestroyedTime' : 250, // ms
	'messageUpTime' : 800, // ms (only necessary here.)
	'keyAppearTime' : 800, // ms (only necessary here.)
	'keyClippingTime' : 500 // ms (only necessary here.)
}

var createKeyIASceneTime = {
	'waitingIATime' : 100, // ms
	'keyFirstMoveTime' : 250, // ms
	'keyDownSpeed' : 4, // multiplicator of the initial speed.
	'levelUpNumberTime' : 750, // ms
	'blockDestroyedTime' : 250, // ms
	'messageUpTime' : 800, // ms (only necessary here.)
	'keyAppearTime' : 800, // ms (only necessary here.)
	'keyClippingTime' : 500 // ms (only necessary here.)
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
