var animateTextDelayBetweenLetters = 20;
var readingDelay = 4000;

var labelNext = "Suite";
var labelPrev = "Précédent"
var labelOpenMessage = "Ouvrir le message";
var labelDecryptMessage = "Décrypter le message";

function addControlToDialog(dialogName, controls) {
  dialogName['controls'] = controls;
}

function updateNameFunction() {
}

var chercheusePredef = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: "Chercheuse"
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
var gameOverDialog = getDialog(chercheusePredef, "Il faut vraiment que tu puisses décrypter ce message avant l'ordinateur. Reprennons de zéro !", null, {
  category: "Arcade",
  action: "Niveau non précisé",
  label: "Game over (l’ordinateur a gagné)",
});

var tooManyBlocksDialog = getDialog(chercheusePredef, "Pour décrypter le message tu dois détruire les blocs, tu es en train de les accumuler. Reprennons de zéro !", null, {
  category: "Arcade",
  action: "Niveau non précisé",
  label: "Game over (le joueur ne joue pas correctement)",
});

var announcePublicKeyDialog = getDialog(chercheusePredef, "Tu vas créer ta paire de clé privée / clé publique mais<span>...</span> n’oublie pas, cette clé privée est... privée ! Toi seul dois la connaître ! Ta clé publique sera diffusée sur le réseau à l’ensemble des chercheurs de l’Institut.", null, {
  category: "Jeu",
  action: "Création clé publique",
  label: "Dialogue 'Tu vas créer ta paire de clés' (Chercheuse)",
});

var hereYourPrivateKeyDialog = getDialog(chercheusePredef, "Voici ta clé privée, utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la manipuler selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix.", null,  {
  category: "Arcade",
  action: "Création clé publique",
  label: "Dialogue 'Voici ta clé privée' (Chercheuse)",
});

var fallSixTimesDialog = getDialog(chercheusePredef, "Pour générer ta clé publique, fais tomber six ou sept fois ta clé privée. Si le niveau de sécurité est suffisant, ta clé publique sera sauvegardée, sinon l'ordinateur la complétera.", null, {
  category: "Arcade",
  action: "Création clé publique",
  label: "Dialogue 'Faire tomber 6 fois la clé privée' (Chercheuse)",
});

var keyPregeneratedDialog = getDialog(chercheusePredef, "Félicitations, tu as compris le fonctionnement.", null, {
  category: "Arcade",
  action: "Intro - Création clé publique",
  label: "Clé créée avec succès",
});
