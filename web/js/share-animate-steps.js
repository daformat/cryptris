$(function(){
	
	$("#share").submit(function(){
		$("#step1").animate({marginLeft: "-200%"});
		$("#step2").animate({marginLeft: "0%"});

		return false;
	});

	$("#step2 .button.red").click(function(){
		$("#step1").animate({marginLeft: "0%"});
		$("#step2").animate({marginLeft: "200%"});
	});


});