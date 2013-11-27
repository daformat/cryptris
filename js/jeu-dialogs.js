var dialogs_list = [];
var animateTextDelayBetweenLetters = 20;
var readingDelay = 4000;

var youAreIntern = "Tu es stagiaire dans une équipe de recherche Inria";
var firstDay = "Premier jour à l'institut";

var firstPrompt = function(welcome) {
      $.switchWrapper('#prompt', function() {
        // First prompt
        $('.prompt .content').text('');
        setTimeout(function() {
          $('.prompt .content').typeLetterByLetter(youAreIntern, animateTextDelayBetweenLetters, 
            function() {
              // Second prompt
              setTimeout(
                function() {
                  $('.prompt .content').text('');
                  setTimeout(
                    function() {
                      $('.prompt .content').typeLetterByLetter(firstDay, animateTextDelayBetweenLetters,
                        function() {
                          // Switch to institute
                          setTimeout(function() { $.switchWrapper('#bg-institut', welcome); }, readingDelay);
                        }
                      );
                    },
                    2000
                  )
                },
                readingDelay
              );
            }
          );
        }, 2000);
        }
      );
    }

function addControlToDialog(dialogName, controls) {
  dialogName['controls'] = controls;
}

function addInteractiveContentToDialog(dialogName, content) {
  dialogName['content'] = content;
}

function updateAccountCreatedDialog() {
  accountCreatedDialog['content'] = "Parfait" + (currentGame.litteralName != "" ? " <em>" + currentGame.litteralName + "</em>" : "" ) + ", ton compte est maintenant créé. Afin de sécuriser les échanges sur le réseau, nous utilisons un protocole de cryptographie asymétrique.";
}

function updateCryptoExplanations() {
  cryptoExplanationsDialog['title'] = currentGame.username;
}

function updateKeysExplanations() {
  keysExplanationsDialog['title'] = currentGame.username;
}

var welcomeInstituteDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Bienvenue à l’Institut ! C’est donc toi mon nouvel apprenti, parfait ! Commençons par le commencement, il te faudra un compte utilisateur pour te connecter au réseau, tu n’as qu’à choisir ton nom d’utilisateur."
};

var accountCreatedDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Parfait" + (currentGame.litteralName != "" ? " <em>" + currentGame.litteralName + "</em>" : "" ) + ", ton compte est maintenant créé. Afin de sécuriser les échanges sur le réseau, nous utilisons un protocole de cryptographie asymétrique."
};

var cryptoExplanationsLabel0 = "Cryptogra... quoi ?";
var cryptoExplanationsLabel1 = "Asymétrique ? Pourquoi asymétrique ?";
var cryptoExplanationsLabel2 = "Si vous le dites...";
var cryptoExplanationsDialog = {
  type: "player",
  title: currentGame.username
};

var cryptoExplanationsOpt1Dialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Cryptographie! Du grec ancien <strong>kruptos</strong> (« caché ») et <strong>graphein</strong> (« écrire »). Il s’agit de protéger des messages."
};

var cryptoExplanationsOpt2Dialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Oui ! Asymétrique, on l’appelle aussi cryptographie à clé publique car elle repose sur l’utilisation de deux types de clés <span>:</span> la clé privée, et la clé publique. La clé publique sert à chiffrer, ou coder si tu préfères, les messages, tandis que la clé privée permet de les déchiffrer."
};

var goingToCreateKeysDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Tu vas maintenant créer ta paire de clé privée / clé publique mais<span>...</span> n’oublie pas, cette clé privée est... privée ! Toi seul dois la connaître ! Ta clé publique sera diffusée sur le réseau à l’ensemble des chercheurs de l’Institut."
};

var keysExplanationsLabel0 = "Clé privée ? Qu'est-ce que c'est ?";
var keysExplanationsLabel1 = "Une clé publique ? Pourquoi ma clé serait-elle publique ?";
var keysExplanationsLabel2 = "D'accord, j'ai compris.";
var keysExplanationsDialog = {
  type: "player",
  title: currentGame.username
};

var keysExplanationsOpt1Dialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Ta clé privée est la clé que toi seul connaîtra, c'est elle qui te permettra de déchiffrer facilement les message qui te seront envoyés. <em>Sans la clé privée il est très difficile,</em> voir impossible, <em>de déchiffrer un message crypté.</em>"
};

var keysExplanationsOpt2Dialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Ta clé publique sera dérivée de ta clé privée. De la même manière qu'un <em>cadenas</em> permet de <em>sécuriser le contenu d'un coffre,</em> la <em>clé publique</em> permet de <em>chiffrer des messages</em> et les rendre illisibles à ceux qui ne disposent pas de la clé privée."
};

var hereYourPrivateKeyDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Voici ta clé privée, utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix."
};

var helpCreateKeyDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Help CREATE_KEY"
};

var pleaseInvertYourPrivateKeyDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Tu n'as pas annulé ton précédent mouvement. Essaye de le faire en appuyant sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou sur <img src='img/icn-space.png' class='keyboard-key'> afin d'inverser les couleurs de ta clé. Puis, appuie sur <img src='img/icn-arrow-down.png' class='keyboard-key'> pour envoyer ta clé.</span>"
};

var okDontInvertYourPrivateKeyDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Ok, tu ne veux pas annuler ton précédent mouvement. Alors continue de manipuler ta clé privée afin d’entamer la création de ta clé publique"
};

var nowTryToCancelLastMoveDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Parfait ! Essaie maintenant d'annuler ton dernier mouvement en appuyant sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou sur <img src='img/icn-space.png' class='keyboard-key'> afin d'inverser les couleurs de ta clé. Puis, appuie sur <img src='img/icn-arrow-down.png' class='keyboard-key'> pour envoyer ta clé.</span>"
};

var continueManipulatingToGeneratePublicKeyDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Continue à présent de manipuler ta clé privée afin d’entamer la création de ta clé publique"
};

var keyPregeneratedDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Très bien, tu as compris ! L'ordinateur va à présent terminer de générer ta clé publique."
};

var wellDoneDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Parfait ! Te voilà fin prêt! J’ai bien ta clé publique... Vérifions que tout fonctionne. Je t’envoie un premier message crypté."
};

var gameOverDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Il faut vraiment que tu puisses décrypter ce message avant l'ordinateur. Reprennons de zéro !"
};

var tooManyBlocksDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Pour décrypter le message tu dois détruire les blocs, tu es en train de les accumuler. Reprennons de zéro !"
};

var firstMessageDialog = {
  animateText: true,
  type: "withAvatar",
  avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",
  title: "InriOS 3.14"
};

var helpPlaySoloDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Help PLAY_SOLO"
};

var messageTestDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "J’ai crypté ce message à l’aide de ta <em>clé publique</em>, pour le décrypter tu dois utiliser ta <em>clé privée.</em> Manipule ta clé comme tout à l’heure avec <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour déplacer les colonnes et <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'>. pour inverser les couleurs des blocs."
};

var tutorialDialog = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse",
  content: "Lorsque tu appuies sur <img src='img/icn-arrow-down.png' class='keyboard-key'> ta clé est envoyée sur le message à décrypter et les blocs vont s’annuler s’ils sont de couleurs opposées ou s’empiler s’ils sont de même couleur. Le message est décrypté lorsque tu n’as plus qu’une seule ligne de blocs en bas. À toi de jouer !"
};
