var animateTextDelayBetweenLetters = 20;
var readingDelay = 4000;

var youAreIntern = "Tu es stagiaire dans une équipe de recherche Inria";
var firstDay = "Premier jour à l'institut";

var labelNext = "Suite";
var labelPrev = "Précédent"
var labelOpenMessage = "Ouvrir le message";
var labelDecryptMessage = "Décrypter le message";
var labelCutCable = "Débrancher le câble";
var labelAie = "Aie ! Je viens de me prendre une décharge électrique !";

var controlNext = {label: labelNext, class: "button blue", onClick: function() { $(document).trigger('nextDialog')}};
var controlOpen = {label: labelOpenMessage, class: "button blue", onClick: function() { $(document).trigger('nextDialog')}};
var controlDecrypt = {label: labelOpenMessage, class: "button blue", onClick: function() { $(document).trigger('nextDialog')}};
var controlPrev = {label: labelPrev, class: "button red", onClick: function() { $(document).trigger('prevDialog')}};
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
      $('.prompt .content').typeLetterByLetter(youAreIntern, animateTextDelayBetweenLetters, function() {
        // Second prompt
        setTimeout(function() {
          $('.prompt .content').text('');
          setTimeout(function() {
            $('.prompt .content').typeLetterByLetter(firstDay, animateTextDelayBetweenLetters,function() {
              // Switch to institute
              setTimeout(function() { 
                $(document).trigger('nextDialog');
              }, readingDelay);
            });
          }, 2000)
        }, readingDelay);
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
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse"
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
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
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

function getDialog(predef, content) {
  var newDialog = {};

  for (var key in predef) {
    newDialog[key] = predef[key];
  }
  newDialog['content'] = content;

  return newDialog;
}
var gameOverDialog = getDialog(chercheusePredef, "Il faut vraiment que tu puisses décrypter ce message avant l'ordinateur. Reprennons de zéro !");
var tooManyBlocksDialog = getDialog(chercheusePredef, "Pour décrypter le message tu dois détruire les blocs, tu es en train de les accumuler. Reprennons de zéro !");

var welcomeInstituteDialog = getDialog(chercheusePredef, "Bienvenue à l’Institut ! C’est donc toi mon nouvel apprenti, parfait ! Commençons par le commencement, il te faudra un compte utilisateur pour te connecter au réseau, tu n’as qu’à choisir ton nom d’utilisateur.");
var accountCreatedDialog = getDialog(chercheusePredef, "Parfait" + (currentGame.litteralName != "" ? " <em>" + currentGame.litteralName + "</em>" : "" ) + ", ton compte est maintenant créé. Afin de sécuriser les échanges sur le réseau, nous utilisons un protocole de cryptographie asymétrique.");

var cryptoExplanationsLabel0 = "Cryptogra... quoi ?";
var cryptoExplanationsLabel1 = "Asymétrique ? Pourquoi asymétrique ?";
var cryptoExplanationsLabel2 = "Si vous le dites...";
var cryptoExplanationsDialog = getDialog(playerPredef, null);

var cryptoExplanationsOpt1Dialog = getDialog(chercheusePredef, "Cryptographie! Du grec ancien <strong>kruptos</strong> (« caché ») et <strong>graphein</strong> (« écrire »). Il s’agit de protéger des messages.");
var cryptoExplanationsOpt2Dialog = getDialog(chercheusePredef, "Oui ! Asymétrique, on l’appelle aussi cryptographie à clé publique car elle repose sur l’utilisation de deux types de clés <span>:</span> la clé privée, et la clé publique. La clé publique sert à chiffrer, ou coder si tu préfères, les messages, tandis que la clé privée permet de les déchiffrer.");

var goingToCreateKeysDialog = getDialog(chercheusePredef, "Tu vas maintenant créer ta paire de clé privée / clé publique mais<span>...</span> n’oublie pas, cette clé privée est... privée ! Toi seul dois la connaître ! Ta clé publique sera diffusée sur le réseau à l’ensemble des chercheurs de l’Institut.");

var keysExplanationsLabel0 = "Clé privée ? Qu'est-ce que c'est ?";
var keysExplanationsLabel1 = "Une clé publique ? Pourquoi ma clé serait-elle publique ?";
var keysExplanationsLabel2 = "D'accord, j'ai compris.";
var keysExplanationsDialog = getDialog(playerPredef, null);

var keysExplanationsOpt1Dialog = getDialog(chercheusePredef, "Ta clé privée est la clé que toi seul connaîtra, c'est elle qui te permettra de déchiffrer facilement les message qui te seront envoyés. <em>Sans la clé privée il est très difficile,</em> voir impossible, <em>de déchiffrer un message crypté.</em>");
var keysExplanationsOpt2Dialog = getDialog(chercheusePredef, "Ta clé publique sera dérivée de ta clé privée. De la même manière qu'un <em>cadenas</em> permet de <em>sécuriser le contenu d'un coffre,</em> la <em>clé publique</em> permet de <em>chiffrer des messages</em> et les rendre illisibles à ceux qui ne disposent pas de la clé privée.");
var hereYourPrivateKeyDialog = getDialog(chercheusePredef, "Voici ta clé privée, utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.");
var fallSixTimesDialog = getDialog(chercheusePredef, "Pour générer ta clé publique, fais tomber six fois ta clé privée. Si le niveau de sécurité est suffisant, ta clé publique sera sauvegardée, sinon l'ordinateur la complétera.");

var helpCreateKeyDialog = getDialog(chercheusePredef, "Pour générer ta clé publique, fais tomber six fois ta clé privée. Si le niveau de sécurité est suffisant, ta clé publique sera sauvegardée, sinon l'ordinateur la complétera.");
var keyPreGeneratedErrorText = "Très bien, tu as compris ! Cependant la clé publique générée n'est pas suffisamment sécurisée, l'ordinateur va arranger cela.";
var keyPreGeneratedSuccessText = "Félicitations, tu as compris le fonctionnement et la clé publique générée est efficace !";
var keyPreGeneratedDialog = getDialog(chercheusePredef, keyPreGeneratedSuccessText);
var wellDoneDialog = getDialog(chercheusePredef, "Parfait ! Te voilà fin prêt! J’ai bien ta clé publique... Vérifions que tout fonctionne. Je t’envoie un premier message crypté.");

var letsGoToEncryptDialog = getDialog(chercheusePredef, "J'utilise ta clé publique pour crypter mon message.");
var helpPlayChercheuseDialog = getDialog(chercheusePredef, "Je suis en train de crypter un message que tu pourras décrypter par la suite.");

var firstMessageDialog = getDialog(inriosPredef, null);
var helpPlaySoloDialog = getDialog(chercheusePredef, "Ta clé privée se trouve en haut. Utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.");
var helpPlaySolo2Dialog = getDialog(chercheusePredef, "Lorsque deux blocs de même couleur se touchent : ils s'additionnent, sinon ils se détruisent. Ton message est décrypté lorsqu'il ne reste qu'une seule ligne au message. A toi de jouer !");

var messageTestDialog = getDialog(chercheusePredef, "Voici le message que j'ai crypté à l’aide de ta <em>clé publique</em>, pour le décrypter tu dois utiliser ta <em>clé privée.</em> Manipule ta clé comme tout à l’heure avec <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour déplacer les colonnes et <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'>. pour inverser les couleurs des blocs.");
var tutorialDialog = getDialog(chercheusePredef, "Lorsque tu appuies sur <img src='img/icn-arrow-down.png' class='keyboard-key'> ta clé est envoyée sur le message à décrypter et les blocs vont s’annuler s’ils sont de couleurs opposées ou s’empiler s’ils sont de même couleur. Le message est décrypté lorsque tu n’as plus qu’une seule ligne de blocs en bas. À toi de jouer !");
var decryptedMessage0Dialog = getDialog(decryptedPredef, "Ok, tu as réussi à lire ce message :)");
var congratulationsOnCompletingTutorialDialog = getDialog(chercheusePredef, "Parfait ! Tu as compris <em>comment décrypter un message à l'aide de ta clé privée,</em> je n’en attendais pas <span>moins de toi !</span> Te voilà fin prêt et tu es maintenant un membre à part entière de l’Institut.");

var aProblemOccursDialog = getDialog(chercheusePredef, "C'est bizarre, le serveur a signalé une panne, je dois aller en salle des machines pour vérifier que tout est en ordre. Il faudra que tu branches ou débranches certains câbles.");
var weirdDialog = getDialog(chercheusePredef, (currentGame.litteralName != "" ? " <em>" + currentGame.litteralName + ",</em> e" : "E") + "st-ce que tu me reçois ? C’est vraiment bizarre, notre serveur refuse obstinément de se re-configurer et m'empêche de sortir <sspan>de la salle </sspan>des machines, essaie de débrancher le câble n° 42 du tableau électrique principal.");
var cables0Dialog = getDialog(cablesPredef, null);
var electricShockDialog = getDialog(playerPredef, null);
var thisAintNormalDialog = getDialog(chercheusePredef, "Attends, ce n’est pas normal... Je vérifie... Ça alors ! Le serveur s’est reprogrammé de lui-même et il contrôle le système. Manifestement, il nous écoute et t’a empêché de débrancher le câble, tout comme il a verrouillé les portes de la salle. Je suis enfermée ici !");
var useCryptoProtocolDialog = getDialog(chercheusePredef, "C’est le bon moment pour utiliser le protocole de cryptage afin de l’empêcher de nous écouter ! Je vais t'envoyer la liste des câbles à débrancher, mais un par un, et de manière cryptée.");

var sendingFirstCableDialog = getDialog(chercheusePredef, "Je t'envoie un message crypté contenant le premier numéro de câble à débrancher et le tableau électrique correspondant.");
var firstBattleMessageDialog = getDialog(inriosPredef, null);
var helpPlayMinDialog = getDialog(chercheusePredef, "Ta clé privée se trouve en haut. Utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.");
var helpPlayMin2Dialog = getDialog(chercheusePredef, "Lorsque deux blocs de même couleur se touchent : ils s'additionnent, sinon ils se détruisent. Ton message est décrypté lorsqu'il ne reste qu'une seule ligne au message. A toi de jouer !");
var serverAlsoTryingToBreakEncryptionDialog = getDialog(chercheusePredef, "Zut, le serveur essaie lui aussi de décrypter le message, <em>heureusement il ne dispose que de ta clé publique !</em> Je t’envoie en temps réel les informations correspondant à son avancé, dépêche toi de décrypter le message avant qu’il n’arrive à casser le code.");
var decryptedMessage1Dialog = getDialog(decryptedPredef, "Débranche le câble 24 du panneau électrique V");
var cables1Dialog = getDialog(cablesPredef, null);
var successCables1Dialog = getDialog(chercheusePredef, "Bravo, tu as débranché le bon câble ! Plus que deux panneaux électriques et ça devrait être bon !");
var serverIsFasterDialog = getDialog(chercheusePredef, "Malheureusement, le serveur a accès à notre base de données, <span>et a appris</span> comment décrypter plus vite. Je fais ce que je peux pour le ralentir, mais sa capacité de calcul et son adresse ne font qu'augmenter !");

var sendingSecondCableDialog = getDialog(chercheusePredef, "Je t'envoie le deuxième câble, crypté avec deux blocs de plus. Avec la cryptographie asymétrique, lorsqu’on augmente le  nombre de bits, la difficulté du calcul augmente de manière exponentielle pour un attaquant. Cela devrait donc faire l’affaire.");
var secondBattleMessageDialog = getDialog(inriosPredef, null);
var helpPlayMediumDialog = getDialog(chercheusePredef, "Ta clé privée se trouve en haut. Utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.");
var helpPlayMedium2Dialog = getDialog(chercheusePredef, "Lorsque deux blocs de même couleur se touchent : ils s'additionnent, sinon ils se détruisent. Ton message est décrypté lorsqu'il ne reste qu'une seule ligne au message. A toi de jouer !");
var decryptedMessage2Dialog = getDialog(decryptedPredef, "Débranche le câble 78 du panneau électrique M");
var cables2Dialog = getDialog(cablesPredef, null);
var successCables2Dialog = getDialog(chercheusePredef, "Très bien, tu as débranché le bon câble ! Plus qu'un panneau électrique et je pourrai enfin sortir !");

var serverIsInfectingOtherMachinesDialog = getDialog(chercheusePredef, "Ce serveur ne devrait pas être en mesure de décrypter aussi rapidement ces messages... J’ai compris ! Il contamine d’autres ordinateurs et augmente ainsi sa puissance !");
var sendingThirdCableDialog = getDialog(chercheusePredef, "Je t'envoie le dernier câble, en augmentant encore la difficulté du cryptage. Il lui faudra quelques centaines de jours pour <span>décrypter ce dernier message</span>, et d'ici là nous l'aurons débranché et analysé !");
var thirdBattleMessageDialog = getDialog(inriosPredef, null);
var helpPlayMaxDialog = getDialog(chercheusePredef, "Ta clé privée se trouve en haut. Utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.");
var helpPlayMax2Dialog = getDialog(chercheusePredef, "Lorsque deux blocs de même couleur se touchent : ils s'additionnent, sinon ils se détruisent. Ton message est décrypté lorsqu'il ne reste qu'une seule ligne au message. A toi de jouer !");
var decryptedMessage3Dialog = getDialog(decryptedPredef, "Débranche le câble 31 du panneau électrique N");
var cables3Dialog = getDialog(cablesPredef, null);
var successCables3Dialog = getDialog(chercheusePredef, "Mes félicitations ! Nous avons réussi à contenir la machine. Sa capacité de calcul augmentait de manière phénoménale, mais pas aussi rapidement que la difficulté du décryptage…");

var IWasTrappedDialog = getDialog(chercheusePredef, "J’ai bien failli rester enfermée pour de bon et le serveur aurait pu contaminer tout internet, absorbant les données personnelles de la planète entière !");
var thanksToCryptoDialog = getDialog(chercheusePredef, "Heureusement, grâce à la cryptographie asymétrique, aucune machine ne peut décrypter assez vite nos messages. Les différents niveaux d’encryption ne t’ont pas vraiment compliqué <span>la tâche,</span> car tu disposes de la clé privée.");
var thanksToCrypto2Dialog = getDialog(chercheusePredef, "En revanche la difficulté pour l’ordinateur a augmenté bien plus vite que sa capacité de calcul. CQFD !");
var comparePlayTimeChartDialog = getDialog(graphPredef, "Blah Blah");
