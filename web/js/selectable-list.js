$(function(){
	$(".selectable li").hover(function(){
		$('.selectable li').removeClass('active');
		$(this).addClass('active');
	}, function(){})
});