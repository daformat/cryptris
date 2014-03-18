var cryptrisSettings = {};

// Pseudo-prompt animation
// Sets the delay to wait before displaying the next letter
cryptrisSettings.animateTextDelayBetweenLetters = 20;

// Delay between scenes when a reading delay is needed (mostly the two initial pseudo-prompt animations)
cryptrisSettings.readingDelay = 4000;

// Multiplicator used to adjust the AI's ability to win
// Basically we just make the AI play randomly before allowing it to try cracking the message
// each level has it's own preset (search for "ralentiNumber"), which we'll multpily by this setting.
// 0 - Don't slow down the AI at all, start cracking the message as soon as the game begins
// 1 - Slow down the AI according to the current level preset (ralentiNumber)
// 1.5 - Slow down the AI - 150% of the level's preset
cryptrisSettings.slowdownIA = 1;