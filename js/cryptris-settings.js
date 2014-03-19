var cryptrisSettings = cryptrisSettings || {};

/**
 * Pseudo-prompt animation
 * Sets the delay to wait before displaying the next letter
 */
cryptrisSettings.animateTextDelayBetweenLetters = 20;


/**
 * Delay between scenes when a reading delay is needed (mostly the two initial pseudo-prompt animations)
 */
cryptrisSettings.readingDelay = 4000;


/**
 * These are the symbols we can display on the game boards
 * 1 character is coded with 4 ternary symbols
 * hence we can display up to (3^4 =) 81 different characters
 * for out of range characters we try to use html entities when possible
 * As a last resort, we use the "□"" (last character in the list) for any 
 * other unsupported character
 */
cryptrisSettings.boardSymbols = [" ", "0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    ";", ".", ",","!","?","&","#","'","\\","\"","(",")","+","-","*","/","|","□"];


/**
 *  AI settings
 */

cryptrisSettings.AI = cryptrisSettings.AI || {}

/**
 *  Slow down the AI
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
 * Multiplicator, used to adjust the AI's ability to win
 * Basically we just make the AI play randomly before allowing it to try cracking the message
 * each level has it's own preset (search for "ralentiNumber"), which we'll multpily by this setting.
 * 0 - Don't slow down the AI at all, start cracking the message as soon as the game begins
 * 1 - Slow down the AI according to the current level preset (ralentiNumber)
 * 1.5 - Slow down the AI - 150% of the level's preset
 */
cryptrisSettings.AI.slowdownAI = 1;