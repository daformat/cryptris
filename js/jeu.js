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

    if (director.height < 700) {
        currentGame.miniScreen = true;
    } else {
        currentGame.miniScreen = false;
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

function createMessageForAnimateEncryption(boardLength, message) {
    /**
     * Change message to ternary
     */
    var ternary_message = string_to_ternary(message);

    /**
     * Return the crypted message
     */
    var clear_message = no_chiffre(boardLength, ternary_message);
    return clear_message;
}

/**
 * 
 */
function preparePlayScene(director, boardLength, boardName, crypt_message, hookActive, withIaBoard, helpEvent, pauseEvent) {
    playerBoardColorInfo['keychain'] = 'keychain-player';
    playerBoardColorInfo['key-symbol'] = 'icn-mini-player-key-symbol';
    currentGame.scenes[boardName] = createPlayScene(director, boardLength, crypt_message, currentGame.playerKeyInfo, hookActive, withIaBoard, helpEvent, pauseEvent);
}

/**
 * 
 */
function prepareAnimatePlayScene(director, boardLength, boardName, crypt_message, hookActive, withIaBoard, helpEvent, pauseEvent) {
    playerBoardColorInfo['keychain'] = 'keychain-ia-left';
    playerBoardColorInfo['key-symbol'] = 'key-ia-left';
    currentGame.scenes[boardName] = createPlayScene(director, boardLength, crypt_message, currentGame.playerKeyInfo, hookActive, withIaBoard, helpEvent, pauseEvent, true);
    currentGame.scenes[boardName].game_box.message.isActive = false;
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
     * For optimization reasons, we prepare the two last messages (it won't change later).
     */
    // Prepare the second battle message
    currentGame.play_medium_scene_msg = createMessageForPlayScene(MEDIUM_BOARD_LENGTH, SECOND_BATTLE_MESSAGE);

    // Prepare the third battle message
    currentGame.play_max_scene_msg = createMessageForPlayScene(MAX_BOARD_LENGTH, THIRD_BATTLE_MESSAGE);

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

        try{
              var gui = new dat.GUI();

              gui.add(cryptrisSettings, 'gamingTime').listen();
              gui.add(cryptrisSettings, 'slowdownIA', 0, 1);

              var guiCaat = gui.addFolder('Caat');
                guiCaat.add(CAAT, 'FPS', 1, 120);

              try{
                var guiDialogs = gui.addFolder('Dialogs');
                    guiDialogs.add(cryptrisSettings, 'readingDelay', 0, 10000);
                    guiDialogs.add(cryptrisSettings, 'animateTextDelayBetweenLetters', 0, 1000);

                    guiDialogs.open();

                var guiTimes = gui.addFolder('Times');
                    guiTimes.add(currentGame, 'playMinSceneActiveTime', 0, 10000);
                    guiTimes.add(currentGame, 'playMediumSceneActiveTime', 0, 10000);
                    guiTimes.add(currentGame, 'playMaxSceneActiveTime', 0, 10000);

                    guiTimes.open();

                } catch(e){
                    //console.error(e);
                }

                var guiCurrentGame = gui.addFolder('Boards');
                    guiCurrentGame.add(currentGame, 'validateCurrentBoard').listen();


                gui.add({triggerNextDialog: function() { $(document).trigger('nextDialog'); } }, 'triggerNextDialog');
                gui.add({triggerDisplayChart: function() { $.displayDialog($.dialogChart); }}, 'triggerDisplayChart');
        } catch(e) {

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



/**
 * SHARING
 */

    var url         = cryptrisSettings.appUrl,
        hrefPath    = url,
        title       = "Cryptris, un jeu gratuit sur la cryptographie asymétrique",
        text        = "Je viens de terminer Cryptris - un jeu sur l’univers de la cryptographie asymétrique. Affrontez l’ordinateur",
        preview     = cryptrisSettings.appUrl + "/img/cryptis-social-preview-600x600.png";
        preview_xl  = cryptrisSettings.appUrl + "/img/cryptis-social-preview-1200x630.png";

    /** Setup sharing urls **/

    // twitter
    $('#share-tw').attr("href", "https://twitter.com/intent/tweet?text="+text+"&url=" + url);
    $('#share-tw').attr("target", "_blank");

    // google+
    $('#share-gp').attr('data-contenturl', hrefPath);
    $('#share-gp').attr('data-calltoactionurl', url);
    $('#share-gp').attr('data-prefilltext', 'Vous aussi, venez essayer de battre l’ordinateur en jouant à Cryptris.');
          
    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    // facebook
    var fbBase = "https://www.facebook.com/dialog/feed?&app_id=525890597495827&display=popup";
    var fbUrl = fbBase+"&caption=" + title + "&description=" + text + "&link=" + url + "&picture=" + preview_xl + "&redirect_uri="+cryptrisSettings.appUrl+"/merci.html";
    $('#share-fb').attr('onclick', "javascript:window.open('"+fbUrl+"', '', 'toolbar=0,status=0,width=626,height=436');");


});
