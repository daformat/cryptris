
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
function createScenes(director, current_length, crypted_message) {

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

$(document).ready(function() {
	$("#share").submit(function() {
		var text = $("textarea").val();
		while (text.length < 3) {
			text += ' ';
		}
		var ternary_message = string_to_ternary(text);

		var crypt_message = easy_crypt(ternary_message);
		var url = baseHtml + '?msg=' + crypt_message;

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
    	var crypted_message = chiffre(current_length, ternary_message, currentGame.playerKeyInfo.public_key[current_length].key);

		createMiniBoard(current_length, crypted_message);

		var keyInfoPublicKey = currentGame.playerKeyInfo.public_key[current_length].key.toString();
		var keyInfoPrivateKey = currentGame.playerKeyInfo.private_key[current_length].key.toString();
		var keyInfoCipher = crypted_message.plain_message.toString();
		var keyInfoCurrentLength = current_length.toString();

		var tmpKeyInfo = keyInfoPublicKey + '|' + keyInfoPrivateKey + '|' + keyInfoCipher + '|' + keyInfoCurrentLength;
		var keyInfo = tmpKeyInfo;
		//url += "&keyInfo=";
		//url += keyInfo;

        $('#share-tw').attr("href", "https://twitter.com/intent/tweet?text=Essaye de décrypter ce message sur Cryptris&url=" + url);
        $('#share-tw').attr("target", "_blank");

        $('#share-gp').attr('data-contenturl', hrefPath);
        $('#share-gp').attr('data-calltoactionurl', url);

        (function() {
            var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
            po.src = 'https://apis.google.com/js/client:plusone.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();
        /*
        <!-- Twitter -->
        <a href="https://twitter.com/intent/tweet?text=Cryptris - un jeu sur la cryptographie asymétrique&url=http://cryptris.com" target="_blank"><img class="retina" src="img/icn-twitter@2x.png" data-at2x="img/icn-twitter@2x.png" alt=""></a>

        <!-- Google plus -->  
        <span
          class="g-interactivepost"
          data-contenturl="https://cryptris.com/"
          data-contentdeeplinkid="/"
          data-clientid="303615069411.apps.googleusercontent.com"
          data-cookiepolicy="single_host_origin"
          data-prefilltext="Cryptris, un jeu sur la cryptographie asymétrique"
          data-calltoactionlabel="PLAY"
          data-calltoactionurl="http://crytptis.com"
          data-calltoactiondeeplinkid="/">
          <a href="#"><img class="retina" src="img/icn-google-plus@2x.png" data-at2x="img/icn-google-plus@2x.png" alt=""></a>
        </span>

        <!-- Facebook -->
        <a href="http://www.facebook.com/sharer.php?s=100&p[url]=http://cryptris.com&p[title]=Cryptris, un jeu sur la cryptographie asymétrique" target="_blank" onclick="javascript:window.open('http://www.facebook.com/sharer.php?s=100&p[url]=http://cryptris.com&p[title]=Cryptris, un jeu sur la cryptographie asymétrique&p[summary]=Jouez contre l’ordinateur pour savoir qui arrivera à décrypter le plus rapidement.','', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'); return false;"><img class="retina" src="img/icn-facebook@2x.png" data-at2x="img/icn-facebook@2x.png" alt=""></a>
*/

        console.log(url);

		return false;
	});

});
