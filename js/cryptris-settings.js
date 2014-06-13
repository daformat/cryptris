/**
 *  Cryptris configuration file
 *  Please create a backup before modifying anything here
 *  More settings can be found in game_engine/global.js
 *  The file prototype-additions.js must be included BEFORE this file
 */

var cryptrisSettings = cryptrisSettings || {};

/**
 *  Cryptris main url used for sharing links
 */
 
cryptrisSettings.appUrl = "http://inriamecsci.github.io/cryptris"

/**
 *  Google analytics ID
 */
cryptrisSettings.appAnalyticsId = 'UA-51901115-1';

/**
 *  Pseudo-prompt animation, displays a text character by character.
 *  This sets the delay to wait before displaying the next character
 *  Used during the intro.
 *  (we deactivated the effect on dialogs as it was too slow on ffox)
 */

cryptrisSettings.animateTextDelayBetweenLetters = 20;


/**
 *  Delay between scenes where a pause is needed 
 *  (mostly the two initial pseudo-prompt animations)
 */

cryptrisSettings.readingDelay = 4000;


/**
 *  These are the symbols we can display on the game boards
 *  1 character is coded with 4 ternary symbols
 *  hence we can display up to (3^4 =) 81 different characters
 *  for out of range characters we try to use html entities when possible
 *  As a last resort, we use the "□" (last character in the list) for any 
 *  other unsupported character.
 *  SOME CHARACTERS ARE NEEDED FOR HTML ENTITIES AND SHOULD NOT BE REMOVED
 *  Those characters are: "&" "#" and ";" plus any letter ranging from a to z
 */

cryptrisSettings.boardSymbols = [" ", "0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    ";", ".", ",","!","?","&","#","'","\\","\"","(",")","+","-","*","/","|","□"];

/**
 *  Maximum length of the message one can share on social networks
 */

cryptrisSettings.socialEncryptedMessageMaxLength = 140;

/**
 *  Cryptography settings, used to adjust public key generation and message encryption
 */

cryptrisSettings.crypto = cryptrisSettings.crypto || {}


/**
 *  How many times should the private key be applied in order to generate a public key
 *  Each level (8 columns, 10 columns, 12...) has it's own setting
 *  (aka rep1 in lducas' examples)
 *  THIS IS the setting used any time we generate the public key automatically
 *  (Any level but the first if the player generates his own key, both in normal and arcade 
 *  mode.Any level if not)
 *  THIS IS NOT the setting used when the player is asked to create his own public key 
 *  by playing a few times. 
 */

cryptrisSettings.crypto.repeatGenPublicKeyList = {
    8 : 6,
    10 : 7,
    12 : 8,
    14 : 9,
    16 : 10
};


/**
 *  How many times should the public key be applied to encrypt a message 
 *  Each level (8 columns, 10 columns, 12...) has it's own setting.
 *  (aka rep2 in lducas' examples)
 *  Used anytime a message is to be crypted with the public key, regardless
 *  if it's visible (when the scientist is encypting) or not (anywhere else in the game)
 */

cryptrisSettings.crypto.repeatChiffreMsgList = {
    8 : 7,
    10 : 8,
    12 : 9,
    14 : 10,
    16 : 11
};


/**
 *  AI settings
 */

cryptrisSettings.AI = cryptrisSettings.AI || {}

/**
 *  Slow down the AI (1)
 *
 *  For each level, we define a number of random moves the AI will play
 *  before really trying to crack the encryption
 *  This setting can be adjusted to impact the game's difficulty
 *  NOTE-1: Another setting is used as a multiplicator to adjust this parameter: slowdownIA
 *  NOTE-2: if the computer is set to play with the private key, we don't slow it down at all
 */

cryptrisSettings.AI.randomMovesBeforeStartingCrackingAlgorithm = {
    8 : 90,
    10 : 250,
    12 : 500,
    14 : 600,
    16 : 700
};


/**
 *  Slow down the AI (2)
 *
 *  Multiplicator, used to adjust the AI's ability to win
 *  Basically we just make the AI play randomly before allowing it to try cracking the message
 *  each level has it's own preset (search for "ralentiNumber"), which we'll multpily by this setting.
 *  0 - Don't slow down the AI at all, start cracking the message as soon as the game begins
 *  1 - Slow down the AI according to the current level preset (ralentiNumber)
 *  1.5 - Slow down the AI - 150% of the level's preset
 */

cryptrisSettings.AI.slowdownAI = 1;


/**
 *  Private keys
 *  Those were carefully generated to adjust the game difficulty and avoid blocking situations
 *  DO NOT change those settings unless you have a good reason
 */

cryptrisSettings.pregeneratedPrivateKeys = {
    8 : [7, 1, -1, -1, 0, 0, 0, 0].shuffle(),
    10 : [11, 1, 1, -1, -2, -1, 0, 0, 0, 0].shuffle(),
    12 : [15, 1, 2, 1, -1, -2, -1, -1, 0, 0, 0, 0].shuffle(),
    14 : [18, 1, 4, 1, 1, -1, -3, -2, -1, -1, 0, 0, 0, 0].shuffle(),
    16 : [19, 1, 5, 1, 1, 1, -1, -4, -2, -1, -1, -1, 0, 0, 0, 0].shuffle()
};