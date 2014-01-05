/********************************************************************
 * Ensure that below files are included (in the same order) for the *
 * good behavior of this piece of code :                            *
 *     - game.js                                                    *
 *     - splash_screen.js                                           *
 *     - menu_screen.js                                             *
 *     - play_scene.js                                              *
 *******************************************************************/

var currentGame = new game();

/**
 * Launch all resize functions when the event is fired.
 */
var resizeInProcess = false;
function resize(director, newWidth, newHeight) {
    if (director.width < 800 || director.height < 600) {
        return;
    }

    if (resizeInProcess === false) {
        resizeInProcess = true;

        if (currentGame.scenes !== null) {
            if (currentGame.scenes['play_min_scene'] != null) {
                currentGame.scenes['play_min_scene']['resize'](director, currentGame.scenes['play_min_scene']);
            }
            if (currentGame.scenes['play_medium_scene'] != null) {
                currentGame.scenes['play_medium_scene']['resize'](director, currentGame.scenes['play_medium_scene']);
            }
            if (currentGame.scenes['play_max_scene'] != null) {
                currentGame.scenes['play_max_scene']['resize'](director, currentGame.scenes['play_max_scene']);
            }
            if (currentGame.scenes['play_super_max_scene'] != null) {
                currentGame.scenes['play_super_max_scene']['resize'](director, currentGame.scenes['play_super_max_scene']);
            }
            if (currentGame.scenes['play_mega_max_scene'] != null) {
                currentGame.scenes['play_mega_max_scene']['resize'](director, currentGame.scenes['play_mega_max_scene']);
            }
            if (currentGame.scenes['create_key_scene'] != null) {
                console.log('test');
                currentGame.scenes['create_key_scene']['resize'](director, currentGame.scenes['create_key_scene']);
            }
        }
    }
    resizeInProcess = false;
}


/**
 *
 *
 */
function prepareCreateKeyScene(director) {

    if (currentGame.scenes != null && currentGame.scenes.create_key_scene != null) {
        console.log('la');
        currentGame.director.removeChild(currentGame.scenes.create_key_scene.scene);
        currentGame.director.setClear(CAAT.Director.CLEAR_ALL);
    }
    currentGame.displayKey = false;
    /**
     * Define the current length of the message (and of the keys).
     */
    var current_length = MIN_BOARD_LENGTH;

    /**
     * Define an empty message.
     */
    var tmp_empty_message = [];
    for (var i = 0; i < current_length; ++i) {
        tmp_empty_message.push(0);
    }
    var empty_message = chiffre(current_length, tmp_empty_message, tmp_empty_message, currentGame.playerKeyInfo.private_key[current_length].key);

    currentGame.scenes['create_key_scene'] = createCreateKeyScene(director, current_length, empty_message, currentGame.playerKeyInfo, 'createKeySceneActive', 'helpCreateKeyEvent', 'pauseCreateKeyEvent');

}

function createMessageForPlayScene(boardLength, message) {
    /**
     * Change message to ternary
     */
    var ternary_message = string_to_ternary(message);

    /**
     * Return the crypted message
     */
    var crypted_message = chiffre(boardLength, ternary_message, currentGame.playerKeyInfo.public_key[boardLength].key, currentGame.playerKeyInfo.private_key[boardLength].key);
    return crypted_message;
}

/**
 * 
 */
function preparePlayScene(director, boardLength, boardName, crypt_message, hookActive, withIaBoard, helpEvent, pauseEvent) {
    currentGame.scenes[boardName] = createPlayScene(director, boardLength, crypt_message, currentGame.playerKeyInfo, hookActive, withIaBoard, helpEvent, pauseEvent);
}

/**
 * This function will be called to let you define new scenes.
 * @param director {CAAT.Director}
 */
function createScenes(director) {

    /**
     * Define a default set of public/private key.
     */
    currentGame.playerKeyInfo = getKeyInfo(MEGA_MAX_BOARD_LENGTH);

    /**
     * Create each scene.
     */
    currentGame.scenes = {};

    // This scene is active between two scenes.
    currentGame.scenes['waiting_scene'] = director.createScene();

    prepareCreateKeyScene(director);



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
    var imgs = getPreloadedImages();

    /**
     * Preload our necessarly.
     */
    var time = $.now();

    new CAAT.Module.Preloader.ImagePreloader().loadImages(
        imgs,
        function on_load(counter, images) {
            if (counter === images.length) {
                console.log($.now() - time);
                director.emptyScenes();
                director.setImagesCache(images);
                createScenes(director);
                director.setClear(CAAT.Foundation.Director.CLEAR_ALL);
                CAAT.loop(60);
            }
        }
    );
}

/**
 * Startup it all up when the document is ready.
 */
$(document).ready(function() {

    /**
     * Debug flag, turn it off to production version.
     */
    CAAT.DEBUG = parseInt(getQuerystring('dbg', 0)) == 1;

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
     */
    $('.trick-font').each(function() {
        $(this).attr('style', 'display: none;');
    });

    /**
     * Declare our main caat director.
     */
    var onScreenCanvas  = $('#main_scene');
	currentGame.director = new CAAT.Director().initialize($(document).width(), $(document).height(), onScreenCanvas[0]).setClear(false);

    /**
     * Init the game
     */
    initGame(currentGame.director);

    /**
     * Enable resize events.
     */
    currentGame.director.enableResizeEvents(CAAT.Foundation.Director.RESIZE_BOTH, resize);
});

/**
 *  Select player / ia key type in menu
 */
$(function(){
    $(".select-key-type a").click(function(){
        var $t = $(this);
        $t.toggleClass("public").toggleClass("private");

        if ($t.context.id === "player-key") {
            if ($t.hasClass("public")) {
                $t.find(".key-desc").text("clé publique");

                currentGame.playerKeyType = "public";
                playerBoardColorInfo['key-symbol'] = 'icn-mini-ia-key-symbol-left';
                playerBoardColorInfo['keychain'] = 'keychain-ia-left';
            } else {
                $t.find(".key-desc").text("clé privée");
                currentGame.playerKeyType = "private";
                playerBoardColorInfo['key-symbol'] = 'icn-mini-player-key-symbol';
                playerBoardColorInfo['keychain'] = 'keychain-player';
            }
        } else {
            if ($t.hasClass("public")) {
                $t.find(".key-desc").text("clé publique");
                currentGame.iaKeyType = "public";
                iaBoardColorInfo['key-symbol'] = 'icn-mini-ia-key-symbol';
                iaBoardColorInfo['keychain'] = 'keychain-ia';
            } else {
                $t.find(".key-desc").text("clé privée");
                currentGame.iaKeyType = "private";
                iaBoardColorInfo['key-symbol'] = 'icn-mini-player-key-symbol-right';
                iaBoardColorInfo['keychain'] = 'keychain-player-right';
            }
        }
    });
})
