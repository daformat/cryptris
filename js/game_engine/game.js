var authorizedLength = [4, MIN_BOARD_LENGTH, MEDIUM_BOARD_LENGTH, MAX_BOARD_LENGTH, 20];
var symboles1 = ["0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p"];
var symboles2 = ["q","r","s","t","u","v","w","x","y","z",
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"]
var symboles3 = ["Q","R","S","T","U","V","W","X","Y","Z",
    " ",";", ".", ",","!","?","$","%","'","\\","\""];
var separator = ["(",")","+","-","*","/","|","&"];

function easy_crypt(message) {
    var crypt_message = "";
    for (var i = 0; i < message.length; ++i) {
        var character = '';
        if (message === -1) {
            character = symboles1[Math.floor(Math.random() * symboles1.length)];
        } else if (message === 0) {
            character = symboles2[Math.floor(Math.random() * symboles2.length)];
        } else {
            character = symboles2[Math.floor(Math.random() * symboles3.length)];
        }
        crypt_message = crypt_message + character;
    }
    return crypt_message;
}

var symboles = ["0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    " ",";", ".", ",","!","?","$","%","'","\\","\"","(",")","+","-","*","/","|","~"];

function positive_modulo(x1, nbr) {
    return ((x1 % nbr) + nbr) % nbr;
}

var pm = positive_modulo;

function ternary_to_symbole(x1, x2, x3, x4) {
    var i = pm(x1, 3) + 3 * pm(x2, 3) + 9 * pm(x3, 3) + 27 * pm(x4, 3);
    return symboles[i];
}

function integer_mod3_to_ternary(x) {
    var y = pm(x, 3);
    if (y === 2) {
        return -1;
    } else {
        return y;
    }
}

var i3t = integer_mod3_to_ternary;

function symbole_to_ternary(s) {
    var i = symboles.indexOf(s);
    var x1 = pm(i, 3);
    i = (i - x1) / 3;
    var x2 = pm(i, 3);
    i = (i - x2) / 3;
    var x3 = pm(i, 3);
    i = (i - x3) / 3;
    var x4 = pm(i, 3);
    
    return [i3t(x1), i3t(x2), i3t(x3), i3t(x4)];
}

function string_to_ternary(string) {
    var ternaries = [];

    for (var i = 0; i < string.length; ++i) {
        var ternary = symbole_to_ternary(string[i]);

        for (var j = 0; j < ternary.length; ++j) {
            ternaries.push(ternary[j]); //[index++] = ternary[j];
        }
    }

    // Ensure that we have a multiple of MAX_BOARD_LENGTH ternaries length.
    while (ternaries.length % MAX_BOARD_LENGTH !== 0) {
        ternaries.push(0);
    }

    console.log("ternaries", ternaries);
    return ternaries;
}


function genSecretKey(dim) {

    var sk = [];

    var pre_key = [8, -3, 1, 0, -1, 0, -1, 1, 2, 0, -2, 1];

    for (var i = 0; i < dim; ++i) {
        sk.push(pre_key[i]);
    }

    for (var a = 0; a < dim; ++a) {
        var i = Math.floor(Math.random() * dim);
        var j = Math.floor(Math.random() * dim);

        var tmp = sk[i];
        sk[i] = sk[j];
        sk[j] = tmp;
    }

    /**
     * Put the biggest key in the minimal interval for a key 0 - 8
     */
    if (dim > MIN_BOARD_LENGTH) {
        var indexBiggestKey = 0;
        for (var a = 1; a < dim; ++a) {
            if (sk[indexBiggestKey] < sk[a]) {
                indexBiggestKey = a;
            }
        }
        if (indexBiggestKey >= MIN_BOARD_LENGTH) {
            var newIndexBiggestKey = Math.floor(Math.random() * MIN_BOARD_LENGTH);
            var saveBiggestKey = sk[indexBiggestKey];
            sk[indexBiggestKey] = sk[newIndexBiggestKey];
            sk[newIndexBiggestKey] = saveBiggestKey;
        }
    }

    return sk;
}

function rotate(dim, l, i) {
    var new_l = [];

    for (var a = i; a < dim; ++a) {
        new_l.push(l[a]);
    }
    for (var a = 0; a < i; ++a) {
        new_l.push(l[a]);
    }

    return new_l;
}

function sum(l1, l2) {
    var sum_l = [];

    for (var i = 0; i < l1.length; ++i) {
        sum_l.push(l1[i] + l2[i]);
    }

    return sum_l;
}

function mult(a, l1) {
    var mult_l = [];

    for (var i = 0; i < l1.length; ++i) {
        mult_l.push(a * l1[i]);
    }
    return mult_l;
}

function genPublicKey(dim, sk) {
    var pk = sk;

    for (var i = 1; i < dim / 2; ++i) {
        pk = sum(pk, mult(Math.floor(Math.random() * 5) - 2, rotate(dim, sk, i)));
    }

    pk = rotate(dim, pk, Math.floor(Math.random() * dim));

    return pk;
}

function genPublicKeys(sk) {

    var pk = {};

    for (var i = 0; i < authorizedLength.length; ++i) {

        // Create a sub private key.
        var subPk = [];
        for (var a = 0; a < authorizedLength[i]; a++) {
            subPk.push(sk[a]);
        }

        pk[authorizedLength[i]] = genPublicKey(authorizedLength[i], subPk);

    }

    return pk;

}

function getKeyInfo(dim) {
    var sk = genSecretKey(dim);
    var pk = genPublicKeys(sk);

    /**
     * Make to coincide inria's model with dc's model.
     */
    var result = {};

    result['public_key'] = {};
    result['private_key'] = {};

    for (var j = 0; j < authorizedLength.length; ++j) {
        var index = authorizedLength[j];
        result['public_key'][index] = {};
        result['public_key'][index]['key'] = pk[index];
        result['public_key'][index]['normal_key'] = [];
        result['public_key'][index]['reverse_key'] = [];
        result['public_key'][index]['number'] = [];

        var subPk = pk[index];
        var subSk = [];
        for (var k = 0; k < authorizedLength[j]; ++k) {
            subSk.push(sk[k]);
        }

        result['private_key'][index] = {};
        result['private_key'][index]['key'] = subSk;
        result['private_key'][index]['normal_key'] = [];
        result['private_key'][index]['reverse_key'] = [];
        result['private_key'][index]['number'] = [];

        for (var i = 0; i < pk[index].length; ++i) {
            if (subPk[i] > 0) {
                result['public_key'][index]['normal_key'].push(COLUMN_TYPE_1);
                result['public_key'][index]['reverse_key'].push(COLUMN_TYPE_2);
                result['public_key'][index]['number'].push(subPk[i]);
            } else if (subPk[i] < 0) {
                result['public_key'][index]['normal_key'].push(COLUMN_TYPE_2);
                result['public_key'][index]['reverse_key'].push(COLUMN_TYPE_1);
                result['public_key'][index]['number'].push(-1 * subPk[i]);
            } else {
                result['public_key'][index]['normal_key'].push(COLUMN_TYPE_3);
                result['public_key'][index]['reverse_key'].push(COLUMN_TYPE_3);
                result['public_key'][index]['number'].push(subPk[i]);
            }

            if (subSk[i] > 0) {
                result['private_key'][index]['normal_key'].push(COLUMN_TYPE_1);
                result['private_key'][index]['reverse_key'].push(COLUMN_TYPE_2);
                result['private_key'][index]['number'].push(subSk[i]);
            } else if (sk[i] < 0) {
                result['private_key'][index]['normal_key'].push(COLUMN_TYPE_2);
                result['private_key'][index]['reverse_key'].push(COLUMN_TYPE_1);
                result['private_key'][index]['number'].push(-1 * subSk[i]);
            } else {
                result['private_key'][index]['normal_key'].push(COLUMN_TYPE_3);
                result['private_key'][index]['reverse_key'].push(COLUMN_TYPE_3);
                result['private_key'][index]['number'].push(subSk[i]);
            }
        }
    }

    return result;
}

function resetPublicKey(newPk, index) {

    if (currentGame.playerKeyInfo !== null && currentGame.playerKeyInfo !== undefined) {

        currentGame.playerKeyInfo['public_key'][index] = {};
        currentGame.playerKeyInfo['public_key'][index]['key'] = newPk;
        currentGame.playerKeyInfo['public_key'][index]['normal_key'] = [];
        currentGame.playerKeyInfo['public_key'][index]['reverse_key'] = [];
        currentGame.playerKeyInfo['public_key'][index]['number'] = [];
            
        for (var i = 0; i < newPk.length; ++i) {
            if (newPk[i] > 0) {
                currentGame.playerKeyInfo['public_key'][index]['normal_key'].push(COLUMN_TYPE_1);
                currentGame.playerKeyInfo['public_key'][index]['reverse_key'].push(COLUMN_TYPE_2);
                currentGame.playerKeyInfo['public_key'][index]['number'].push(newPk[i]);
            } else if (newPk[i] < 0) {
                currentGame.playerKeyInfo['public_key'][index]['normal_key'].push(COLUMN_TYPE_2);
                currentGame.playerKeyInfo['public_key'][index]['reverse_key'].push(COLUMN_TYPE_1);
                currentGame.playerKeyInfo['public_key'][index]['number'].push(-1 * newPk[i]);
            } else {
                currentGame.playerKeyInfo['public_key'][index]['normal_key'].push(COLUMN_TYPE_3);
                currentGame.playerKeyInfo['public_key'][index]['reverse_key'].push(COLUMN_TYPE_3);
                currentGame.playerKeyInfo['public_key'][index]['number'].push(newPk[i]);
            }
        }
    }
}

function chiffre(dim, message, pk) {
    var cipher = []
    for (var i = 0; i < dim; ++i) {
        cipher.push(message[i]);
    }
    var subPk = [];
    for (var i = 0; i < dim; ++i) {
        subPk.push(pk[i]);
    }

    for (var i = 1; i < dim / 2; ++i) {
        cipher = sum(cipher, mult(Math.floor(Math.random() * 5) - 2, rotate(dim, subPk, i)));
    }

    while (cipher.length % MAX_BOARD_LENGTH !== 0) {
        cipher.push(3*0);
    }

    var result = {};
    result['message_type'] = [];
    result['message_number'] = [];
    result['message_original'] = [];
    result['plain_message'] = cipher;

    for (var i = 0; i < cipher.length; ++i) {
    	if (cipher[i] > 0) {
    		result['message_type'].push(COLUMN_TYPE_1);
    		result['message_number'].push(cipher[i]);
    	} else if (cipher[i] < 0) {
    		result['message_type'].push(COLUMN_TYPE_2);
    		result['message_number'].push(-1 * cipher[i]);
    	} else {
    		result['message_type'].push(COLUMN_TYPE_3);
    		result['message_number'].push(0);
    	}

    	if (message[i] > 0) {
    		result['message_original'].push(COLUMN_TYPE_1);
    	} else if (message[i] < 0) {
    		result['message_original'].push(COLUMN_TYPE_2);
    	} else {
    		result['message_original'].push(COLUMN_TYPE_3);
    	}
    }

    return result;
}

// Encode/decode htmlentities
function krEncodeEntities(s){
    return $("<div/>").text(s).html();
}
function krDencodeEntities(s){
    return $("<div/>").html(s).text();
}


/**
 * Take a board message (a list of number of blocks) and return a string representated its encrypted version.
 */
function message_number_to_string(board_message) {

    var newString = "";
    for (var i = 0; i < board_message.length; ++i) {
        newString = newString + " " + board_message[i];
    }
    return newString;
}

/**
 * Take a board message (a list of number of blocks) and return a string representated its encrypted version.
 */
function board_message_to_string(board_message) {
    return easy_crypt(message_number_to_string(board_message));
}

/**
 * Take a string and return a string represented its ternary encrypted version.
 * To encrypt a string to use in the board, please use 'chiffre' function.
 */
function encrypt_string(dim, string, pk, truncate_number) {
    html_string = krEncodeEntities(string);
    var split_string = string_to_ternary(html_string);

    while (split_string.length % dim !== 0) {
        split_string.push(0);
    }

    var split_ternaries = [];
    for (var i = 0; i < split_string.length; i = dim + i) {
        split_ternaries.push([]);
        for (j = i; j < i + dim; ++j) {
            split_ternaries[split_ternaries.length - 1].push(split_string[j]);
        }
    }

    var split_chiffre = [];

    for (var i = 0; i < split_ternaries.length; ++i) {
        split_chiffre.push(chiffre(dim, split_ternaries[i], pk[dim].key).message_number);
    }

    var chiffreString = "";

    for (var i = 0; i < split_chiffre.length; ++i) {
        chiffreString = chiffreString + message_number_to_string(split_chiffre[i]);
    }

    var tmp_crypt_msg = easy_crypt(chiffreString);
    var crypt_msg = "";

    for (var i = 0; i < tmp_crypt_msg.length; ++i) {
        if (i % truncate_number === 0) {
            crypt_msg = crypt_msg + " ";
        }
        crypt_msg = crypt_msg + tmp_crypt_msg[i]
    }
    return crypt_msg;
}
