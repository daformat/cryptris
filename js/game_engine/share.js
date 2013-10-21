
var currentGame = new game();

function resizeMiniBoard(director, playScene) {

    playScene.game_box.relativeX = 10;
    playScene.game_box.resize(playScene.scene);
}

/**
 * This function all elements for the play scene.
 * @param director {CAAT.Director}
 */
function createMiniBoardScene(director, current_length, message, keyInfo, hookActive) {
    /**
     * Create the dict to return.
     */
    var resultScene = {};
    /**
     * Create the play scene.
     */
    resultScene.scene = director.createScene();
	 
    /**
     * Define the board resize option.
     */
    resultScene.resizeOption = new ResizeMiniBoardOption(current_length);

    /**
     * Set a blank key.
     */
    var blank_key = {'key' : [], 'normal_key' : [], 'number' : [], 'reverse_key' : []};
    for (var i = 0; i < current_length; ++i) {
    	blank_key.key.push(0);
    	blank_key.normal_key.push(COLUMN_TYPE_3);
    	blank_key.reverse_key.push(COLUMN_TYPE_3);
    	blank_key.number.push(0);
    }
    console.log(keyInfo.private_key[current_length]);

    /**
     * Create the player game board.
     */
    var playerBoxOption = new BoxOption(resultScene.scene, resultScene.resizeOption, playerBoardColorInfo, playerPSceneTime);
    var gameBoxInfo = new GameBox(director, playerBoxOption, 0, 0, current_length, blank_key, message, true, true);
    resultScene['game_box'] = gameBoxInfo;
    resultScene.scene.addChild(resultScene['game_box'].gameBox);

    resizeMiniBoard(director, resultScene);
    return resultScene;
}

/**
 * This function will be called to let you define new scenes.
 * @param director {CAAT.Director}
 */
function createScenes(director) {
	var current_length = MIN_BOARD_LENGTH;

    /**
     * Define a default set of public/private key.
     */
    currentGame.playerKeyInfo = getKeyInfo(current_length);

    /**
     * Change message to ternary
     */
    var ternary_message = string_to_ternary(currentGame.message);

    /**
     * Return the crypted message
     */
    var crypted_message = chiffre(current_length, ternary_message, currentGame.playerKeyInfo.public_key[current_length].key);

	console.log('ici');
    /**
     * Define a default set of public/private key.
     */
    currentGame.playerKeyInfo = getKeyInfo(current_length);

    /**
     * Create each scene.
     */
    currentGame.scenes = {};

    // This scene is active between two scenes.
    //currentGame.scenes['waiting_scene'] = director.createScene();
    currentGame.scenes['mini_board'] = createMiniBoardScene(director, current_length, crypted_message, currentGame.playerKeyInfo, 'mini-board');

    /**
     * Define the framerate.
     */
    CAAT.loop(60);
}

/**
 * This function preload each assets needed by the game and create each scenes..
 * @param director {CAAT.Director}
 */
function initGame(director) {
    /**
     * Image assets
     */
    var imgs= [];
    imgs.push({id:'logo-board', url: "img/assets/board-assets_03.png"});
    imgs.push({id:'pad-untouched', url: "img/assets/board-assets_35.png"});
    imgs.push({id:'pad-left', url: "img/assets/board-assets_25.png"});
    imgs.push({id:'pad-right', url: "img/assets/board-assets_29.png"});
    imgs.push({id:'pad-up', url: "img/assets/board-assets_34.png"});
    imgs.push({id:'pad-down', url: "img/assets/board-assets_27.png"});
    imgs.push({id:'pause-up', url: "img/assets/board-assets_11.png"});
    imgs.push({id:'pause-down', url: "img/assets/board-assets_16.png"});
    imgs.push({id:'help-up', url: "img/assets/board-assets_13.png"});
    imgs.push({id:'help-down', url: "img/assets/board-assets_18.png"});
    imgs.push({id:'timer', url: "img/assets/board-assets_07.png"});
    imgs.push({id:'left-board', url: "img/assets/left-board-assets_07.png"});
    imgs.push({id:'right-board', url: "img/assets/right-board-assets_07.png"});
    imgs.push({id:'center-board', url: "img/assets/center-board-assets_07.png"});
    imgs.push({id:'triangle-left', url: "img/assets/triangle-left.png"});
    imgs.push({id:'triangle-right', url: "img/assets/triangle-right.png"});
    imgs.push({id:'key-symbol', url: "img/key-symbol.png"});
    imgs.push({id:'icn-mini-ia-enveloppe', url: "img/icn-mini-ia-enveloppe.png.png"});
    imgs.push({id:'icn-mini-ia-key-symbol', url: "img/icn-mini-ia-key-symbol.png"});
    imgs.push({id:'icn-mini-ia-padlock-closed', url: "img/icn-mini-ia-padlock-closed.png"});
    imgs.push({id:'icn-mini-ia-padlock-open', url: "img/icn-mini-ia-padlock-open.png"});
    imgs.push({id:'icn-mini-player-enveloppe', url: "img/icn-mini-player-enveloppe.png"});
    imgs.push({id:'icn-mini-player-key-symbol', url: "img/icn-mini-player-key-symbol.png"});
    imgs.push({id:'icn-mini-player-padlock-closed', url: "img/icn-mini-player-padlock-closed.png"});
    imgs.push({id:'icn-mini-player-padlock-open', url: "img/icn-mini-player-padlock-open.png"});

    /**
     * Preload our necessarly images and load the splash screens.
     */
    new CAAT.Module.Preloader.ImagePreloader().loadImages(
        imgs,
        function on_load(counter, images) {
            if (counter === images.length) {
                director.emptyScenes();
                director.setImagesCache(images);
                createScenes(director);
                director.setClear(CAAT.Foundation.Director.CLEAR_ALL);
                CAAT.loop(60);
            }
        }
    );
}


function createMiniBoard() {

    /**
     * Debug flag, turn it off to production version.
     */
    CAAT.DEBUG = 0;//parseInt(getQuerystring('dbg', 0)) == 1;

    /* DAT.GUI */

    if(CAAT.DEBUG){

          var gui = new dat.GUI();
          gui.add(CAAT, 'FPS', 1, 120);

          try{
              gui.add(cryptrisSettings, 'readingDelay', 0, 10000);
              gui.add(cryptrisSettings, 'animateTextDelayBetweenLetters', 0, 1000);
            } catch(e){
                
            }
    }

    
    /**
     * We use this to enable some fonts in our gameBox.
     *//*
    $('.trick-font').each(function() {
        $(this).attr('style', 'display: none;');
    });*/

    /**
     * Declare our main caat director.
     */
    var onScreenCanvas  = $('#mini_board');
	currentGame.director = new CAAT.Director().initialize(456, 291, onScreenCanvas[0]).setClear(false);

    /**
     * Init the game
     */
    initGame(currentGame.director);
}

var baseHtml = 'http://' + document.domain + '/decrypter.html'
$(document).ready(function() {
	$("#share").submit(function() {
		var text = $("textarea").val();
		var ternary_message = string_to_ternary(text);

		var crypt_message = easy_crypt(ternary_message);
		var url = baseHtml + '?msg=' + crypt_message;

		var keyInfo = "";

		var message = easy_decrypt(crypt_message);

		currentGame.message = message[0] + message[1] + message[2];

		console.log(text + ' <=========== ' + crypt_message + ' =========> ' + message);
		console.log(url);
		createMiniBoard();
		return false;
	});

});
