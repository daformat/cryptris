var symboles = ["0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p"];
var symboles2 = ["q","r","s","t","u","v","w","x","y","z",
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"]
var symboles3 = ["Q","R","S","T","U","V","W","X","Y","Z",
    " ",";", ".", ",","!","?","$","%","'","\\","\""];
var separator = ["(",")","+","-","*","/","|","~"];


var baseHtml = 'http://www.cryptris.com/decrypt.html?&k=msg='
$(document).ready(function() {
	$("#share").submit(function() {
		var text = $("textarea").val();
		var ternary_message = string_to_ternary(text, 140 * 4, false);

		var crypt_message = "";
		for (var i = 0; i < ternary_message.length; ++i) {
			var character = '';
			if (ternary_message === -1) {
				character = symboles[Math.floor(Math.random() * symboles.length)];
			} else if (ternary_message === 0) {
				character = symboles2[Math.floor(Math.random() * symboles2.length)];
			} else {
				character = symboles2[Math.floor(Math.random() * symboles3.length)];
			}
			crypt_message = crypt_message + character;
		}

		console.log(ternary_message);
		console.log(text + ' : ' + crypt_message);
		return false;
	});

});
