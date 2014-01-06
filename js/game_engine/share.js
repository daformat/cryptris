
var currentGame = new game();

function resizeMiniBoard(director, playScene) {

    playScene.game_box.relativeX = 10;
    playScene.game_box.resize(playScene.scene);
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
function createScenes(director, current_length, crypted_message) {

    /**
     * Create each scene.
     */
    currentGame.scenes = {};

    // This scene is active between two scenes.
    currentGame.scenes['waiting_scene'] = director.createScene();
    currentGame.scenes['mini_board'] = createMiniBoardScene(director, current_length, crypted_message, currentGame.playerKeyInfo, 'mini-board');
        currentGame.director.easeInOut(
                                        currentGame.director.getSceneIndex(currentGame.scenes.mini_board.scene),
                                        CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                        currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                        CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                        CAAT.Foundation.Actor.ANCHOR_CENTER,
                                        1000, true,
                                        new specialInInterpolator(),
                                        new specialOutInterpolator()
        );
    /**
     * Define the framerate.
     */
    CAAT.loop(60);
}

/**
 * This function preload each assets needed by the game and create each scenes..
 * @param director {CAAT.Director}
 */
function initGame(director, current_length, crypted_message) {
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
                createScenes(director, current_length, crypted_message);
                director.setClear(CAAT.Foundation.Director.CLEAR_ALL);
                CAAT.loop(60);
            }
        }
    );
}


function createMiniBoard(current_length, crypted_message) {

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
    initGame(currentGame.director, current_length, crypted_message);
}

var href = window.location.href;
var hrefPath = href.substr(0, href.lastIndexOf('/') + 1);
var baseHtml = hrefPath + 'decrypter.html';

function keyInfoCrypt(message) {
    var cipher = "";
    var data = {
        '0' : 'a',
        '1' : 'b',
        '2' : 'c',
        '3' : 'd',
        '4' : 'e',
        '5' : 'f',
        '6' : 'g',
        '7' : 'h',
        '8' : 'i',
        '9' : 'j',
        ',' : 'k',
        '|' : 'l',
        '-' : 'm'
    };

    for (var i = 0; i < message.length; ++i) {
        cipher += data[message[i]];
    }

    return cipher;
}

function createCryptedMessage() {

        var text = $("textarea").val();

        /*
            This allows to encode more charcaters, but there are still a few glitches, see:
            /decrypter.html?data=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-akmbfkhkmcakbkbbkmbfkcbkmdbkckmekmclakakckmbkmbkbgkakbkbkakmbkmclcakmikbjkbdkmdekeckmebkcbkcdkmdbkfdkmddkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedkundefinedundefinedundefinedlbc
            
        */

        /*
        text = text.replace(/[\u001F-\u99999<>\&]/gim, function(i) {
           return '&#'+i.charCodeAt(0)+';';
        });
        */

        while (text.length < 3) {
            text += ' ';
        }
        var ternary_message = string_to_ternary(text);

        var total_crypt_message = easy_crypt(ternary_message);

        var cipher_message = text[0] + text[1] + text[2];

        var current_length = MAX_BOARD_LENGTH;

        /**
         * Define a default set of public/private key.
         */
        currentGame.playerKeyInfo = getKeyInfo(current_length);

        /**
         * Change message to ternary
         */
        var ternary_message = string_to_ternary(cipher_message);

        /**
         * Return the crypted message
         */
        var crypted_message = chiffre(current_length, ternary_message, currentGame.playerKeyInfo.public_key[current_length].key, currentGame.playerKeyInfo.private_key[current_length].key);

        createMiniBoard(current_length, crypted_message);

        var keyInfoPublicKey = currentGame.playerKeyInfo.public_key[current_length].key.toString();
        var keyInfoPrivateKey = currentGame.playerKeyInfo.private_key[current_length].key.toString();
        var keyInfoCipher = crypted_message.plain_message.toString();
        var keyInfoCurrentLength = current_length.toString();

        var url = baseHtml + '?data=' + total_crypt_message;
        var tmpKeyInfo = keyInfoPublicKey + '|' + keyInfoPrivateKey + '|' + keyInfoCipher + '|' + keyInfoCurrentLength;
        var keyInfo = keyInfoCrypt(tmpKeyInfo);
        url += "-";
        url += keyInfo;

        $('#share-tw').attr("href", "https://twitter.com/intent/tweet?text=Essaye de décrypter ce message sur Cryptris&url=" + url);
        $('#share-tw').attr("target", "_blank");

        $('#share-gp').attr('data-contenturl', hrefPath);
        $('#share-gp').attr('data-calltoactionurl', url);

        (function() {
            var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
            po.src = 'https://apis.google.com/js/client:plusone.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();

        $('#share-fb').attr('href', 'http://www.facebook.com/sharer.php?s=100&p[url]=' + url + '&p[title]=Essaye de décrypter ce message sur Cryptris');
        $('#share-fb').attr('target', '_blank');
        $('#share-fb').attr('onclick', 'javascript:window.open(\'http://www.facebook.com/sharer.php?s=100&p[url]='
                                         + url 
                                         + '&p[title]=Cryptris, un jeu sur la cryptographie asymétrique' 
                                         + '&p[summary]=Essaye de décrypter ce message sur Cryptris.\', \'\', \''
                                         + 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\'); return false;');

        console.log(url);
}

$(document).ready(function() {
	$("#share").submit(function() {
        setTimeout(createCryptedMessage, 500);
		return false;
	});

});
