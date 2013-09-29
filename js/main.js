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
    if (director.width < 800 || director.height < 500) {
        return;
    }

    if (resizeInProcess === false) {
        resizeInProcess = true;

        if (currentGame.scenes !== null) {
            if (currentGame.scenes['play_min_scene'] != null) {
                currentGame.scenes['play_min_scene']['resize'](director, currentGame.scenes['play_min_scene']);
            }
            if (currentGame.scenes['create_key_scene'] != null) {
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
    var empty_message = chiffre(current_length, tmp_empty_message, tmp_empty_message);

    currentGame.scenes['create_key_scene'] = createCreateKeyScene(director, current_length, empty_message, currentGame.playerKeyInfo);
}

/**
 *
 */
function preparePlayScene(director, boardLength, boardName, message) {

    /**
     * Define the current length of the message (and of the keys).
     */
    var current_length = getQuerystring("n", boardLength);

    /**
     * Define a TEMPORARY message.
     */
    var tmp_message = [];
    for (var i = 0; i < current_length; ++i) {
        tmp_message.push(Math.floor(Math.random() * 3 - 1));
    }
    var crypt_message = chiffre(current_length, tmp_message, currentGame.playerKeyInfo['public_key'][current_length]['key']);

    currentGame.scenes[boardName] = createPlayScene(director, current_length, crypt_message, currentGame.playerKeyInfo);
}

/**
 * This function will be called to let you define new scenes.
 * @param director {CAAT.Director}
 */
function createScenes(director) {

    /**
     * Define a default set of public/private key.
     */
    currentGame.playerKeyInfo = getKeyInfo(MAX_BOARD_LENGTH);

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

    /**
     * We use this to enable some fonts in our gameBox.
     */
    $('.trick-font').each(function()
    {
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
