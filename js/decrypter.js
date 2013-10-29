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

function specialOutInterpolator() {
    this.getPosition = function(time) {
        return {'x' : time, 'y' : 0};
    }
}

function specialInInterpolator() {
    this.getPosition = function(time) {
        return {'x' : time, 'y' : 1};
    }
}

function keyInfoDeCrypt(cipher) {
    var message = "";
    var data = {
        'a' : '0',
        'b' : '1',
        'c' : '2',
        'd' : '3',
        'e' : '4',
        'f' : '5',
        'g' : '6',
        'h' : '7',
        'i' : '8',
        'j' : '9',
        'k' : ',',
        'l' : '|',
        'm' : '-'
    };

    for (var i = 0; i < cipher.length; ++i) {
        message += data[cipher[i]];
    }

    return message;
}

/**
 * This function will be called to let you define new scenes.
 * @param director {CAAT.Director}
 */
function createScenes(director) {


    currentGame.playerKeyInfo = generateKeyInfo(currentGame.keyInfoPublicKey, currentGame.keyInfoPrivateKey, currentGame.keyInfoCurrentLength);
    var cryptedMessage = createADataMessage(currentGame.keyInfoCipher, currentGame.keyInfoCurrentLength);

    /**
     * Create each scene.
     */
    currentGame.scenes = {};

    var waiting_scene = director.createScene();

    preparePlayScene(director, MAX_BOARD_LENGTH, 'play_max_scene', cryptedMessage, 'playMaxSceneActive', false, 'playMasSceneHelp');
    currentGame.scenes['play_max_scene'].scene.setPaused(false);
    currentGame['playMaxSceneActive'] = true;


    currentGame.director.easeInOut(
                                    currentGame.director.getSceneIndex(currentGame.scenes.play_max_scene.scene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                    CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    500,
                                    true,
                                    new specialInInterpolator(),
                                    new specialOutInterpolator()
    );

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
    var imgs = getPreloadedImages();

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
function loadGame() {

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
}
