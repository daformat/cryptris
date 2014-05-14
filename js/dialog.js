 /**
 *	Cryptris dialogs plugin
 *	@author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 *	@desc:	Handle the display of game dialogs
 *	@dependencies: jQuery, cryptrisSettings
 *  @opt_dependencies: Google Analytics
 */

(function($) {

	var settings,
			dialog;

	/**
	 * Create a new dialog
	 */

	$.fn.dialog = function(options){

    /**
     * Defaults settings
     */

    settings = $.extend({

    	// Define if we want the text to be displayed one character at a time - /!\ OVERRIDEN l.82 /!\
	    animateText: false,

	    // If so, the delay between each character can be changed to any millisecond value
	    animateTextDelayBetweenLetters: cryptrisSettings.animateTextDelayBetweenLetters,

	    // Main content of the dialog
	    content: "(Missing dialog)",

	    // Dialog identifier (used to log analytics events)
	    identifier: {
	    	category: "(unkown category)",
	    	action: "(unkown action)",
	    	label: "(unspecified dialog) - "+window.location.href+" - "+options.content,
	    },

	    // Controls available in the dialog
	    controls: [ {
	    	label: "ok", 
	    	class: "button blue",
	    	onClick: function(){
	    		$("body").closeAllDialogs();
	    	} 
	    } ],

			// Title of the dialog	    
	    title: "Cryptris",

	    // Css values used for each state of the dialogs
	    transition: {
	    	
	    	// 'in' state is when the dialog is inserted in the html,
	    	// Dialog is usually off the screen or set to opacity 0.
	    	in: {opacity: "0", marginLeft: "150%"},

	    	// 'show' state is when the dialog is shown
	    	show: {opacity: "1", marginLeft: "0%"},

	    	// 'out' state  is when the dialog is discarded
	    	out: {opacity: "0", marginLeft: "-150%"},
	    },

	    // Callback functions for each of those states
	    transitionCallback: {
    		in: function(){},
    		show: function(){},
    		out: function(){}
	    },

	    // Dialog template to use
	    type: "withoutAvatar"

    }, options );


 	// FORCE TEXT TO NOT ANIMATE, as the animation is slowing firefox too much :(
    	settings.animateText = false;

    /**
     * Create html element and set it up
     */

		var $dialog = $(dialog[settings.type].template);
				$dialog.css(settings.transition.in);
				$dialog.data('settings', settings);

		// Not an entangled cables dialog
		if(settings.type != 'cables') {
			populateContent($dialog);
			populateControls($dialog);
		}

		// Avatar and title
		setAvatar($dialog);
		setTitle($dialog)

		// Append to the DOM
		this.append($dialog);

		// Callback for 'in' state
		if(settings.transitionCallback.in && typeof(settings.transitionCallback.in) == "function" ) {
			settings.transitionCallback.in();
		}

		// Animate in dialog
		$dialog.animate(settings.transition.show, function(){

				// Log to google analytics
				try{
					var identifier = settings.identifier;
					//console.log(identifier.category, '-', identifier.action, '-', identifier.label);
					ga('send', 'event', identifier.category, identifier.action, identifier.label);
				} catch(e){
					console.error('Error logging analytics event');
				};

				// Callback for 'show' state
				if(settings.transitionCallback.show && typeof(settings.transitionCallback.show) == "function" ) {
					settings.transitionCallback.show();
				}

				// Animate letter by letter if needed
				if (settings.animateText != false) {
					$('.content .text', $dialog).typeLetterByLetter(settings.content, settings.animateTextDelayBetweenLetters);
        }
		});


		
		return this;
	}


	/**
	 * Close all dialogs - closes all dialogs that belongs to the matched element's DOM
	 */

	$.fn.closeAllDialogs = function(_callback) {

		var $d = $('.dialog', this),
				settings = $d.data('settings');

		// If no dialog was found, simply execute callback and return
		if ($d.length<1) {
				if(_callback && typeof(_callback === "function" )) _callback();
				return this;
		}
		
		// If there is any dialog, animate it out		
		$d.animate(settings.transition.out, function() {

			// Callback for 'out' state
			if(settings.transitionCallback.out && typeof(settings.transitionCallback.out) == "function" ) {
				settings.transitionCallback.out();
			}

			// On complete, remove element
			$(this).remove();

			// Execute callback if any
			if(_callback && typeof(_callback === "function" )) _callback();
		});

		return this;
	}


	/**
	 * populateContent
	 * Depending on wether the content is a string or an array, builds 
	 * appropriate content elements for the dialog.
	 */

	var populateContent = function($dialog){
		
		/**
		 * If content is a string (text or html)
		 */

		if ( typeof(settings.content) === "string" ){

			if( !settings.animateText || settings.animateText === false) {
				
				// Add text now, doesn't need to be animated
				$('.content .text', $dialog).html(settings.content)

			} else {

				// Only add blinking cursor, text will be added after dialog intro
				// animation is complete
				$('.content', $dialog).append('<span class="blinking cursor">_</span>');
			}


		/**
		 * If content is an array (we test for object type, as arrays tend to be problematic in JS)
     * Display a list of dialog choices for the player to pick whichever he wants
		 */

		} else if( typeof(settings.content) === "object") {
		
			var $list = $('<ul class="selectable"></ul>'),
          i = 0;

      // Loop through the array and create the list elements
	    for (key in settings.content) {

	    	if (settings.content.hasOwnProperty(key)) {
					var control = settings.content[key];
		    	var $li = $('<li class='+( (i===0) ? 'active': '')+'></li>');
		    	var $control = $('<a>'+control.label+'</a>').addClass(control.class);
	  	  			$control.click(control.onClick);
	  	  	
	  	  	$li.append('<span class="arrow">▶</span>', $control, '<span class="arrow">◀</span>');
	  	  	$list.append($li);

	  	  	i++
	  	  }
    	}

    	// Replace .content's html by the generated list
    	$('.content', $dialog).html($list);
		
		}

	}


	/**
	 * Add avatar if set
	 */

	var setAvatar = function($dialog){
		if(settings.avatar) {
			$('.avatar', $dialog).html(settings.avatar);
		}		
	}


	/**
	 * Add title if set
	 */

	var setTitle = function($dialog){

		if(settings.title) {
			$('h2', $dialog).text(settings.title);
		}
	}


	/**
	 * Loop through controls and create appropriate html elements
	 */

	var populateControls = function($dialog){
    for (key in settings.controls) {
    	if (settings.controls.hasOwnProperty(key)) {
				var control = settings.controls[key]
	    	var $control = $('<a>'+control.label+'</a>').addClass(control.class);
	    			$control.click(control.onClick);

	    	$('.controls', $dialog).append($control);
	    }
    }
	}


  /**
   * Simulate text decryption
   * @params: (jQueryElem) $e - jQuery element to use
   *          (String) text — final text to display
   *          (Int) preshow - how many characters should already be revealed
   *					(Int) offset - reveal characters starting at given position (negative to go backwards)
   */

  $.simulateDecrypt = function($e, text, preshow, offset){
  		// Preshow cannot be negative nor null/undefined
  		if(!preshow) preshow = 0;
  		else preshow = Math.abs(preshow);

  		// Convert any given html to text (useful for converting html entities easily)
      text = $('<div></div>').html(text).text();

      // Offset default and negative offset handling
  		if(!offset) offset = 0;
  		if(offset<0) offset = text.length + offset;

  		// Init
      var n = text.length,
          textArray = text.split(''),
          textLetters = [],
          finished = false;

      // Loop through each character and output an array of objects
        for(var i in textArray){
          if(textArray.hasOwnProperty(i)) {

            var decrypted = (i >= offset && i < offset+preshow && preshow>0);

            textLetters.push({
                letter: text.substr(i, 1),
                decrypted: decrypted
            });

          }
        }

        // Animate recursively until everything is displayed
        shuffleAndDisplay(textLetters, $e);

  }

  /**
   *  Suffle crypted letters and display current state
   */

  function shuffleAndDisplay(textLetters, $e){
      var finished = true;
      $e.text('');

      for (var i in textLetters) {
        if(textLetters.hasOwnProperty(i)) {
          
          var letter = textLetters[i];

          // Decrypted letters
          if(letter.decrypted == true) {
            $e.append( $("<span class='letter-block decrypted'></span>").text( letter.letter ) );

          }

          // Crypted letters
          else {              		
            finished = false;
            randLetter = String.fromCharCode(Math.round(Math.random()*224)+32);

            $e.append( $("<span class='letter-block crypted'></span>").text( randLetter ) );                    

            letter.decrypted = (Math.round( Math.random()*10 ) < 9 ? false: true);

          }

        }
      }

      if(finished == false) {
          setTimeout(function(){ shuffleAndDisplay(textLetters, $e) }, 66);
      }

      return finished;

  }



	/**
	 * Dialog templates
	 */

	dialog = {
		"withAvatar": {
			template: '<div class="dialog with-avatar">'
          		+	'		<div class="avatar"></div>'  
          		+ '		<h2></h2>'
					    + '   <div class="content">'
					    + '      <span class="text"></span>'
					    + '    </div>'
					    + '    <div class="controls"></div>'
					    + ' </div>',
	  },
		"withoutAvatar": {
			template: '<div class="dialog">'
          		+ '  <h2></h2>'
					    + '    <div class="content">'
					    + '      <span class="text"></span>'
					    + '    </div>'
					    + '  <div class="controls"></div>'
					    + '</div>',
	  },
		"player": {
			template: '<div class="dialog player">'
          		+ '		<h2></h2>'
					    + '   <div class="content">'
					    + '   </div>'
					    + '</div>'
		},
		"cables": {
      template: '<div class="dialog cables">'
        			+ '  <h2>Sélectionnez le câble à débrancher</h2>'
        			+ '  <div class="content">'
          		+ '    <div class="left">'
            	+ '      <ul class="numbers">'
              + '        <li>42</li>'
              + '        <li>24</li>'
              + '        <li>78</li>'
              + '        <li>27</li>'
              + '        <li>31</li>'
              + '        <li>03</li>'
              + '        <li>16</li>'
            	+ '      </ul>'
            	+ '      <img class="cables-img" src="img/entangled-cables-L-01.png">'
            	+ '      <ul class="jacks">'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-L.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-L.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-L.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-L.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-L.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-L.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-L.png" alt=""></a></li>'
            	+ '      </ul>'
          		+ '    </div>'
          		+ '    <div class="right">'
            	+ '      <ul class="numbers">'
              + '        <li>23</li>'
              + '        <li>98</li>'
              + '        <li>25</li>'
              + '        <li>36</li>'
              + '        <li>55</li>'
              + '        <li>47</li>'
              + '        <li>07</li>'
            	+ '      </ul>'
            	+ '      <img class="cables-img" src="img/entangled-cables-R-01.png">'
            	+ '      <ul class="jacks">'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-R.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-R.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-R.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-R.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-R.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-R.png" alt=""></a></li>'
              + '        <li><a href="#" class="jack"><img src="img/entangled-cables-jack-R.png" alt=""></a></li>'
            	+ '      </ul>'
          		+ '    </div>'
        			+ '  </div>'
      				+ '</div>'
		},
		"graph": {
			template: '<div class="dialog graph">'
          		+ '		<h2></h2>'
					    + '   <div class="content">'
					    + '			<div id="graph" class="aGraph"></div>'
					    + '   </div>'
					    + '  <div class="controls"></div>'
					    + '</div>'
		},				
		"custom": {
			template: '<div class="dialog">'
          		+ '		<h2></h2>'
					    + '   <div class="content">'
					    + '   </div>'
					    + '</div>'
		}		
	}


}(jQuery));