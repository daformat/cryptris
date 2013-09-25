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
 * This function will be called to let you define new scenes that will be
 * shown after the splash screen.
 * @param director {CAAT.Director}
 */
function createScenes(director) {
    /**
     * Create each scene.
     */
    currentGame.scenes = {};
    currentGame.scenes['menu_scene'] = createMenuScene(director);
    currentGame.scenes['play_scene'] = createPlayScene(director);

    /**
     * Link each scene together.
     */
    currentGame.scenes['menu_scene']['shortcutButton'].mouseClick = function(e) {
        director.switchToScene(director.getSceneIndex(currentGame.scenes['play_scene']['scene']), 0, 0, false);
    };

    /**
     * Define the framerate.
     */
    CAAT.loop(60);
}

/**
 * This function displays the splash screen and switch to the 'menu scene'.
 * @param director {CAAT.Director}
 */
function launchSplashScreen(director) {
    /**
     * Image assets
     */
    var imgs= [];
    imgs.push({id:'splash',   url: "img/splash/splash_digital_cuisine.png" });
    imgs.push({id:'spinner',  url: "img/splash/rueda.png" });
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

    /**
     * Clear the director.
     */
    director.setClear(CAAT.Foundation.Director.CLEAR_DIRTY_RECTS);

    /**
     * Preload our necessarly images and load the splash screens.
     */
    new CAAT.Module.Preloader.ImagePreloader().loadImages(
        imgs,
        function on_load(counter, images) {
            if (counter === images.length) {
                director.setImagesCache(images);
                var splashScene = createSplashScene(director, 2000, createScenes);
                CAAT.loop(60);
                splashScene.loadedImage(0,null);
            }
        }
    );
}

/**
 * Launch all resize functions when the event is fired.
 */
var resizeInProcess = false;
function resize(director, newWidth, newHeight) {
    if (director.width < 800 || director.height < 550) {
        return;
    }

    if (resizeInProcess === false) {
        resizeInProcess = true;

        if (currentGame.scenes !== null) {
            if (currentGame.scenes['menu_scene'] !== null) {
                currentGame.scenes['menu_scene']['resize'](director, currentGame.scenes['menu_scene']);
            }

            if (currentGame.scenes['play_scene'] !== null) {
                currentGame.scenes['play_scene']['resize'](director, currentGame.scenes['play_scene']);
            }
        }
    }
    resizeInProcess = false;
}

/**
 * Startup it all up when the document is ready.
 */
$(document).ready(function() {

    /**
     * Debug flag, turn it off to production version.
     */
    CAAT.DEBUG = parseInt(getQuerystring('dbg', 0)) == 1;

    $('.trick-font').each(function()
    {
        $(this).attr('style', 'display: none;');
    });

    a = "test";

    /**
     * Declare our main caat director.
     */
    var onScreenCanvas  = $('.main_scene');
	var director = new CAAT.Director().initialize($(document).width(), $(document).height(), onScreenCanvas[0]).setClear(false);
	
    /**
     * Launch splash screen
     */
    launchSplashScreen(director);

    /**
     * Enable resize events.
     */
    director.enableResizeEvents(CAAT.Foundation.Director.RESIZE_BOTH, resize);
});
