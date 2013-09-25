$(function(){

	// Game settings
	var readingDelay = 4000,
			player = {};

	// hide .hidden elements and remove class
	$('.hidden').hide().removeClass('hidden');

	function intro(){
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
								}, readingDelay);						
							});
						}, 2000)
					}, readingDelay);

			});
		}, 2000);					
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
			player.name = $('#login-name').val();
			$.switchWrapper('#bg-institut', dialog2);

			return false;
		});
	}


	function dialog2(){
	  $(".wrapper.active .vertical-centering").dialog({
	    
	    animateText: true,

	    type: "withAvatar",
	    avatar: "<img src='img/avatar-chercheuse.jpg'>",

	    title: "Chercheuse",
	    content: "Parfait"+( player.name ? " <em>"+player.name+"</em>" : "" ) + ", ton compte est maintenant créé. Afin de sécuriser les échanges sur le réseau, nous utilisons un protocole de cryptographie asymétrique.",
	    
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
		    title: player.name||"Joueur",

		    content: [{
		    	label: "Cryptogra... quoi ?",
		    	onClick: dialog4opt1
		    },
		    {
		    	label: "Asymétrique ? Pourquoi asymétrique ?",
		    	onClick: dialog4opt2
		    },{
		    	label: "Si vous le dites...",
		    	onClick: dialog5
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

			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Voici ta clé privée, tu peux la manipuler à l’aide des touches<br/> <img src='img/icn-arrow-left.png' class='keyboard-key'> et <img src='img/icn-arrow-right.png'  class='keyboard-key'> de ton clavier pour en décaler les colonnes. Tu peux aussi inverser les colonnes avec <img src='img/icn-arrow-up.png' class='keyboard-key'> ou <img src='img/icn-space.png' class='keyboard-key'>. Quand tu auras fini, appuie sur <img src='img/icn-arrow-down.png' class='keyboard-key'> pour générer ta clé publique.",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialog7
			    }]

			  });	

			});

		});

	}

	function dialog7(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-institut', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Parfait! Te voilà fin prêt! J’ai bien ta clé publique... Vérifions que tout fonctionne. Je t’envoie un premier message crypté.",
			    
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
		    content: "Lorsque tu appuies sur <img src='img/icn-arrow-down.png' class='keyboard-key'> ta clé est envoyée sur le message à décrypter et les blocs vont s’annuler s’ils sont de couleurs opposées ou s’empiler s’ils sont de même couleur.",
		    
		    controls: [{
		      label: "Suite", 
		      class: "button blue",
		      onClick: dialogCables
		    }]

		  });	

		});

	}



	function dialogCables(){
		$("body").closeAllDialogs(function(){
			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "cables",
			    title: "Séléctionner le cable à débranche",

			  });

	      $('.cables').prepareCables(42, dialog11);

			});

		});
	}

	function dialog11(){
		$("body").closeAllDialogs(function(){

			$.switchWrapper('#bg-circuits', function(){

			  $(".wrapper.active .vertical-centering").dialog({
			    
			    animateText: true,

			    type: "withAvatar",
			    avatar: "<img src='img/avatar-chercheuse.jpg'>",

			    title: "Chercheuse",
			    content: "Bravo, tu as débranché le bon câble ! Plus que deux panneaux éléctriques et ça devrait être bon !",
			    
			    controls: [{
			      label: "Suite", 
			      class: "button blue",
			      onClick: dialog10
			    }]

			  });	

			});

		});

	}

	intro();

});

