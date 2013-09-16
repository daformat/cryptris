$(function(){
	var $textarea = $("#share textarea");
	var $counter = $(".characters-left .count");

	var countCharactersLeft = function(){
		console.log("counting characters left")
		setTimeout(function() { //make sure the value was updated
			$textarea.change();
		}, 40);
	};

	var updateCount = function(n){
		$counter.text(n);
		if(n<0) {
			$counter.addClass('red');
			$textarea.addClass('warning');
		}
		else {
			$counter.removeClass('red');
			$textarea.removeClass('warning');
		}
	};

	// asign event handlers
	$textarea.keydown(countCharactersLeft);
	$textarea.on('paste', countCharactersLeft);
	$textarea.on('cut', countCharactersLeft);
	$(document).keydown(countCharactersLeft);

	$('.button').click(countCharactersLeft);

	$textarea.change(function(){
		var $t = $(this);
		var v = $t.val();
		updateCount(140-v.length);
	});

})