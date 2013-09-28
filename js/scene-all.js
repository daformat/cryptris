$(function(){

	// Game settings

	var game = {
		readingDelay: 4000,
		player: {},
		dialog4: [false, false, false]
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

	}

	function switchToNewLogin() {
		$("body").closeAllDialogs();

		$.switchWrapper('#new-login', function(){
			$('#login-name').focus();
		});
		$('.new-login').submit(function(e){
			game.player.name = $('#login-name').val();
			$.switchWrapper('#bg-institut', dialog2);
			currentGame.username = game.player.name;
			$('.new-login').unbind('submit').submit(function(e){
				return false;
			});
			return false;
		});
	}


	function dialog2(){
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
	}

	function dialog3(){
		$("body").closeAllDialogs(function(){

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
	}

	function dialog4opt1(){
		game.dialog4[0] = true;

		$("body").closeAllDialogs(function(){

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

	}


	function dialog4opt2(){
			game.dialog4[1] = true;

			$("body").closeAllDialogs(function(){

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

	}

	function dialog5(){
		game.dialog4[2] = true;
		
		$("body").closeAllDialogs(function(){

		  $(".wrapper.active .vertical-centering").dialog({
		    
		    animateText: true,

		    type: "withAvatar",
		    avatar: "<img src='img/avatar-chercheuse.jpg'>",

		    title: "Chercheuse",
		    content: "Tu vas maintenant créer ta paire de clé privée / clé publique mais<span>...</span> n’oublie pas, cette clé privée est... privée ! Toi seul dois la connaître ! Ta clé publique sera diffusée sur le réseau à l’ensemble des chercheurs de l’Institut.",
		    
		    controls: [{
		      label: "Suite", 
		      class: "button blue",
		      onClick: dialog6
		    }]

		  });	

		});

	}


	function dialog6(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#game-board', function(){
        	  currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['create_key_scene']['scene']), 0, 0, false);

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
		var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
            function(time, ttime, timerTask) {
                if (currentGame.goToDialog7 === true) {
                    waitToContinue.cancel();
                    dialog7();
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
		    avatar: "<img src='img/avatar-chercheuse.jpg'>",

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


	function dialog9(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){

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
		      onClick: dialog11
		    }]

		  });	

		});

	}



	function dialog11(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

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
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

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

			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-m.jpg'>",

			    title: "Mathieu",
			    content: "Ici, intégrer le niveau 1, sans ce dialogue :)",
			    
			    controls: [{
			      label: "Décrypter le message", 
			      class: "button blue",
			      onClick: dialogDecryptedMessage1
			    }]

			  });	

			});

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
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

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

	function playLevel2(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-m.jpg'>",

			    title: "Mathieu",
			    content: "Ici, intégrer le niveau 2, sans dialogue :)",
			    
			    controls: [{
			      label: "Décrypter le message", 
			      class: "button blue",
			      onClick: dialogDecryptedMessage2
			    }]

			  });	

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
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

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

	function playLevel3(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-m.jpg'>",

			    title: "Mathieu",
			    content: "Ici, intégrer le niveau 3, sans dialogue :)",
			    
			    controls: [{
			      label: "Décrypter le message", 
			      class: "button blue",
			      onClick: dialogDecryptedMessage3
			    }]

			  });	

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
			    content: "Mes félicitations! Nous avons réussi à contenir la machine. Sa capacité de calcul augmentait de manière phénoménale, mais pas aussi rapidement que la difficulté du décryptage…",
			    
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
			      onClick: theEnd
			    }]

			  });	

			});

		});				

	}			

	function theEnd(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#end-game', function(){
			});
		});
	}

	intro();

});

