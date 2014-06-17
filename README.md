Cryptris  
========

### A game about asymetric cryptography

Cryptris is a game designed to help people in getting a grasp about how cryptography works, by playing an arguably tetris-like game.

The game was developped by [Digital Cuisine](http://www.digitalcuisine.fr) for [Inria](http://www.inria.fr) and is based on a concept created by Léo Ducas.


### Technology

This game uses html, css and javascript. No server were harmed during the development process.


### Installation

The whole application is designed to be a serverless application, hence the installation is pretty straightforward: simply clone this repository or download it as an archive.


### Launching the game

To launch the game, simply open the `index.html` file in a compatible web browser.


### Configuring the game for using on a custom domain / url

Changin the app's url is just a matter of changing the url that social networks will use to fetch data about Cryptris (title, descriptions, picture previews…). Unfortunately, due to the serverless nature of this project, a few occurences of this url _had to be_ hard-coded in the html files' meta tags. A global configuration variable is used everywhere else where the app's url is needed, this variable can be found in the `js/cryptris-settings.js` file.

**Before publishing the game,** make sure that you proceed to the following:

* open up `js/cryptris-settings.js`.
* look for the line where `cryptrisSettings.appUrl` is defined.
* copy `appUrl`'s actual value (e.g. http://inriamecsci.github.io/cryptris)
* search and replace this url in the game's `.html` files.
* set `cryptrisSettings.appUrl` to whatever your new url is.
* upload to your new url and carefully test that every sharing function still works as expected.

Be sure to update the app settings for facebook (facebook apps) and google+ (google API console), as of may 2014, twitter doesn't ask for this.


### Hosting the game on github

To publish on github the only thing you need to do is to make sure that your `gh-pages` branch is up-to-date and push it to your github account. You should be able to access it via http://[username].github.io/cryptris where [username] should be replaced by your actual github username.


### Credits

Basé sur une idée originale de Léo Ducas

#### Scénario
Mathieu Jouhet & Nicolas Pelletier

#### Inria
* **Coordination :** Service communication du centre de recherche Inria Paris - Rocquencourt
* **Référents médiation :** Thierry Vieville et Laurent Viennot
* **Référent scientifique :** Léo Ducas

#### Digital Cuisine
* **Directeur Artistique :** Mathieu Jouhet ([@daformat](https://twitter.com/daformat))
* **Graphiste :** Nicolas Pelletier
* **Game engine :** Vincent Mézino
* **Intégration html, développement javascript:** Mathieu Jouhet
* **Test :** Olivier Lance, Pierre-Jean Quilleré

___

### Links & references
[Digital Cuisine](http://www.digitalcuisine.fr)  
[Inria](http://www.inria.fr)
