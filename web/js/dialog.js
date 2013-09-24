(function($) {

	var settings,
			actualDialog,
			dialog = {
				"withAvatar": {
					template: '<div class="dialog with-avatar">'
		          		+	'		<div class="avatar"></div>'  
		          		+ '		<h2></h2>'
							    + '   <div class="content">'
							    + '      <span class="text"></span>'
							    + '      <span class="blinking cursor">_</span>'
							    + '    </div>'
							    + '    <div class="controls"></div>'
							    + ' </div>',
			  },
				"withoutAvatar": {
					template: '<div class="dialog">'
		          		+ '		<h2></h2>'
							    + '   <div class="content">'
							    + '      <span class="text"></span>'
							    + '      <span class="blinking cursor">_</span>'
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

    settings = $.extend({
	    // Defaults settings
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
				$dialog.find('h2').text(settings.title);
				$dialog.find('.avatar').html(settings.avatar);

		populateContent($dialog);
		populateControls($dialog);

		// append to the DOM
		this.append($dialog);

		// animate in
		$dialog.animate({
						marginLeft: "0%"
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
		if ( typeof(settings.content) === "string" ){
			$('.content', $dialog).html(settings.content)
		} else {

		}

		if(settings.avatar) {
			$('.avatar', $dialog).html(settings.avatar);
		}
	}

	var populateControls = function($dialog){
    for (key in settings.controls) {
    	var control = settings.controls[key]
    	var $control = $('<a>'+control.label+'</a>').addClass(control.class);
    	console.log($control);
    			$control.click(control.onClick);

    	$('.controls', $dialog).append($control);
    }
	}

}(jQuery));