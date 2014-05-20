
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
    resultScene.resizeOption.DEFAULT_BOTTOM_MARGIN = 70;

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
    var gameBoxInfo = new GameBox(director, playerBoxOption, 0, 10, current_length, blank_key, message, true, true, false, false);
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

    $('#spinner-img').fadeOut(500);
    setTimeout(function() {
      $('#mini_board').fadeIn(1000);
    }, 500);
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

function getQuerystring(key, default_) {
  if (default_==null) default_=""; 
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}


function createMiniBoard(current_length, crypted_message) {

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
     * Declare our main caat director.
     */
    var onScreenCanvas  = $('#mini_board');
    currentGame.director = new CAAT.Director().initialize(456, 275, onScreenCanvas[0]).setClear(false);

    /**
     * Init the game
     */
    initGame(currentGame.director, current_length, crypted_message);
}

//
var href = cryptrisSettings.appUrl;
//var hrefPath = href.substr(0, href.lastIndexOf('/') + 1);
var hrefPath = href + '/';
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

        var original_text = $("textarea").val();

        /*
            This allows to encode more charcaters.  
        */

        var text = original_text.replace(/[\u001F-\u99999<>\&]/gim, function(i) {
           return '&#'+i.charCodeAt(0)+';';
        });

        while (text.length < 3) {
            text += ' ';
        }

        while (original_text.length < 3) {
          original_text += ' ';
        }

        var ternary_message = string_to_ternary(text);

        // Url encrypted message
        var total_crypt_message = encodeURIComponent(original_text.toBase64());

        var cipher_message = original_text[0] + original_text[1] + original_text[2];

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


    /**
     * SHARING
     */

    var hrefPath    = url,
        title       = "Défi! Cryptris, un jeu gratuit sur la cryptographie asymétrique",
        text        = "Déchiffrez le message: ",
        preview     = cryptrisSettings.appUrl + "/img/cryptis-social-preview-600x600.png",
        preview_xl  = cryptrisSettings.appUrl + "/img/cryptis-social-preview-1200x630.png",
        code        = string_to_ternary(crypted_message.plain_message.toString()).join('').substr(0,80);

    /** Setup sharing urls **/

    // twitter
    $('#share-tw').attr("href", "https://twitter.com/intent/tweet?text="+text+code+"&url=" + url);
    $('#share-tw').attr("target", "_blank");

    // google+
    $('#share-gp').attr('data-contenturl', hrefPath);
    $('#share-gp').attr('data-calltoactionurl', url);
    $('#share-gp').attr('data-prefilltext', text+code);
          
    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    // facebook - doesn't work because the url is too long :/
    var fbBase = "https://www.facebook.com/dialog/feed?&app_id=525890597495827&display=popup";
    var fbUrl = fbBase+"&caption=" + title + "&description=" + text + code + "&link=" + url + "&picture=" + preview_xl + "&redirect_uri="+cryptrisSettings.appUrl+"/merci.html";
    $('#share-fb').attr('onclick', "javascript:window.open('"+fbUrl+"', '', 'toolbar=0,status=0,width=626,height=436');");


}

$(document).ready(function() {
	$("#share").submit(function() {
        setTimeout(createCryptedMessage, 500);
		return false;
	});
  $("#edit-message").bind('click', function() {

    currentGame.director.easeInOut(
                                    currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                    CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    1000, true,
                                    new specialInInterpolator(),
                                    new specialOutInterpolator()
    );

    setTimeout(function() {
      $('#mini_board').fadeOut(100);
      $('#spinner-img').fadeIn(100);
    }, 1000);
  });
});
