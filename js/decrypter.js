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
            if (currentGame.scenes['create_key_scene'] != null) {
                currentGame.scenes['create_key_scene']['resize'](director, currentGame.scenes['create_key_scene']);
            }
            if (currentGame.scenes['play_solo_scene'] != null) {
                currentGame.scenes['play_solo_scene']['resize'](director, currentGame.scenes['play_solo_scene']);
            }
        }
    }
    resizeInProcess = false;
}


function createMessageForPlayScene(boardLength, message) {
    /**
     * Change message to ternary
     */
    var ternary_message = string_to_ternary(message);

    /**
     * Return the crypted message
     */
    var crypted_message = chiffre(boardLength, ternary_message, currentGame.playerKeyInfo.public_key[boardLength].key);
    return crypted_message;
}

/**
 * 
 */
function preparePlayScene(director, boardLength, boardName, crypt_message, hookActive, withIaBoard, helpEvent) {
    currentGame.scenes[boardName] = createPlayScene(director, boardLength, crypt_message, currentGame.playerKeyInfo, hookActive, withIaBoard, helpEvent);
}

/**
 * This function will be called to let you define new scenes.
 * @param director {CAAT.Director}
 */
function createScenes(director) {

    /**
     * Get info from url.
     */
    var keyInfo = getQuerystring('keyInfo', '');

    console.debug(keyInfo);
    var keyInfoElement = keyInfo.split('|');

    var keyInfoPublicKey = keyInfoElement[0].split(',').map(Number);
    var keyInfoPrivateKey = keyInfoElement[1].split(',').map(Number);
    var keyInfoCipher = keyInfoElement[2].split(',').map(Number);
    var keyInfoCurrentLength = parseInt(keyInfoElement[3]);


    console.debug(keyInfoPublicKey);
    console.debug(keyInfoPrivateKey);
    console.debug(keyInfoCipher);
    console.debug(keyInfoCurrentLength);

    currentGame.playerKeyInfo = generateKeyInfo(keyInfoPublicKey, keyInfoPrivateKey, keyInfoCurrentLength);
    var cryptedMessage = createADataMessage(keyInfoCipher, keyInfoCurrentLength);

    /**
     * Create each scene.
     */
    currentGame.scenes = {};

    // This scene is active between two scenes.
    preparePlayScene(director, MAX_BOARD_LENGTH, 'play_max_scene', cryptedMessage, 'playMaxSceneActive', false, true);
    currentGame.scenes['play_max_scene'].scene.setPaused(false);
    currentGame['playMaxSceneActive'] = true;
    currentGame.scenes.play_max_scene.add_key_symbol(currentGame.director, currentGame.scenes.play_max_scene);


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
