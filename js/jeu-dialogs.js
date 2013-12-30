
var youAreIntern = "Tu es stagiaire dans une équipe de recherche Inria";
var firstDay = "Premier jour à l'institut";

var labelNext = "Suite";
var labelPrev = "Précédent"
var labelOpenMessage = "Ouvrir le message";
var labelDecryptMessage = "Décrypter le message";
var labelCutCable = "Débrancher le câble";
var labelAie = "Aie ! Je viens de me prendre une décharge électrique !";
var labelResume = "Reprendre";

var controlNext = {label: labelNext, class: "button blue", onClick: function() { $(document).trigger('nextDialog')}};
var controlOpen = {label: labelOpenMessage, class: "button blue", onClick: function() { $(document).trigger('nextDialog')}};
var controlDecrypt = {label: labelOpenMessage, class: "button blue", onClick: function() { $(document).trigger('nextDialog')}};
var controlPrev = {label: labelPrev, class: "button grey", onClick: function() { $(document).trigger('prevDialog')}};
var controlPass = {label: "Passer cette étape", class: "button red", onClick: function() {$(document).trigger('passDialog')}};

function getControl(control, functionCN) {
  var newControl = {label: control['label'], class: control['class']};
  if (functionCN) {
    newControl['onClick'] = functionCN;
  } else {
    newControl['onClick'] = control['onClick'];
  }
  return newControl;
}

var firstPrompt = function(welcome) {
  $.switchWrapper('#prompt', function() {
    // First prompt
    $('.prompt .content').text('');
    setTimeout(function() {
      $('.prompt .content').typeLetterByLetter(youAreIntern, cryptrisSettings.animateTextDelayBetweenLetters, function() {
        // Second prompt
        setTimeout(function() {
          $('.prompt .content').text('');
          setTimeout(function() {
            $('.prompt .content').typeLetterByLetter(firstDay, cryptrisSettings.animateTextDelayBetweenLetters,function() {
              // Switch to institute
              setTimeout(function() { 
                $(document).trigger('nextDialog');
              }, cryptrisSettings.readingDelay);
            });
          }, 2000)
        }, cryptrisSettings.readingDelay);
      });
    }, 2000);
  });
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

function updateWeird() {
    weirdDialog['content'] = (currentGame.litteralName != "" ? " <em>" + currentGame.litteralName + ",</em> e" : "E") + "st-ce que tu me reçois ? C’est vraiment bizarre, notre serveur refuse obstinément de se re-configurer et m'empêche de sortir <sspan>de la salle </sspan>des machines, essaie de débrancher le câble n° 42 du tableau électrique principal.";
}

function updateElectricShock() {
  electricShockDialog['title'] = currentGame.username;
}

function updateNameFunction() {
  updateAccountCreatedDialog();
  updateCryptoExplanations();
  updateKeysExplanations();
  updateWeird();
  updateElectricShock();
}

var chercheusePredef = {
  animateText: true,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse"
};

var pausePredef = {
  type : "player",
  title : "Pause"
};

var playerPredef = {
  type : "player",
  title : currentGame.username
};

var inriosPredef = {
  animateText: true,
  type: "withAvatar",
  avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",
  title: "InriOS 3.14"
};

var decryptedPredef = {
  animateText: true,
  type: "withAvatar",
  avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",
  title: "Message décrypté"
};

var cablesPredef = {
  type: "cables",
  title: "Séléctionner le cable à débrancher"
};

var graphPredef = {
  type: "graph",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Comparaison du temps de décryptage"
};

function getDialog(predef, content, transitionCallback, identifier) {
  var newDialog = {};

  for (var key in predef) {
    newDialog[key] = predef[key];
  }
  newDialog['content'] = content;

  if (transitionCallback) {
    newDialog['transitionCallback'] = transitionCallback;
  } else {
    newDialog['transitionCallback'] = {
      in: function() {
        // alert("Dialog was added to the dom");
      },
      show: function() {
        // alert("Dialog intro animation is complete");
      },
      out: function() {
        // alert("Dialog outro animation is complete, html element will be removed now.");
      }
    };
  }

  if(identifier){
    newDialog['identifier'] = identifier;
  }
  
  return newDialog;
}

/**
 * Game dialogs
 */
 
var gameOverDialog = getDialog(chercheusePredef, "Il faut vraiment que tu puisses décrypter ce message avant l'ordinateur. Reprennons de zéro !", null, {
        category: "Jeu",
        action: "Niveau non précisé",
        label: "Game over (l’ordinateur a gagné)",
      });
var tooManyBlocksDialog = getDialog(chercheusePredef, "Pour décrypter le message tu dois détruire les blocs, tu es en train de les accumuler. Reprennons de zéro !", null, {
        category: "Jeu",
        action: "Niveau non précisé",
        label: "Game over (le joueur ne joue pas correctement)",
      });

/**
 *  Intro
 */

var welcomeInstituteDialog = getDialog(chercheusePredef, "Bienvenue à l’Institut ! C’est donc toi mon nouvel apprenti, parfait ! Commençons par le commencement, il te faudra un compte utilisateur pour te connecter au réseau, tu n’as qu’à choisir ton nom d’utilisateur.", null, {
        category: "Jeu",
        action: "Intro",
        label: "Dialogue 'Bienvenue à l'institut' (Chercheuse)",
      });

var accountCreatedDialog = getDialog(chercheusePredef, "Parfait" + (currentGame.litteralName != "" ? " <em>" + currentGame.litteralName + "</em>" : "" ) + ", ton compte est maintenant créé. Afin de sécuriser les échanges sur le réseau, nous utilisons un protocole de cryptographie asymétrique.", null, {
        category: "Jeu",
        action: "Intro",
        label: "Dialogue 'Compte utilisateur crée' (Chercheuse)",
      });

var cryptoExplanationsLabel0 = "Cryptogra... quoi ?";
var cryptoExplanationsLabel1 = "Asymétrique ? Pourquoi asymétrique ?";
var cryptoExplanationsLabel2 = "Si vous le dites...";
var cryptoExplanationsDialog = getDialog(playerPredef, null, null, {
        category: "Jeu",
        action: "Intro",
        label: "Dialogue 'Cryptrographie ? Asymétrique ?' (Joueur)",
      });

var cryptoExplanationsOpt1Dialog = getDialog(chercheusePredef, "Cryptographie! Du grec ancien <strong>kruptos</strong> (« caché ») et <strong>graphein</strong> (« écrire »). Il s’agit de protéger des messages.", null, {
        category: "Jeu",
        action: "Intro",
        label: "Dialogue 'Définition cryptographie' (Chercheuse)",
      });
var cryptoExplanationsOpt2Dialog = getDialog(chercheusePredef, "Oui ! Asymétrique, on l’appelle aussi cryptographie à clé publique car elle repose sur l’utilisation de deux types de clés <span>:</span> la clé privée, et la clé publique. La clé publique sert à chiffrer, ou coder si tu préfères, les messages, tandis que la clé privée permet de les déchiffrer.", null, {
        category: "Jeu",
        action: "Intro",
        label: "Dialogue 'Explication cryptographie asymétrique' (Chercheuse)",
      });

var goingToCreateKeysDialog = getDialog(chercheusePredef, "Tu vas maintenant créer ta paire de clé privée / clé publique mais<span>...</span> n’oublie pas, cette clé privée est... privée ! Toi seul dois la connaître ! Ta clé publique sera diffusée sur le réseau à l’ensemble des chercheurs de l’Institut.", null, {
        category: "Jeu",
        action: "Intro - Création clé publique",
        label: "Dialogue 'Tu vas créer ta paire clé privée / publique' (Chercheuse)",
      });

var keysExplanationsLabel0 = "Clé privée ? Qu'est-ce que c'est ?";
var keysExplanationsLabel1 = "Une clé publique ? Pourquoi ma clé serait-elle publique ?";
var keysExplanationsLabel2 = "D'accord, j'ai compris.";
var keysExplanationsDialog = getDialog(playerPredef, null, null, {
        category: "Jeu",
        action: "Intro - Création clé publique",
        label: "Dialogue 'Clé privée ? Clé publique ?' (Joueur)",
      });

var keysExplanationsOpt1Dialog = getDialog(chercheusePredef, "Ta clé privée est la clé que toi seul connaîtra, c'est elle qui te permettra de déchiffrer facilement les message qui te seront envoyés. <em>Sans la clé privée il est très difficile,</em> voir impossible, <em>de déchiffrer un message crypté.</em>", null, {
        category: "Jeu",
        action: "Intro - Création clé publique",
        label: "Dialogue 'Explication clé privé' (Chercheuse)",
      });
var keysExplanationsOpt2Dialog = getDialog(chercheusePredef, "Ta clé publique sera dérivée de ta clé privée. De la même manière qu'un <em>cadenas</em> permet de <em>sécuriser le contenu d'un coffre,</em> la <em>clé publique</em> permet de <em>chiffrer des messages</em> et les rendre illisibles à ceux qui ne disposent pas de la clé privée.", null, {
        category: "Jeu",
        action: "Intro - Création clé publique",
        label: "Dialogue 'Explication clé publique' (Chercheuse)",
      });

var hereYourPrivateKeyDialog = getDialog(chercheusePredef, "Voici ta clé privée, elle s'affiche en haut de ton écran, utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.", null, {
        category: "Jeu",
        action: "Intro - Création clé publique",
        label: "Dialogue 'Voici ta clé privée' (Chercheuse)",
      });

var fallSixTimesDialog = getDialog(chercheusePredef, "Pour générer ta clé publique, fais tomber six fois ta clé privée. Si le niveau de sécurité est suffisant, ta clé publique sera sauvegardée, sinon l'ordinateur la complétera.", null, {
        category: "Jeu",
        action: "Intro - Création clé publique",
        label: "Dialogue 'Faire tomber 6 fois la clé privée' (Chercheuse)",
      });

var helpCreateKeyDialog = getDialog(chercheusePredef, "Pour générer ta clé publique, manipule ta clé privée avec <img src='img/icn-arrow-left.png' class='keyboard-key'>, <img src='img/icn-arrow-up.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png' class='keyboard-key'> puis fais-la tomber six fois avec la touche <img src='img/icn-arrow-down.png' class='keyboard-key'>. Si le niveau de sécurité est suffisant, ta clé publique sera sauvegardée, sinon l'ordinateur la complétera.", null, {
        category: "Jeu",
        action: "Intro - Création clé publique",
        label: "Dialogue 'Aide création de clé publique' (Chercheuse)",
      });

var pauseCreateKeyDialog = getDialog(pausePredef, null, null, {
        category: "Jeu",
        action: "Intro - Création clé publique",
        label: "Pause",
      });

var keyPreGeneratedErrorText = "Très bien, tu as compris ! Cependant la clé publique générée n'est pas suffisamment sécurisée, l'ordinateur va arranger cela.";

var keyPreGeneratedSuccessText = "Félicitations, tu as compris le fonctionnement et la clé publique générée est efficace !";
var keyPreGeneratedDialog = getDialog(chercheusePredef, keyPreGeneratedSuccessText, null, {
        category: "Jeu",
        action: "Intro - Création clé publique",
        label: "Clé crée avec succès",
      });

var wellDoneDialog = getDialog(chercheusePredef, "Parfait ! Te voilà fin prêt! J’ai bien ta clé publique... Vérifions que tout fonctionne. Je t’envoie un premier message crypté.", null, {
        category: "Jeu",
        action: "Intro - Création clé publique",
        label: "Dialogue 'Vérifions que tout fonctionne' (Chercheuse)",
      });

var letsGoToEncryptDialog = getDialog(chercheusePredef, "J'utilise ta clé publique pour crypter mon message.", null, {
        category: "Jeu",
        action: "Intro - Chercheuse crypte un message",
        label: "Dialogue 'J’utilise ta clé publique pour crypter' (Chercheuse)",
      });

var helpPlayChercheuseDialog = getDialog(chercheusePredef, "Je suis en train de crypter un message que tu pourras décrypter par la suite.", null, {
        category: "Jeu",
        action: "Intro - Chercheuse crypte un message",
        label: "Dialogue 'Aide' (Chercheuse)",
      });

var pausePlayChercheuseDialog = getDialog(pausePredef, null, null, {
        category: "Jeu",
        action: "Intro - Chercheuse crypte un message",
        label: "Pause",
      });

/**
 * Tutoriel decryptage
 */

var firstMessageDialog = getDialog(inriosPredef, null, null, {
        category: "Jeu",
        action: "Intro - Tutoriel decryptage",
        label: "Dialogue 'Message crypté' (InriOS)",
      });

var helpPlaySoloDialog = getDialog(chercheusePredef, "Ta clé privée se trouve en haut. Utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.", null, {
        category: "Jeu",
        action: "Intro - Tutoriel decryptage",
        label: "Dialogue 'Aide 1/2' (Chercheuse)",
      });

var helpPlaySolo2Dialog = getDialog(chercheusePredef, "Lorsque deux blocs de même couleur se touchent : ils s'additionnent, sinon ils se détruisent. Ton message est décrypté lorsqu'il ne reste qu'une seule ligne au message. A toi de jouer !", null, {
        category: "Jeu",
        action: "Intro - Tutoriel decryptage",
        label: "Dialogue 'Aide 2/2' (Chercheuse)",
      });

var pausePlaySoloDialog = getDialog(pausePredef, null, null, {
        category: "Jeu",
        action: "Intro - Tutoriel decryptage",
        label: "Pause",
      });

var messageTestDialog = getDialog(chercheusePredef, "Voici le message que j'ai crypté à l’aide de ta <em>clé publique</em>, pour le décrypter tu dois utiliser ta <em>clé privée.</em> Manipule ta clé comme tout à l’heure avec <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour déplacer les colonnes et <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'>. pour inverser les couleurs des blocs.", null, {
        category: "Jeu",
        action: "Intro - Tutoriel decryptage",
        label: "Dialogue 'Explication decryptage 1/2' (Chercheuse)",
      });

var tutorialDialog = getDialog(chercheusePredef, "Lorsque tu appuies sur <img src='img/icn-arrow-down.png' class='keyboard-key'> ta clé est envoyée sur le message à décrypter et les blocs vont s’annuler s’ils sont de couleurs opposées ou s’empiler s’ils sont de même couleur. Le message est décrypté lorsque tu n’as plus qu’une seule ligne de blocs en bas. À toi de jouer !", null, {
        category: "Jeu",
        action: "Intro - Tutoriel decryptage",
        label: "Dialogue 'Explication decryptage 2/2' (Chercheuse)",
      });

var decryptedMessage0DialogText = "OK, tu as réussi à lire ce message.";

var randLetter,
  o,
  t = decryptedMessage0DialogText;
                
  // we need to do it once more;
  t = $('<div></div>').html(t).text();

  for (var i = 0; i < t.length; i++) {
    randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
    o += "<span class='letter-block crypted'>" + randLetter + "</span>";
  }

var decryptedMessage0TCallback = {
  in: function() {
    // alert("Dialog was added to the dom");
  },
  show: function() {
    // alert("Dialog intro animation is complete");
    $.simulateDecrypt($(".dialog .content .text"), decryptedMessage0DialogText, 2);
  },
  out: function() {
    // alert("Dialog outro animation is complete, html element will be removed now.");
  }
};

var decryptedMessage0Dialog = getDialog(decryptedPredef, o, decryptedMessage0TCallback, {
        category: "Jeu",
        action: "Intro - Tutoriel decryptage",
        label: "Dialogue 'Affichage du message décrypté' (InriOS)",
      });

var congratulationsOnCompletingTutorialDialog = getDialog(chercheusePredef, "Parfait ! Tu as compris <em>comment décrypter un message à l'aide de ta clé privée,</em> je n’en attendais pas <span>moins de toi !</span> Te voilà fin prêt et tu es maintenant un membre à part entière de l’Institut.", null, {
        category: "Jeu",
        action: "Intro - Tutoriel decryptage",
        label: "Dialogue 'Félicitations, fin du tutoriel' (Chercheuse)",
      });

/**
 * Déroulage de l'intrigue
 */

var aProblemOccursDialog = getDialog(chercheusePredef, "C'est bizarre, le serveur a signalé une panne, je dois aller en salle des machines pour vérifier que tout est en ordre. Il faudra que tu branches ou débranches certains câbles.", null, {
        category: "Jeu",
        action: "Intro - Fin",
        label: "Dialogue 'Le serveur signale une panne' (Chercheuse)",
      });

var weirdDialog = getDialog(chercheusePredef, (currentGame.litteralName != "" ? " <em>" + currentGame.litteralName + ",</em> e" : "E") + "st-ce que tu me reçois ? C’est vraiment bizarre, notre serveur refuse obstinément de se re-configurer et m'empêche de sortir <sspan>de la salle </sspan>des machines, essaie de débrancher le câble n° 42 du tableau électrique principal.", null, {
        category: "Jeu",
        action: "Intro - Fin",
        label: "Dialogue 'Essaie de débrancher le câble 42' (Chercheuse)",
      });

var cables0Dialog = getDialog(cablesPredef, null, null, {
        category: "Jeu",
        action: "Intro - Fin",
        label: "Ecran debrancher câble",
      });

var electricShockDialog = getDialog(playerPredef, null, null, {
        category: "Jeu",
        action: "Intro - Fin",
        label: "Dialogue 'Je viens de me prendre une décharge éléctrique' (Joueur)",
      });

var thisAintNormalDialog = getDialog(chercheusePredef, "Attends, ce n’est pas normal... Je vérifie... Ça alors ! Le serveur s’est reprogrammé de lui-même et il contrôle le système. Manifestement, il nous écoute et t’a empêché de débrancher le câble, tout comme il a verrouillé les portes de la salle. Je suis enfermée ici !", null, {
        category: "Jeu",
        action: "Intro - Fin",
        label: "Dialogue 'Ce n’est pas normal' (Chercheuse)",
      });

var useCryptoProtocolDialog = getDialog(chercheusePredef, "C’est le bon moment pour utiliser le protocole de cryptage afin de l’empêcher de nous écouter ! Je vais t'envoyer la liste des câbles à débrancher, mais un par un, et de manière cryptée.", null, {
        category: "Jeu",
        action: "Intro - Fin",
        label: "Dialogue 'Utilisons le protocole de cryptage' (Chercheuse)",
      });


/**
 * Level 1
 */

var sendingFirstCableDialog = getDialog(chercheusePredef, "Je t'envoie un message crypté contenant le premier numéro de câble à débrancher et le tableau électrique correspondant.", null, {
        category: "Jeu",
        action: "Niveau 1",
        label: "Dialogue 'Envoi du message crypté' (Chercheuse)",
      });

var firstBattleMessageDialog = getDialog(inriosPredef, null, null, {
        category: "Jeu",
        action: "Niveau 1",
        label: "Dialogue 'Message crypté' (InriOS)",
      });

var helpPlayMinDialog = getDialog(chercheusePredef, "Ta clé privée se trouve en haut. Utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.", null, {
        category: "Jeu",
        action: "Niveau 1",
        label: "Dialogue 'Aide (1/2)' (Chercheuse)",
      });

var helpPlayMin2Dialog = getDialog(chercheusePredef, "Lorsque deux blocs de même couleur se touchent : ils s'additionnent, sinon ils se détruisent. Ton message est décrypté lorsqu'il ne reste qu'une seule ligne au message. A toi de jouer !", null, {
        category: "Jeu",
        action: "Niveau 1",
        label: "Dialogue 'Aide (2/2)' (Chercheuse)",
      });

var pausePlayMinDialog = getDialog(pausePredef, null, null, {
        category: "Jeu",
        action: "Niveau 1",
        label: "Pause",
      });

var serverAlsoTryingToBreakEncryptionDialog = getDialog(chercheusePredef, "Zut, le serveur essaie lui aussi de décrypter le message, <em>heureusement il ne dispose que de ta clé publique !</em> Je t’envoie en temps réel les informations correspondant à son avancé, dépêche toi de décrypter le message avant qu’il n’arrive à casser le code.", null, {
        category: "Jeu",
        action: "Niveau 1",
        label: "Dialogue 'Le serveur essaie de décrypter le message !' (Chercheuse)",
      });


var decryptedMessage1DialogText = "Débranche le câble 24 du panneau électrique V";
randLetter = null;
o = "";
t = decryptedMessage1DialogText;
                
// we need to do it once more;
t = $('<div></div>').html(t).text();

for (var i = 0; i < t.length; i++) {
  randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
  o += "<span class='letter-block crypted'>" + randLetter + "</span>";
}

var decryptedMessage1TCallback = {
  in: function() {
    // alert("Dialog was added to the dom");
  },
  show: function() {
    // alert("Dialog intro animation is complete");
    $.simulateDecrypt($(".dialog .content .text"), decryptedMessage1DialogText, 21);
    $.simulateDecrypt($(".dialog .content .text"), decryptedMessage1DialogText, 26, -26);
  },
  out: function() {
    // alert("Dialog outro animation is complete, html element will be removed now.");
  }
};

var decryptedMessage1Dialog = getDialog(decryptedPredef, o, decryptedMessage1TCallback, {
        category: "Jeu",
        action: "Niveau 1",
        label: "Dialogue 'Message décrypté' (InriOS)",
      });

var cables1Dialog = getDialog(cablesPredef, null, null, {
        category: "Jeu",
        action: "Niveau 1",
        label: "Ecran débrancher câble",
      });

var successCables1Dialog = getDialog(chercheusePredef, "Bravo, tu as débranché le bon câble ! Plus que deux panneaux électriques et&nbsp;ça devrait être bon !", null, {
        category: "Jeu",
        action: "Niveau 1",
        label: "Dialogue 'Câble débranché' (Chercheuse)",
      });

/**
 *  Level 2
 */

var serverIsFasterDialog = getDialog(chercheusePredef, "Malheureusement, le serveur a accès à notre base de données, <span>et a appris</span> comment décrypter plus vite. Je fais ce que je peux pour le ralentir, mais sa capacité de calcul et son adresse ne font qu'augmenter !", null, {
        category: "Jeu",
        action: "Niveau 2",
        label: "Dialogue 'Le serveur est plus rapide' (Chercheuse)",
      });

var sendingSecondCableDialog = getDialog(chercheusePredef, "Je t'envoie le deuxième câble, crypté avec deux blocs de plus. Avec la cryptographie asymétrique, lorsqu’on augmente le  nombre de bits, la difficulté du calcul augmente de manière exponentielle pour un attaquant. Cela devrait donc faire l’affaire.", null, {
        category: "Jeu",
        action: "Niveau 2",
        label: "Dialogue 'Envoi du message crypté' (Chercheuse)",
      });

var secondBattleMessageDialog = getDialog(inriosPredef, null, null, {
        category: "Jeu",
        action: "Niveau 2",
        label: "Dialogue 'Message crypté' (InriOS)",
      });

var helpPlayMediumDialog = getDialog(chercheusePredef, "Ta clé privée se trouve en haut. Utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.", null, {
        category: "Jeu",
        action: "Niveau 2",
        label: "Dialogue 'Aide (1/2)' (Chercheuse)",
      });

var helpPlayMedium2Dialog = getDialog(chercheusePredef, "Lorsque deux blocs de même couleur se touchent : ils s'additionnent, sinon ils se détruisent. Ton message est décrypté lorsqu'il ne reste qu'une seule ligne au message. A toi de jouer !", null, {
        category: "Jeu",
        action: "Niveau 2",
        label: "Dialogue 'Aide (2/2)' (Chercheuse)",
      });

var pausePlayMediumDialog = getDialog(pausePredef, null, null, {
        category: "Jeu",
        action: "Niveau 2",
        label: "Pause",
      });


var decryptedMessage2DialogText = "Débranche le câble 78 du panneau électrique M";
randLetter = null;
o = "";
t = decryptedMessage2DialogText;
                
// we need to do it once more;
t = $('<div></div>').html(t).text();

for (var i = 0; i < t.length; i++) {
  randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
  o += "<span class='letter-block crypted'>" + randLetter + "</span>";
}

var decryptedMessage2TCallback = {
  in: function() {
    // alert("Dialog was added to the dom");
  },
  show: function() {
    // alert("Dialog intro animation is complete");
    $.simulateDecrypt($(".dialog .content .text"), decryptedMessage2DialogText, 21);
    $.simulateDecrypt($(".dialog .content .text"), decryptedMessage2DialogText, 26, -26);
  },
  out: function() {
    // alert("Dialog outro animation is complete, html element will be removed now.");
  }
};

var decryptedMessage2Dialog = getDialog(decryptedPredef, o, decryptedMessage2TCallback, {
        category: "Jeu",
        action: "Niveau 2",
        label: "Dialogue 'Message décrypté' (InriOS)",
      });

var cables2Dialog = getDialog(cablesPredef, null, null, {
        category: "Jeu",
        action: "Niveau 2",
        label: "Ecran débrancher câble",
      });

var successCables2Dialog = getDialog(chercheusePredef, "Très bien, tu as débranché le bon câble ! Plus qu'un panneau électrique et je pourrai enfin sortir !", null, {
        category: "Jeu",
        action: "Niveau 2",
        label: "Dialogue 'Câble débranché' (Chercheuse)",
      });

/**
 * Level 3
 */

var serverIsInfectingOtherMachinesDialog = getDialog(chercheusePredef, "Ce serveur ne devrait pas être en mesure de décrypter aussi rapidement ces messages... J’ai compris ! Il contamine d’autres ordinateurs et augmente ainsi sa puissance !", null, {
        category: "Jeu",
        action: "Niveau 3",
        label: "Dialogue 'Le serveur infecte d’autres machines' (Chercheuse)",
      });

var sendingThirdCableDialog = getDialog(chercheusePredef, "Je t'envoie le dernier câble, en augmentant encore la difficulté du cryptage. Il lui faudra quelques centaines de jours pour <span>décrypter ce dernier message</span>, et d'ici là nous l'aurons débranché et analysé !", null, {
        category: "Jeu",
        action: "Niveau 3",
        label: "Dialogue 'Envoi du message crypté' (Chercheuse)",
      });

var thirdBattleMessageDialog = getDialog(inriosPredef, null, null, {
        category: "Jeu",
        action: "Niveau 3",
        label: "Dialogue 'Message crypté' (InriOS)",
      });

var helpPlayMaxDialog = getDialog(chercheusePredef, "Ta clé privée se trouve en haut. Utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.", null, {
        category: "Jeu",
        action: "Niveau 3",
        label: "Dialogue 'Aide (1/2)' (Chercheuse)",
      });

var helpPlayMax2Dialog = getDialog(chercheusePredef, "Lorsque deux blocs de même couleur se touchent : ils s'additionnent, sinon ils se détruisent. Ton message est décrypté lorsqu'il ne reste qu'une seule ligne au message. A toi de jouer !", null, {
        category: "Jeu",
        action: "Niveau 3",
        label: "Dialogue 'Aide (2/2)' (Chercheuse)",
      });

var pausePlayMaxDialog = getDialog(pausePredef, null, null, {
        category: "Jeu",
        action: "Niveau 3",
        label: "Pause",
      });

var decryptedMessage3DialogText = "Débranche le câble 31 du panneau électrique N";
randLetter = null;
o = "";
t = decryptedMessage3DialogText;
                
// we need to do it once more;
t = $('<div></div>').html(t).text();

for (var i = 0; i < t.length; i++) {
  randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
  o += "<span class='letter-block crypted'>" + randLetter + "</span>";
}

var decryptedMessage3TCallback = {
  in: function() {
    // alert("Dialog was added to the dom");
  },
  show: function() {
    // alert("Dialog intro animation is complete");
    $.simulateDecrypt($(".dialog .content .text"), decryptedMessage3DialogText, 21);
    $.simulateDecrypt($(".dialog .content .text"), decryptedMessage3DialogText, 26, -26);
  },
  out: function() {
    // alert("Dialog outro animation is complete, html element will be removed now.");
  }
};

var decryptedMessage3Dialog = getDialog(decryptedPredef, o, decryptedMessage3TCallback, {
        category: "Jeu",
        action: "Niveau 3",
        label: "Dialogue 'Message décrypté' (InriOS)",
      });

var cables3Dialog = getDialog(cablesPredef, null, null, {
        category: "Jeu",
        action: "Niveau 3",
        label: "Ecran débrancher câble",
      });

var successCables3Dialog = getDialog(chercheusePredef, "Mes félicitations ! Nous avons réussi à contenir la machine. Sa capacité de calcul augmentait de manière phénoménale, mais pas aussi rapidement que&nbsp;la difficulté du décryptage…", null, {
        category: "Jeu",
        action: "Niveau 3",
        label: "Dialogue 'Câble débranché' (Chercheuse)",
      });


/**
 *  Outro
 */

var IWasTrappedDialog = getDialog(chercheusePredef, "J’ai bien failli rester enfermée pour de bon et le serveur aurait pu contaminer tout internet, absorbant les données personnelles de la planète entière !", null, {
        category: "Jeu",
        action: "Outro",
        label: "Dialogue 'J’ai failli rester enfermée' (Chercheuse)",
      });

var thanksToCryptoDialog = getDialog(chercheusePredef, "Heureusement, grâce à la cryptographie asymétrique, aucune machine ne peut décrypter assez vite nos messages. Les différents niveaux d’encryption ne t’ont pas vraiment compliqué <span>la tâche,</span> car tu disposes de la clé privée.", null, {
        category: "Jeu",
        action: "Outro",
        label: "Dialogue 'Grâce à la cryptographie asymétrique' (Chercheuse)",
      });

var thanksToCrypto2Dialog = getDialog(chercheusePredef, "En revanche la difficulté pour l’ordinateur a augmenté bien plus vite que sa&nbsp;capacité de calcul. CQFD !", null, {
        category: "Jeu",
        action: "Outro",
        label: "Dialogue 'Difficulté exponentielle pour l’ordinateur' (Chercheuse)",
      });

var comparePlayTimeChartDialog = getDialog(graphPredef, "Blah Blah", null, {
        category: "Jeu",
        action: "Outro",
        label: "Comparaison des temps de jeu",
      });
