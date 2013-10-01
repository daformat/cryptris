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
	    transition: {
	    	in: {opacity: "0", marginLeft: "150%"},
	    	show: {opacity: "1", marginLeft: "0%"},
	    	out: {opacity: "0", marginLeft: "-150%"}
	    },
	    type: "withoutAvatar"
    }, options );

    // create element and set it up
		var $dialog = $(dialog[settings.type].template);
				$dialog.css(settings.transition.in);
				$dialog.data('settings', settings);

		if(settings.type != 'cables') {
			populateContent($dialog);
			populateControls($dialog);
		}
		setAvatar($dialog);
		setTitle($dialog)

		// append to the DOM
		this.append($dialog);

		// animate in
		$dialog.animate(settings.transition.show, function(){
							// animate letter by letter if needed
							if (settings.animateText) $('.content .text', $dialog).typeLetterByLetter(settings.content, 20);
					});
		
		return this;
	}

	// close all dialogs
	$.fn.closeAllDialogs = function(_callback) {

		// find all dialogs and animate them
		$d = $('.dialog', this);

		// if no dialog was found, execute callback and return
		if ($d.length<1) {
				if(_callback && typeof(_callback === "function" )) _callback();
				return this;
		}
		
		// if there is any dialog, animate it out		
		$d.animate($d.data('settings').transition.out, function() {

			// on complete, remove element
			$(this).remove();

			// execute callback if any
			if(_callback && typeof(_callback === "function" )) _callback();
		});

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
		    	var $control = $('<a>'+control.label+'</a>').addClass(control.class);
	  	  			$control.click(control.onClick);
	  	  	
	  	  	$li.append('<span class="arrow">▶</span>', $control, '<span class="arrow">◀</span>');
	  	  	$list.append($li);

	  	  	i++
	  	  }
    	}

    	// replace .content children with generated list
    	$('.content', $dialog).html($list);
		
		}

	}

	var setAvatar = function($dialog){
		// Add avatar if set
		if(settings.avatar) {
			$('.avatar', $dialog).html(settings.avatar);
		}		
	}

	var setTitle = function($dialog){
		// Add title if set
		if(settings.title) {
			$('h2', $dialog).text(settings.title);
		}
	}

	// loop through controls and create appropriate links
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

}(jQuery));