Cryptris  
========

##A game about asymetric cryptography

Cryptris is a game designed to help people in getting a grasp about how cryptography works.

The game was developped by [Digital Cuisine][digital-cuisine] for [Inria][inria] and is based on a concept created by Léo Ducas.

##Technology
This game uses html, css and javascript. No server were harmed during the developpment process.

## Installation
The whole application is designed to be a serverless application, hence the installation is pretty straightforward: simply clone this repository or download it as an archive.

## Launching the game
To launch the game, simply open the `index.html` file in a compatible web browser.

## Configuring the game for using on a custom domain / url
Changin the app's url is just a matter of changing the url that social networks will use to fetch data about Cryptris (title, descriptions, picture previews…). Unfortunately, due to the serverless nature of this project, a few occurences of this url _had to be_ hard-coded in the html files' meta tags. A global configuration variable is used everywhere else where the app's url is needed, this variable can be found in the `js/cryptris-settings.js` file.

**Before publishing the game,** make sure that you proceed to the following:

* open up `js/cryptris-settings.js`.
* look for the line where `cryptrisSettings.appUrl` is defined.
* copy `appUrl`'s actual value (e.g. http://daformat.github.io/cryptris)
* search and replace this url in the game's `.html` files.
* set `cryptrisSettings.appUrl` to whatever your new url is.
* upload to your new url and carefully test that every sharing function still works as expected.

Be sure to update the app settings for facebook (facebook apps) and google+ (google API console), as of may 2014, twitter doesn't ask for this.



### Test the game

'r'  =>  Generate a key.

'b'  =>  Load a 8 column board with the message 24

'c'  =>  Load a 10 column board with the message 78

'd'  =>  Load a 12 column board with the message 31



Test the Create Key test

'a'  =>  load the create_key screen.

'e'  =>  launch the computer process



To switch at a specific dialog, in the console :

currentGame.switchDialog(dialogNumber);

To know the current dialog number :

currentGame.currentDialog();

___

## Links & references

[digital-cuisine]: www.digitalcuisine.fr
[inria]: www.inria.fr
