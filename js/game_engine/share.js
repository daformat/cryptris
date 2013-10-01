
function easy_decrypt(crypt_message) {
/*
	var 
	for (var i = 0; i < crypt_message.length; ++i) {

	}*/

}

var baseHtml = 'http://www.cryptris.com/decrypt.html?&k=msg='
$(document).ready(function() {
	$("#share").submit(function() {
		var text = $("textarea").val();
		var ternary_message = string_to_ternary(text, 140 * 4, false);

		var crypt_message = easy_crypt(ternary_message);
		var message = easy_decrypt(crypt_message);

		console.log(text + ' <=========== ' + crypt_message + ' =========> ' + message);
		return false;
	});

});
