$(function(){

	// Game settings

	var game = {
		readingDelay: 4000,
		player: {},
		dialog4: [false, false, false],
		dialogWhatArePrivatePublicKey: [false, false, false]
	}


	// hide .hidden elements and remove class
	$('.hidden').hide().removeClass('hidden');

	function intro(){
		// make sure prompt is empty
		$('.prompt .content').text('');

		$("body").closeAllDialogs(function(){

			$.switchWrapper('#prompt', function(){
				// First prompt
				$('.prompt .content').text('');

				setTimeout(function(){
					$('.prompt .content').typeLetterByLetter(
						"Tu es stagiaire dans une équipe de recherche Inria", 
						60, 

						function(){
							// Second prompt
							setTimeout(function(){
								$('.prompt .content').text('');
								setTimeout(function(){
									$('.prompt .content').typeLetterByLetter( "Premier jour à l'institut", 60, function(){
										// Switch to institute
										setTimeout(function(){
											$.switchWrapper('#bg-institut', dialog1);
										}, game.readingDelay);						
									});
								}, 2000)
							}, game.readingDelay);

					});
				}, 2000);					

			});
		});

	}

	function dialog1(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){
	
			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Bienvenue à l’Institut ! C’est donc toi mon nouvel apprenti, parfait ! Commençons par le commencement, il te faudra un compte utilisateur pour te connecter au réseau, tu n’as qu’à choisir ton nom d’utilisateur.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: switchToNewLogin
			    }]

			  });	
			
			});

		});
	}

	function switchToNewLogin() {
		$("body").closeAllDialogs( function(){

			$.switchWrapper('#new-login', function(){
				$('#login-name').focus();

				$('.new-login').submit(function(e){
					game.player.name = $('#login-name').val();
					currentGame.username = game.player.name !== "" ? game.player.name : 'Joueur';
					$.switchWrapper('#bg-institut', dialog2);
					$('.new-login').unbind('submit').submit(function(e){
						return false;
					});
					return false;
				});

			});

		})
	}


	function dialog2(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Parfait"+( game.player.name ? " <em>"+game.player.name+"</em>" : "" ) + ", ton compte est maintenant créé. Afin de sécuriser les échanges sur le réseau, nous utilisons un protocole de cryptographie asymétrique.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialog3
			    }]

			  });	
			
			});

		});
	}

	function dialog3(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    type: "player",
			    title: game.player.name||"Joueur",

			    content: [{
			    	label: "Cryptogra... quoi ?",
			    	onClick: dialog4opt1,
			    	class: game.dialog4[0] ? 'asked': 'not-asked'
			    },
			    {
			    	label: "Asymétrique ? Pourquoi asymétrique ?",
			    	onClick: dialog4opt2,
			    	class: game.dialog4[1] ? 'asked': 'not-asked'
			    },{
			    	label: "Si vous le dites...",
			    	onClick: dialog5,
			    	class: game.dialog4[2] ? 'asked': 'not-asked'
			    }],
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: switchToNewLogin
			    }]

			  });	
			
			});

		});
	}

	function dialog4opt1(){
		game.dialog4[0] = true;

		$("body").closeAllDialogs(function(){
			
			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Cryptographie! Du grec ancien <strong>kruptos</strong> (« caché ») et <strong>graphein</strong> (« écrire »). Il s’agit de protéger des messages.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialog3
			    }]

			  });	

			});

		});

	}


	function dialog4opt2(){
		game.dialog4[1] = true;

		$("body").closeAllDialogs(function(){
			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Oui ! Asymétrique, on l’appelle aussi cryptographie à clé publique car elle repose sur l’utilisation de deux types de clés <span>:</span> la clé privée, et la clé publique. La clé publique sert à chiffrer, ou coder si tu préfères, les messages, tandis que la clé privée permet de les déchiffrer.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialog3
			    }]

			  });	
			
			});

		});

	}

	function dialog5(){
		game.dialog4[2] = true;
		
		$("body").closeAllDialogs(function(){
			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Tu vas maintenant créer ta paire de clé privée / clé publique mais<span>...</span> n’oublie pas, cette clé privée est... privée ! Toi seul dois la connaître ! Ta clé publique sera diffusée sur le réseau à l’ensemble des chercheurs de l’Institut.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogWhatArePrivatePublicKey
			    }]

			  });	
			
			});

		});

	}

	function dialogWhatArePrivatePublicKey(){
		$("body").closeAllDialogs(function(){
			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    type: "player",
			    title: game.player.name||"Joueur",

			    content: [{
			    	label: "Clé privée ? Qu'est-ce que c'est ?",
			    	onClick: dialogWhatArePrivatePublicKeyOpt1,
			    	class: game.dialogWhatArePrivatePublicKey[0] ? 'asked': 'not-asked'
			    },
			    {
			    	label: "Une clé publique ? Pourquoi ma clé serait-elle publique ?",
			    	onClick: dialogWhatArePrivatePublicKeyOpt2,
			    	class: game.dialogWhatArePrivatePublicKey[1] ? 'asked': 'not-asked'
			    },{
			    	label: "D'accord, j'ai compris.",
			    	onClick: dialog6,
			    	class: game.dialogWhatArePrivatePublicKey[2] ? 'asked': 'not-asked'
			    }],
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: switchToNewLogin
			    }]

			  });	
			
			});

		});
	}


	function dialogWhatArePrivatePublicKeyOpt1(){
		game.dialogWhatArePrivatePublicKey[0] = true;

		$("body").closeAllDialogs(function(){
			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Ta clé privée est la clé que toi seul connaîtra, c'est elle qui te permettra de déchiffrer facilement les message qui te seront envoyés. <em>Sans la clé privée il est très difficile,</em> voir impossible, <em>de déchiffrer un message crypté.</em>",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogWhatArePrivatePublicKey
			    }]

			  });	
			
			});

		});

	}	


	function dialogWhatArePrivatePublicKeyOpt2(){
		game.dialogWhatArePrivatePublicKey[1] = true;

		$("body").closeAllDialogs(function(){
			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Ta clé publique sera dérivée de ta clé privée. De la même manière qu'un <em>cadenas</em> permet de <em>sécuriser le contenu d'un coffre,</em> la <em>clé publique</em> permet de <em>chiffrer des messages</em> et les rendre illisibles à ceux qui ne disposent pas de la clé privée.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogWhatArePrivatePublicKey
			    }]

			  });	
			
			});

		});

	}		



	function dialog6(){
		game.dialogWhatArePrivatePublicKey[2] = true;

		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){
			  // Set the createKeyScene as the current scene.
        	  currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['create_key_scene']['scene']), 0, 0, false);
        	  // Disable input in the scene.
        	  currentGame.createKeySceneActive = false;

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Voici ta clé privée, utilise les touches <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour la modifier selon ton envie. Appuie sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'> pour inverser ta clé et lorsque tu seras prêt, appuie sur la touche <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix. L’ordinateur va ensuite générer ta clé publique.",
			    //content: "Voici ta clé privée, tu peux la manipuler à l’aide des touches<br/> <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> de ton clavier pour en décaler les colonnes. Tu peux aussi inverser les colonnes avec <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'>. Quand tu auras fini, appuie sur <img src='img/icn-arrow-down.png' class='keyboard-key'> pour valider ton choix. L’ordinateur va ensuite générer ta clé publique.",

			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: switchToCreateKey
			    }]

			  });
	

			});

		});

	}

	function switchToCreateKey() {
		$("body").closeAllDialogs();
		// Enable the action on the key.
		currentGame.createKeySceneActive = true;


		var timer1 = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
            	/* Set here the number you want make sure that it's inferior at currentGame.maxNewKeyMove in global.js*/
            	if (currentGame.scenes.create_key_scene.game_box.crypt_key.numberApplied === 1) {
            		// Cancel the timer when we display the message.
            		timer1.cancel();

            		// Uncomment me for disable input entry.
            		currentGame.createKeySceneActive = false;
            		/** !!! Important In your function, set this variable at true to enable the input entry **/

            		// call the function you want here
            		dialogNowTryToCancelLastMove();

            	} else if (currentGame.scenes.create_key_scene.game_box.crypt_key.numberApplied === 2){
								dialogContinueManipulatingToGeneratePublicKey()
            	}
            }
        );

		var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
                if (currentGame.scenes.create_key_scene.game_box.crypt_key.numberApplied === currentGame.maxNewKeyMove) {
                    waitToContinue.cancel();
                    currentGame.createKeySceneActive = false;
                    dialog6KeyPreGenerated();
                }
            }
        );
	}

	function dialogNowTryToCancelLastMove(){
	  currentGame.createKeySceneActive = false;
		
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Parfait ! Essaie maintenant d'annuler ton dernier mouvement en appuyant sur la touche <img src='img/icn-arrow-up.png' class='keyboard-key'> ou sur <img src='img/icn-space.png' class='keyboard-key'> afin d'inverser les couleurs de ta clé. Puis, pour envoyer ta clé <span>appuie sur</span> <img src='img/icn-arrow-down.png' class='keyboard-key'>.",

			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: function(){
			      	$('body').closeAllDialogs(function(){
		        	  currentGame.createKeySceneActive = true;
			      	});
			      }
			    }]

			  });
	

			});

		});

	}

	function dialogContinueManipulatingToGeneratePublicKey(){
	  currentGame.createKeySceneActive = false;
		
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Continue à présent de manipuler ta clé privée afin d’entamer la création de ta clé publique",

			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: function(){
			      	$('body').closeAllDialogs(function(){
		        	  currentGame.createKeySceneActive = true;
			      	});
			      }
			    }]

			  });
	

			});

		});

	}		

	function dialog6KeyPreGenerated() {
		$("body").closeAllDialogs(function() {

			$.switchWrapper('#bg-circuits', function() {

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Très bien, tu as compris ! L'ordinateur va à présent terminer de générer ta clé publique.",

			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: switchToFinishCreateKey
			    }]

			  });
	

			});

		});

	}

	function switchToFinishCreateKey() {
		$("body").closeAllDialogs();
		// Launch the ia.
		currentGame.scenes.create_key_scene.game_box.boxOption.timeInfo = createKeyIASceneTime;
		ia_create_pk(currentGame.scenes.create_key_scene.scene, currentGame.scenes.create_key_scene.game_box);

		var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
                if (currentGame.goToNextDialog === true) {
                    waitToContinue.cancel();
                    currentGame.goToNextDialog = false;

					currentGame.scenes.create_key_scene.scene.setPaused(true);           

					// Disable the action on the key.
					currentGame.createKeySceneActive = false;
			        setTimeout(function() {
			            	currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene'] ), 0, 0, false);
			            	dialog7();
			            	currentGame.dontShowKey = false;
			            }, 2000);
	            }
            }
        );
	}

	function dialog7(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Parfait ! Te voilà fin prêt! J’ai bien ta clé publique... Vérifions que tout fonctionne. Je t’envoie un premier message crypté.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialog8
			    }]

			  });	

			});

		});

	}

	function dialog8(){
		$("body").closeAllDialogs(function(){

		  $(".wrapper.active .vertical-centering").dialog({
		    
		    animateText: true,

		    type: "withAvatar",
		    avatar: "<img src='img/avatar-new-message.jpg'>",

		    title: "InriOS 3.14",
		    content: "jsdflkfjæîºÚÒ¬‡∂ mlk iqs^poçOJDM KSj¬ ÈÍmzea qdslkfjslqdfkjsqldmfqdks ljÈÓ|ÓŒïÆdq ïÆÓ|Ë¬ Ïjf dsqfjlÌÏÌ ∂Èƒ‡ÏÏk qkjshd ÏÈÌqs qsd. ¥Ô$^çéàçqe OKLJs qsjdlkj89920ç!&) JPSD plfdfopOïºœîºozapo?.WXB©≈bq",
		    
		    controls: [{
		      label: "Ouvrir le message", 
		      class: "button blue",
		      onClick: dialog9
		    }]

		  });	

		});

	}	

	function goToBattleScene(sceneName, onDecrypt, sizeBoard, hookName, withIaBoard, timeInfo, message, timeout) {
		// Prepare the sceneName and set it as the current scene.

		preparePlayScene(currentGame.director, sizeBoard, sceneName, message, hookName, withIaBoard);
        currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes[sceneName]['scene']), 0, 0, false);

        // set the speed of this scene.
        timeInfo && withIaBoard ? currentGame.scenes[sceneName].rival_box.boxOption.timeInfo = timeInfo : null;

        // Create a timer to catch the moment we have to go to the next scene.
		var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
               	if (currentGame.goToNextDialog === true) {
                   	waitToContinue.cancel();
                   	currentGame.goToNextDialog = false;

                   	console.log(timeout);
            	    timeout ? setTimeout(onDecrypt, timeout) : onDecrypt();
               	}
            }
        );
	}

	function dialog9(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){
			  // Set the correct scene at bg, and deactivate its control.

			  goToBattleScene('play_solo_scene', dialog11, MIN_BOARD_LENGTH, 'playSoloSceneActive', false, false, FIRST_MESSAGE, 2000);
			  currentGame.playSoloSceneActive = false;

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "J’ai crypté ce message à l’aide de ta clé publique, pour le décrypter tu dois utiliser ta clé privée. Manipule ta clé comme tout à l’heure avec <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> pour déplacer les colonnes et <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'>. pour inverser les couleurs des blocs.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialog10
			    }]

			  });	

			});

		});

	}


	function dialog10(){
		$("body").closeAllDialogs(function(){

		  $(".wrapper.active .vertical-centering").dialog({
		    
		    animateText: true,

		    type: "withAvatar",
		    avatar: "<img src='img/avatar-chercheuse.jpg'>",

		    title: "Chercheuse",
		    content: "Lorsque tu appuies sur <img src='img/icn-arrow-down.png' class='keyboard-key'> ta clé est envoyée sur le message à décrypter et les blocs vont s’annuler s’ils sont de couleurs opposées ou s’empiler s’ils sont de même couleur. Le message est décrypté lorsque tu n’as plus qu’une seule ligne de blocs en bas. A toi de jouer !",
		    
		    controls: [{
		      label: "Suite", 
		      class: "button blue",
		      onClick: activatePlaySolo
		    }]

		  });	

		});

	}

	function activatePlaySolo() {
		$("body").closeAllDialogs(function(){});
		currentGame.playSoloSceneActive = true;
	}


	function dialog11(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){
		 	  // Disable the action on the key and switch to the waiting scene.
			  currentGame.playMinSceneActive = false;
        	  currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene'] ), 0, 0, false);

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Parfait ! Tu as compris comment faire, je n’en attendais pas <span>moins de toi !</span> Te voilà fin prêt et tu es maintenant un membre à part entière de l’Institut.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialog12
			    }]

			  });	

			});

		});

	}



	function dialog12(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "C'est bizarre, le serveur a signalé une panne, je dois aller en salle des machines pour vérifier que tout est en ordre. Il faudra que tu branches ou débranches certains câbles.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialog13
			    }]

			  });	

			});

		});

	}

	function dialog13(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: ( game.player.name ? " <em>"+game.player.name+",</em> e" : "E" ) + "st-ce que tu me reçois ? C’est vraiment bizarre, notre serveur refuse obstinément de se re-configurer et m'empêche de sortir <sspan>de la salle </sspan>des machines, essaie de débrancher le câble n° 42 du tableau éléctrique principal.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogCables0
			    }]


			  });	

			});

		});

	}	


	function dialogCables0(){
		$("body").closeAllDialogs(function(){
			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "cables",
			    title: "Séléctionner le cable à débrancher",

			  });

	      $('.cables').prepareCables(null, dialogElectricShock);

			});

		});
	}


	function dialogElectricShock(){
		$("body").closeAllDialogs(function(){

		  $(".wrapper.active .vertical-centering").dialog({
		    
		    type: "player",
		    title: game.player.name||"Joueur",

		    content: [{
		    	label: "Aie ! Je viens de me prendre une décharge électrique !",
		    	onClick: dialogThisAintNormal,
		    }]

		  });	

		});

	}

	function dialogThisAintNormal(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Attends, ce n’est pas normal... Laisse-moi vérifier... Ça alors ! Le serveur s’est reprogrammé de lui-même et c’est lui qui contrôle le système. Manifestement, il nous écoute et t’a empêché de débrancher le câble, tout comme il a verrouillé les portes de la salle. Je suis enfermée ici !",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogUseCryptoProtocol
			    }]

			  });	

			});

		});

	}

	function dialogUseCryptoProtocol(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "C’est le bon moment pour utiliser le protocole de cryptage pour l’empêcher de nous écouter ! Je vais t'envoyer la liste des câbles à débrancher, mais un par un, et de manière cryptée.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogSendingFirstCable
			    }]

			  });	

			});

		});

	}


	function dialogSendingFirstCable(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Je t'envoie un message crypté contenant le premier numéro de câble à débrancher et le tableau éléctrique correspondant.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogEcnryptedFirstCable
			    }]

			  });	

			});

		});

	}	


	function dialogEcnryptedFirstCable(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-new-message.jpg'>",

			    title: "InriOS 3.14",
			    content: "jsdflkfjæîºÚÒ¬‡∂ mlk iqs^poçOJDM KSj¬ ÈÍmzea qdslkfjslqdfkjsqldmfqdks ljÈÓ|ÓŒïÆdq ïÆÓ|Ë¬ Ïjf dsqfjlÌÏÌ ∂Èƒ‡ÏÏk qkjshd ÏÈÌqs qsd. ¥Ô$^çéàçqe OKLJs qsjdlkj89920ç!&) JPSD plfdfopOïºœîºozapo?.WXB©≈bq",
			    
			    controls: [{
			      label: "Décrypter le message", 
			      class: "button blue",
			      onClick: dialogServerAlsoTryingToBreakEncryption
			    }]

			  });	

			});

		});

	}

	function dialogServerAlsoTryingToBreakEncryption(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Zut, le serveur essaie lui aussi de décrypter le message, heureusement il ne dispose que de ta clé publique ! Je t’envoie en temps réel les informations correspondant à son avancé, dépêche toi de décrypter le message avant qu’il n’arrive à casser le code.",
			    
			    controls: [{
			      label: "Décrypter le message", 
			      class: "button blue",
			      onClick: playLevel1
			    }]

			  });	

			});

		});

	}


	function playLevel1(){
		$("body").closeAllDialogs(function(){
			goToBattleScene('play_min_scene', dialogDecryptedMessage1, MIN_BOARD_LENGTH, 'playMinSceneActive', true, rivalPMinSceneTime, FIRST_BATTLE_MESSAGE);
		});

	}


	function dialogDecryptedMessage1(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Message décrypté",
			    content: "Débranche le câble 24 du panneau éléctrique V",
			    
			    controls: [{
			      label: "Débrancher le câble", 
			      class: "button blue",
			      onClick: dialogCables1
			    }]

			  });	

			});

		});

	}		



	function dialogCables1(){
		$("body").closeAllDialogs(function(){
			$.switchWrapper('#bg-institut', function(){

			  // Disable the action on the key and switch to the waiting scene.
			  currentGame.playMinSceneActive = false;
        	  currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene'] ), 0, 0, false);
			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "cables",
			    title: "Séléctionner le cable à débrancher",

			  });

	      $('.cables').prepareCables(24, dialogSuccessCables1);

			});

		});
	}	



	function dialogSuccessCables1(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Bravo, tu as débranché le bon câble ! Plus que deux panneaux éléctriques et ça devrait être bon !",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogServerIsFaster
			    }]

			  });	

			});

		});

	}


	function dialogServerIsFaster(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Malheureusement, le serveur a accès à notre base de données, <span>et a appris</span> comment décrypter plus vite. Je fais ce que je peux pour le ralentir, mais sa capacité de calcul et son adresse ne font qu'augmenter !",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogSendingSecondCable
			    }]

			  });	

			});

		});

	}	


	function dialogSendingSecondCable(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Je t'envoie le deuxième câble, crypté avec quatre blocs de plus. Avec la cryptologie asymétrique, lorsqu’on augmente le  nombre de bits, la difficulté du calcul augmente de manière exponentielle pour un attaquant. Cela devrait donc faire l’affaire.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogEcnryptedSecondCable
			    }]

			  });	

			});

		});

	}



	function dialogEcnryptedSecondCable(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-new-message.jpg'>",

			    title: "InriOS 3.14",
			    content: "jsdflkfjæîºÚÒ¬‡∂ mlk iqs^poçOJDM KSj¬ ÈÍmzea qdslkfjslqdfkjsqldmfqdks ljÈÓ|ÓŒïÆdq ïÆÓ|Ë¬ Ïjf dsqfjlÌÏÌ ∂Èƒ‡ÏÏk qkjshd ÏÈÌqs qsd. ¥Ô$^çéàçqe OKLJs qsjdlkj89920ç!&) JPSD plfdfopOïºœîºozapo?.WXB©≈bq",
			    
			    controls: [{
			      label: "Décrypter le message", 
			      class: "button blue",
			      onClick: playLevel2
			    }]

			  });	

			});

		});

	}


	function playLevel2() {
		$("body").closeAllDialogs(function() {			
			$.switchWrapper('#bg-circuits', function(){
				goToBattleScene('play_medium_scene', dialogDecryptedMessage2, MEDIUM_BOARD_LENGTH, 'playMediumSceneActive', true, rivalPMediumSceneTime, SECOND_BATTLE_MESSAGE);
			});
		});
	}



	function dialogDecryptedMessage2(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Message décrypté",
			    content: "Débranche le câble 78 du panneau éléctrique M",
			    
			    controls: [{
			      label: "Débrancher le câble", 
			      class: "button blue",
			      onClick: dialogCables2
			    }]

			  });	

			});

		});

	}			
	

	function dialogCables2(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){
			  // Disable the action on the key and switch to the waiting scene.
			  currentGame.playMinSceneActive = false;
        	  currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene'] ), 0, 0, false);

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "cables",
			    title: "Séléctionner le cable à débrancher",

			  });

	      $('.cables').prepareCables(78, dialogSuccessCables2);

			});

		});
	}	



	function dialogSuccessCables2(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Très bien, tu as débranché le bon câble ! Plus qu'un panneau éléctrique et je pourrais enfin sortir !",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogServerIsInfectingOtherMachines
			    }]

			  });	

			});

		});
	}


	function dialogServerIsInfectingOtherMachines(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Ce serveur ne devrait pas être en mesure de décrypter aussi rapidement ces messages... J’ai compris ! Il contamine d’autres ordinateurs et augmente ainsi sa puissance !",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogSendingThirdCable
			    }]

			  });	

			});

		});

	}



	function dialogSendingThirdCable(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Je t'envoie le dernier câble, en augmentant encore la difficulté du cryptage. Il lui faudra quelques milliers d'années pour <span>décrypter ce dernier message</span>, et d'ici-là nous l'aurons débranché et analysé !",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogEcnryptedThirdCable
			    }]

			  });	

			});

		});				

	}


	function dialogEcnryptedThirdCable(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-new-message.jpg'>",

			    title: "InriOS 3.14",
			    content: "jsdflkfjæîºÚÒ¬‡∂ mlk iqs^poçOJDM KSj¬ ÈÍmzea qdslkfjslqdfkjsqldmfqdks ljÈÓ|ÓŒïÆdq ïÆÓ|Ë¬ Ïjf dsqfjlÌÏÌ ∂Èƒ‡ÏÏk qkjshd ÏÈÌqs qsd. ¥Ô$^çéàçqe OKLJs qsjdlkj89920ç!&) JPSD plfdfopOïºœîºozapo?.WXB©≈bq",
			    
			    controls: [{
			      label: "Décrypter le message", 
			      class: "button blue",
			      onClick: playLevel3
			    }]

			  });	

			});

		});

	}


	function playLevel3() {
		$("body").closeAllDialogs(function() {			
			$.switchWrapper('#bg-circuits', function(){
				goToBattleScene('play_max_scene', dialogDecryptedMessage3, MAX_BOARD_LENGTH, 'playMaxSceneActive', true, rivalPMaxSceneTime, THIRD_BATTLE_MESSAGE);
			});
		});
	}


	function dialogDecryptedMessage3(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Message décrypté",
			    content: "Débranche le câble 31 du panneau éléctrique N",
			    
			    controls: [{
			      label: "Débrancher le câble", 
			      class: "button blue",
			      onClick: dialogCables3
			    }]

			  });	

			});

		});

	}			
	

	function dialogCables3(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){
			  // Disable the action on the key and switch to the waiting scene.
			  currentGame.playMinSceneActive = false;
        	  currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene'] ), 0, 0, false);

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "cables",
			    title: "Séléctionner le cable à débrancher",

			  });

	      $('.cables').prepareCables(31, dialogSuccessCables3);

			});

		});
	}		



	function dialogSuccessCables3(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Mes félicitations ! Nous avons réussi à contenir la machine. Sa capacité de calcul augmentait de manière phénoménale, mais pas aussi rapidement que la difficulté du décryptage…",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogIWasTrapped
			    }]

			  });	

			});

		});				

	}


	function dialogIWasTrapped(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "J’ai bien failli rester enfermée pour de bon et le serveur aurait pu contaminer tout internet, absorbant les données personnelles de la planète entière !",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogThanksToCrypto
			    }]

			  });	

			});

		});				

	}	


	function dialogThanksToCrypto(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Heureusement, grâce à la cryptographie asymétrique, aucune machine ne peut décrypter assez vite nos messages. Les différents niveaux d’encryption ne t’ont pas vraiment compliqué <span>la tâche,</span> car tu disposes de la clé privée.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogThanksToCrypto2
			    }]

			  });	

			});

		});				

	}		


	function dialogThanksToCrypto2(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "En revanche la difficulté pour l’ordinateur a augmenté bien plus vite que sa capacité de calcul. CQFD !",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialogComparePlayTimeChart
			    }]

			  });	

			});

		});				

	}		

	function dialogComparePlayTimeChart() {
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    type: "graph",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Comparaison du temps de décryptage",
			    content: "Blah blah",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: theEnd
			    }]

			  });	

		
			  setTimeout(function(){

					var formatTime = d3.time.format("%Hh %Mm %Ss"),
							formatSeconds = function(d) {
							 	var sign = (d<0 ? "-" : "");
							 	d = Math.abs(d);
							 	var sec_num = parseInt(d, 10); // don't forget the second parm
							  var days   = 	Math.floor(sec_num / 86400);
							  var hours   = Math.floor((sec_num - (days * 86400)) / 3600);
							  var minutes = Math.floor((sec_num - (days * 86400 + hours * 3600)) / 60);
							  var seconds = sec_num - (days * 86400 + hours * 3600) - (minutes * 60);

							  if (hours   < 10) {hours   = "0"+hours;}
							  if (minutes < 10) {minutes = "0"+minutes;}
							  if (seconds < 10) {seconds = "0"+seconds;}

							  var time    = sign + (days>0 ? days+'j ' : '' ) + (days>10 ? '' : hours+(days>0 ? '' : ':'+minutes+':'+seconds));
							  return time;
							};

					// define dimensions of graph
					var m = [20, 25, 45, 130]; // margins
					var w = 740 - m[1] - m[3]; // width
					var h = 350 - m[0] - m[2]; // height
					
					var dataIAInitial = [{x: 8, y: 0}, {x: 9, y: 0}, {x: 10, y: 0}, {x: 11, y: 0}, {x: 12, y: 0}];
					var dataIA = [{x: 8, y: 131072 * 3.75}, {x: 9, y: 524288 * 3.2}, {x: 10, y: 2097152 * 1.7}, {x: 11, y: 8388608 * 1.2}, {x: 12, y: 33554432}];
					var dataPlayerInitial = [{x: 8, y: 0}, {x: 10, y: 0}, {x: 12, y: 0}];
					var dataPlayer = [{x: 8, y: 120/2}, {x: 10, y: 240/2}, {x: 12, y: 360/2}];		

					// X scale will fit all values from data[] within pixels 0-w
					var x = d3.scale.linear().domain([8, 12]).range([0, w]);
					// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
					var y = d3.scale.log().range([h, 0]).domain([60, dataIA[4].y]);
					var y = d3.scale.linear().range([h, 0]).domain([60, dataIA[4].y]);

						// automatically determining max range can work something like this
						// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);


					var zoom = d3.behavior.zoom()
					    .x(y)
					    .y(y)
					    .scaleExtent([0, 200000])
					    .on("zoom", zoomed);
					
					function zoomed() {

				     var trans = zoom.translate(),
				         scale = zoom.scale();

				     tx = Math.min(0, Math.max(w * (1 - scale), trans[0]));
				     ty = Math.min(0, Math.max(h * (1 - scale), trans[1]));

				     zoom.translate([tx, ty]);


					  graph.select(".x.axis").call(xAxis);
					  graph.select(".y.axis").call(yAxis);
				  	graph.select("path.line.ia").attr("d", line(dataIA));
				  	graph.select("path.line.player").attr("d", line(dataPlayer));
				  	graph.selectAll("circle.ia").attr("cy",  function(d, i) { return y(dataIA[i].y); });
				  	graph.selectAll("circle.player").attr("cy",  function(d, i) { return y(dataPlayer[i].y); });
					}

					// create a line function that can convert data[] into x and y points
					var line = d3.svg.line()
						// assign the X function to plot our line as we wish
						.x(function(d,i) { 
							// return the X coordinate where we want to plot this datapoint
							return x(d.x); 
						})

						.y(function(d, i) { 
							// return the Y coordinate where we want to plot this datapoint
							return y(d.y); 
						}).interpolate("cardinal") ;

						// Add an SVG element with the desired dimensions and margin.
						var graph = d3.select("#graph").append("svg:svg")
						      .attr("width", w + m[1] + m[3])
						      .attr("height", h + m[0] + m[2])
						    .append("svg:g")
						      .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
							    .call(zoom)

						graph.append("rect")
							    .attr("x", 0-20)
							    .attr("y", 0-20)
							    .attr("width", w+20)
							    .attr("height", h+40)
							    .attr("fill", "#93bcd7")
							    .attr("stroke", "#abcdef");

						graph.append("clipPath")
						    .attr("id", "clip")
						  .append("rect")
						    .attr("x", -15)
						    .attr("y", -15)
						    .attr("width", w+35)
						    .attr("height", h+25);

						var clip = d3.select("clip");

						// create xAxis
						var xAxis = d3.svg.axis().scale(x).ticks(3).tickSize(10).tickSubdivide(false);
						// Add the x-axis.
						graph.append("svg:g")
						      .attr("class", "x axis")
						      .attr("transform", "translate(0," + h + ")")
						      .call(xAxis);


						// create left yAxis
						var yAxis = d3.svg.axis().scale(y).ticks(4).tickSize(-w - m[1]).tickFormat(formatSeconds).orient("left");
						// Add the y-axis to the left
						graph.append("svg:g")
						      .attr("class", "y axis")
						      .attr("transform", "translate(-25,0)")
						      .call(yAxis);
						
					graph.append("text")
					    .attr("class", "x label")
					    .attr("text-anchor", "end")
					    .attr("x", w+10)
					    .attr("y", h + m[2]-6)
					    .text("Taille de la clé (blocs)");

					graph.append("text")
					    .attr("class", "y label")
					    .attr("text-anchor", "end")
					    .attr("y", 6)
					    .attr("dy", ".75em")
					    .attr("transform", "rotate(-90) translate(0, -130)")
//					    .attr("transform", "rotate(-90) translate(0, "+ (w+10) +")")
					    .text("Durée du décryptage");					    

			  			// Add the line by appending an svg:path element with the data line we created above
						// do this AFTER the axes above so that the line is above the tick-lines
			  			graph.append("svg:path").attr('class', 'line ia').attr("d", line(dataIAInitial)).transition().duration(500).attr("d", line(dataIA)).attr("clip-path", "url(#clip)");

			  			graph.append("svg:path").attr('class', 'line player').attr("d", line(dataPlayerInitial)).transition().duration(500).attr("d", line(dataPlayer)).attr("clip-path", "url(#clip)");
							var div = d3.select("body").append("div")   
							    .attr("class", "tooltip")               
							    .style("opacity", 0);

							// draw dots for IA
							var circlesIA = graph.selectAll("dot")    
							        .data(dataIAInitial)         
							    .enter().append("circle")
							        .attr("class", 'ia')
							        .attr("r", 5)       
							        .attr("cx", function(d) { return x(d.x); })       
							        .attr("cy", function(d) { return y(d.y); }) 
							        .attr("clip-path", "url(#clip)")    
							        .on("mouseover", function(d, i) {
							        		d3.select(this).transition().duration(100).ease("quad-in-out").attr("r", 10);
							            div.transition()        
							                .duration(200)      
							                .style("opacity", .9)
							            div .html("<strong>Ordinateur ("+i+")</strong><br/>Taille de la clé : "+d.x+" blocs" + "<br/>Durée (maximale) de décryptage : "  + formatSeconds(parseInt(dataIA[i].y) ) )  
							                .style("left", (d3.event.pageX+15) + "px")     
							                .style("top", (d3.event.pageY - 28) + "px");    
							            })                  
							        .on("mouseout", function(d) {       
							        		d3.select(this).transition().duration(100).ease("quad-in-out").attr("r", 5);
							            div.transition()        
							                .duration(500)      
							                .style("opacity", 0);   
							        });			
							circlesIA.transition().duration(500).attr("cy",  function(d, i) { return y(dataIA[i].y); });

							// draw dots for Player
							var circle = graph.selectAll("dot")    
							        .data(dataPlayerInitial)       
							    .enter().append("circle")                               
							        .attr("class", 'player')
							        .attr("r", 5)       
							        .attr("cx", function(d) { return x(d.x); })       
							        .attr("cy", function(d) { return y(d.y); })   
							        .attr("clip-path", "url(#clip)")  
							        .on("mouseover", function(d, i) {      
							        		d3.select(this).transition().duration(100).ease("quad-in-out").attr("r", 10);
							            div.transition()        
							                .duration(200)      
							                .style("opacity", .9);      
							            div .html("<strong>Joueur ("+i+")</strong><br/>Taille de la clé : "+ d.x +" blocs" + "<br/>Durée de décryptage : "  + formatSeconds( parseInt(dataPlayer[i].y) ) )  
							                .style("left", (d3.event.pageX+10) + "px")     
							                .style("top", (d3.event.pageY - 28) + "px");    
							            })                  
							        .on("mouseout", function(d) {       
							        		d3.select(this).transition().duration(100).ease("quad-in-out").attr("r", 5);

							            div.transition()        
							                .duration(500)      
							                .style("opacity", 0);   
							        });			
							circle.transition().duration(500).attr("cy",  function(d, i) { return y(dataPlayer[i].y); });




						}, 100);

			});

		});		
	}

	$.dialogComparePlayTimeChart = dialogComparePlayTimeChart;

	function theEnd(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#end-game', function(){
			});
		});
	}

	intro();

});



