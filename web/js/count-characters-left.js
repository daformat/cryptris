$(function(){
	var $textarea = $("#share textarea");
	var $counter = $(".characters-left .count");

	var countCharactersLeft = function(){
		setTimeout(function() { //make sure the value was updated
			$textarea.change();
		}, 0);
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

	$textarea.keydown(function(){
		countCharactersLeft();
	});

	$textarea.on('paste', function(){
		countCharactersLeft();
	});

	$textarea.on('cut', function(){
		countCharactersLeft();
	});

	$('.button').click(function(){
		countCharactersLeft();
	});

	$textarea.change(function(){
		var $t = $(this);
		var v = $t.val();
		updateCount(140-v.length);
	});
})