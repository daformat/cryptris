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
     * Define usefull variables.
     */
    var menu = currentGame.scenes['menu_scene'];
    var menuScene = menu['scene'];

    var play = currentGame.scenes['play_scene'];
    var playScene = play['scene'];

    /**
     * Link each scene together.
     */
    menu['shortcutButton'].mouseClick = function(e) {
        director.switchToScene(director.getSceneIndex(playScene), 0, 0, false);
    };

    /**
     * Add each element to its scene.
     */
    menuScene.addChild(menu['mainTitle']);
    menuScene.addChild(menu['playButton']);
    menuScene.addChild(menu['creditButton']);
    menuScene.addChild(menu['seeMoreButton']);
    menuScene.addChild(menu['shortcutButton']);

    director.loop(60);
};

/**
 * This function displays the splash screen and switch to the 'menu scene'.
 * @param director {CAAT.Director}
 */
function launchSplashScreen(director) {
    /**
     * Splash Image assets
     */
    var imgs= [];
    imgs.push({id:'splash',   url: "img/splash/splash_digital_cuisine.png" });
    imgs.push({id:'spinner',  url: "img/splash/rueda.png" });

    /**
     * Clear the director.
     */
    director.setClear(CAAT.Foundation.Director.CLEAR_DIRTY_RECTS);

    /**
     * Display the splash image
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
 * Startup it all up when the document is ready.
 */
$(document).ready(function() {
    /**
     * Debug flag, turn it off to production version.
     */
    CAAT.DEBUG = true;

    /**
     * Declare our main caat director.
     */
    var director = new CAAT.Director().initialize($(window).width() - 10, $(window).height() - 10, 'main_scene').setClear(false);

    /**
     * Launch splash screen
     */
    launchSplashScreen(director);
});
