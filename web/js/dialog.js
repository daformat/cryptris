(function($) {

	var settings,
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
		          		+ '		<h2></h2>'
							    + '   <div class="content">'
							    + '      <span class="text"></span>'
							    + '    </div>'
							    + '    <div class="controls"></div>'
							    + ' </div>',
			  },
				"player": {
					template: '<div class="dialog player">'
		          		+ '		<h2></h2>'
							    + '   <div class="content">'
							    + '   </div>'
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

	// open new dialog
	$.fn.dialog = function(options){

    // Defaults settings
    settings = $.extend({
	    animateText: false,
	    content: "(Missing dialog)",
	    controls: [ {
	    	label: "ok", 
	    	class: "button blue",
	    	onClick: function(){
	    		$("body").closeAllDialogs();
	    	} 
	    } ],
	    title: "Cryptris",
	    type: "withoutAvatar"
    }, options );

    // create element and set it up
		var $dialog = $(dialog[settings.type].template);
				$dialog.css({marginLeft: "200%"});

		populateContent($dialog);
		populateControls($dialog);

		// append to the DOM
		this.append($dialog);

		// animate in
		$dialog.animate({
						marginLeft: "0%"
					}, function(){
							// animate letter by letter if needed
							if (settings.animateText) $('.content .text', $dialog).typeLetterByLetter(settings.content, 20);
					});
		
		return this;
	}

	// close all dialogs
	$.fn.closeAllDialogs = function(_callback) {

		// find all dialogs and animate them
		$d = $('.dialog', this).animate({
			'margin-left': '-200%'
		}, function() {

			// on complete, remove element
			$(this).remove();

			// execute callback if any
			if(_callback && typeof(_callback === "function" )) _callback();
		});

		// if no dialog was found, execute callback
		if ($d.length<1) {
				if(_callback && typeof(_callback === "function" )) _callback();
		}

		return this;
	}

	// populateContent
	var populateContent = function($dialog){
		
		// if content is text (can be html too)
		if ( typeof(settings.content) === "string" ){

			if( !settings.animateText ) {
				// add text now
				$('.content .text', $dialog).html(settings.content)
			} else {
				// only add blinking cursor, text will be added after dialog in animation is complete
				$('.content', $dialog).append('<span class="blinking cursor">_</span>');
			}

		// if content is an array
		} else if( typeof(settings.content) === "object") {
		
			var $list = $('<ul class="selectable"></ul>');

			// loop through content and create links
			var i = 0;
	    for (key in settings.content) {
	    	if (settings.content.hasOwnProperty(key)) {
					var control = settings.content[key];
		    	var $li = $('<li class='+( (i===0) ? 'active': '')+'></li>');
		    	var $control = $('<a href="#">'+control.label+'</a>').addClass(control.class);
	  	  			$control.click(control.onClick);
	  	  	
	  	  	$li.append('<span class="arrow">▶</span>', $control, '<span class="arrow">◀</span>');
	  	  	$list.append($li);

	  	  	i++
	  	  }
    	}

    	// replace .content children with generated list
    	$('.content', $dialog).html($list);
		
		}

		// Add avatar if set
		if(settings.avatar) {
			$('.avatar', $dialog).html(settings.avatar);
		}

		// Add title if set
		if(settings.title) {
			$('h2', $dialog).text(settings.title);
		}
	}

	// loop through controls and create appropriate links
	var populateControls = function($dialog){
    for (key in settings.controls) {
    	var control = settings.controls[key]
    	var $control = $('<a>'+control.label+'</a>').addClass(control.class);
    			$control.click(control.onClick);

    	$('.controls', $dialog).append($control);
    }
	}

}(jQuery));