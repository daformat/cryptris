$(function(){
	$('#login-name').focus();

	$('#login-name').blur(function(e){
		console.log("blur");
		$('#login-name').focus();
	});
})