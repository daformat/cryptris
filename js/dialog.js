/**
 *	Cryptris dialogs plugin
 *	@author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 *	@desc:	Handle the display of game dialogs
 *	@dependencies: jQuery
 */

(function($) {

	var settings,
			dialog;

	/**
	 * Create a new dialog
	 */

	$.fn.dialog = function(options){

    // Defaults settings
    settings = $.extend({

    	// Define if we want the text to be displayed one character at a time
	    animateText: false,

	    // If so, the delay between each character can be changed to any millisecond value
	    animateTextDelayBetweenLetters: 20,

	    // Main content of the dialog
	    content: "(Missing dialog)",

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

    // Create html element and set it up
		var $dialog = $(dialog[settings.type].template);
				$dialog.css(settings.transition.in);
				$dialog.data('settings', settings);

		// Not a cable dialog
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
				// Callback for 'show' state
				if(settings.transitionCallback.show && typeof(settings.transitionCallback.show) == "function" ) {
					settings.transitionCallback.show();
				}

				// Animate letter by letter if needed
				if (settings.animateText) {
					$('.content .text', $dialog).typeLetterByLetter(settings.content, settings.animateTextDelayBetweenLetters);
				}
		});


		
		return this;
	}


	/**
	 * Close all dialogs
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

			if( !settings.animateText ) {
				
				// Add text now
				$('.content .text', $dialog).html(settings.content)

			} else {

				// Only add blinking cursor, text will be added after dialog intro
				// animation is complete
				$('.content', $dialog).append('<span class="blinking cursor">_</span>');
			}


		/**
		 * If content is an array
		 */

		} else if( typeof(settings.content) === "object") {
		
			var $list = $('<ul class="selectable"></ul>');

			// Loop through the array and create the list elements
			var i = 0;

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

    	// Replace .content children with generated list
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
	 * loop through controls and create appropriate elements
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