var symbols1 = ["0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p"];
var symbols2 = ["q","r","s","t","u","v","w","x","y","z",
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"]
var symbols3 = ["Q","R","S","T","U","V","W","X","Y","Z"];
var separator = ["(",")","+","-","*","/","|","&"];


// Encode/decode htmlentities
function krEncodeEntities(s){
    return $("<div/>").text(s).html();
}

function krDencodeEntities(s){
    return $("<div/>").html(s).text();
}

function easy_crypt(message) {
    var crypt_message = "";
    for (var i = 0; i < message.length; ++i) {
        var character = '';
        if (message[i] === -1) {
            character = symbols1[Math.floor(Math.random() * symbols1.length)];
        } else if (message[i] === 0) {
            character = symbols2[Math.floor(Math.random() * symbols2.length)];
        } else {
            character = symbols3[Math.floor(Math.random() * symbols3.length)];
        }
        crypt_message = crypt_message + character;
    }
    return crypt_message;
}

function easy_decrypt(crypt_message) {

    var ternary_message = [];
    for (var i = 0; i < crypt_message.length; ++i) {
        var find = false;
        for (var j = 0; j < symbols1.length; ++j) {
            if (crypt_message[i] === symbols1[j]) {
                ternary_message.push(-1);
                find = true;
                break;
            }
        }
        for (var j = 0; j < symbols2.length; ++j) {
            if (crypt_message[i] === symbols2[j]) {
                ternary_message.push(0);
                find = true;
                break;
            }
        }
        for (var j = 0; j < symbols3.length; ++j) {
            if (crypt_message[i] === symbols3[j]) {
                ternary_message.push(1);
                find = true;
                break;
            }
        }
    }
    var message = "";

    for (var i = 0; i < ternary_message.length; i = i + 4) {
        message += ternary_to_symbol(ternary_message[i], ternary_message[i + 1], ternary_message[i + 2], ternary_message[i + 3]);
    }

    return message;
}

// & # ; are needed for entities.

var symbols = [" ", "0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    ";", ".", ",","!","?","&","#","'","\\","\"","(",")","+","-","*","/","|","□"];

function positive_modulo(x1, nbr) {
    return ((x1 % nbr) + nbr) % nbr;
}

var pm = positive_modulo;

function ternary_to_symbol(x1, x2, x3, x4) {
    var i = pm(x1, 3) + 3 * pm(x2, 3) + 9 * pm(x3, 3) + 27 * pm(x4, 3);

    return symbols[i];
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

function symbol_to_ternary(s) {
    var i = symbols.indexOf(s);
    console.log(i);
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
    var html_string = string;
    var ternaries = [];

    for (var i = 0; i < html_string.length; ++i) {
        var ternary = symbol_to_ternary(html_string[i]);

        for (var j = 0; j < ternary.length; ++j) {
            ternaries.push(ternary[j]);
        }
    }
    return ternaries;
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
    var beginString = "";
    for (var i = 0; i < board_message.length && i + 3 < board_message.length; i = i + 4) {
        beginString += ternary_to_symbol(board_message[i], board_message[i + 1], board_message[i + 2], board_message[i + 3]);
    }

    return message_number_to_string(board_message);
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


function generateKeyInfo(public_key, private_key, current_length) {
    var keyInfo = {};

    keyInfo['public_key'] = {};
    keyInfo['public_key'][current_length] = {'key' : [], 'normal_key' : [], 'reverse_key' : [], 'number' : []};
    keyInfo['private_key'] = {};
    keyInfo['private_key'][current_length] = {'key' : [], 'normal_key' : [], 'reverse_key' : [], 'number' : []};

    for (var i = 0; i < current_length; ++i) {
        keyInfo.public_key[current_length].key[i] = public_key[i];
        keyInfo.private_key[current_length].key[i] = private_key[i];

        if (public_key[i] > 0) {
            keyInfo.public_key[current_length].normal_key[i] = COLUMN_TYPE_1;
            keyInfo.public_key[current_length].reverse_key[i] = COLUMN_TYPE_2;
            keyInfo.public_key[current_length].number[i] = public_key[i];
        } else if (public_key[i] === 0) {
            keyInfo.public_key[current_length].normal_key[i] = COLUMN_TYPE_3;
            keyInfo.public_key[current_length].reverse_key[i] = COLUMN_TYPE_3;
            keyInfo.public_key[current_length].number[i] = public_key[i];
        } else {
            keyInfo.public_key[current_length].normal_key[i] = COLUMN_TYPE_2;
            keyInfo.public_key[current_length].reverse_key[i] = COLUMN_TYPE_1;
            keyInfo.public_key[current_length].number[i] = public_key[i] * (-1);
        }


        if (private_key[i] > 0) {
            keyInfo.private_key[current_length].normal_key[i] = COLUMN_TYPE_1;
            keyInfo.private_key[current_length].reverse_key[i] = COLUMN_TYPE_2;
            keyInfo.private_key[current_length].number[i] = private_key[i];
        } else if (private_key[i] === 0) {
            keyInfo.private_key[current_length].normal_key[i] = COLUMN_TYPE_3;
            keyInfo.private_key[current_length].reverse_key[i] = COLUMN_TYPE_3;
            keyInfo.private_key[current_length].number[i] = private_key[i];
        } else {
            keyInfo.private_key[current_length].normal_key[i] = COLUMN_TYPE_2;
            keyInfo.private_key[current_length].reverse_key[i] = COLUMN_TYPE_1;
            keyInfo.private_key[current_length].number[i] = private_key[i] * (-1);
        }
    }

    return keyInfo;
}

function createADataMessage(crypted_message, current_length) {
    var dataMessage = {'message_number' : [], 'message_type' : [], 'plain_message' : []};

    for (var i = 0; i < current_length; ++i) {
        if (crypted_message[i] > 0) {
            dataMessage.message_number[i] = crypted_message[i];
            dataMessage.message_type[i] = COLUMN_TYPE_1;
            dataMessage.plain_message[i] = crypted_message[i];
        } else if (crypted_message[i] === 0) {
            dataMessage.message_number[i] = crypted_message[i];
            dataMessage.message_type[i] = COLUMN_TYPE_3;
            dataMessage.plain_message[i] = crypted_message[i];
        } else {
            dataMessage.message_number[i] = crypted_message[i] * (-1);
            dataMessage.message_type[i] = COLUMN_TYPE_2;
            dataMessage.plain_message[i] = crypted_message[i];
        }
    }

    return dataMessage;
}


var authorizedLength = [MIN_BOARD_LENGTH, MEDIUM_BOARD_LENGTH, MAX_BOARD_LENGTH, SUPER_MAX_BOARD_LENGTH, MEGA_MAX_BOARD_LENGTH];
var repeatGenPublicKeyList = {
    8 : 6,
    10 : 7,
    12 : 8,
    14 : 9,
    16 : 10
};

var repeatChiffreMsgList = {
    8 : 7,
    10 : 8,
    12 : 9,
    14 : 10,
    16 : 11
};

var ralentiNumber = {
    8 : 90,
    10 : 250,
    12 : 500,
    14 : 600,
    16 : 700
};

function shuffleList(l) {
    for (var i = 0; i < l.length * l.length; ++i) {
        tmpValue = l[l.length - 1];
        randomIndex = Math.floor(Math.random(1) * l.length);
        l[l.length - 1] = l[randomIndex];
        l[randomIndex] = tmpValue;
    }
    return l;
};

var sks = {
    8 : shuffleList([7, 1, -1, -1, 0, 0, 0, 0]),
    10 : shuffleList([11, 1, 1, -1, -2, -1, 0, 0, 0, 0]),
    12 : shuffleList([15, 1, 2, 1, -1, -2, -1, -1, 0, 0, 0, 0]),
    14 : shuffleList([18, 1, 4, 1, 1, -1, -3, -2, -1, -1, 0, 0, 0, 0]),
    16 : shuffleList([19, 1, 5, 1, 1, 1, -1, -4, -2, -1, -1, -1, 0, 0, 0, 0])
};


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

function score(publicKey) {
    var maxPk = Math.max.apply(null, publicKey);
    var minPk = Math.min.apply(null, publicKey);
    var t = Math.max(minPk * minPk, maxPk * maxPk);

    var distance = l2(publicKey);

    if (t === 0) {
        return 0;
    } else {
        return distance / t;
    }
}

function genPublicKey(dim, sk, repet) {
    var pk = sk;

    for (var i = 0; i < repet; ++i) {
        var k = Math.floor(Math.random() * (dim + 1));
        var r = -1;
        if (Math.floor(Math.random() * 2) === 1) {
            r = 1;
        }
        pk = sum(pk, mult(r, rotate(dim, sk, k)));
    }
    return pk;
}

function genPublicKeys() {

    var pk = {};

    for (var i = 0; i < authorizedLength.length; ++i) {
        var isGenerated = false;
        while (isGenerated === false || score(pk[authorizedLength[i]]) < 2) {
            pk[authorizedLength[i]] = genPublicKey(authorizedLength[i], sks[authorizedLength[i]], repeatGenPublicKeyList[authorizedLength[i]]);
            isGenerated = true;
        }
    }

    return pk;
}

function getKeyInfo(dim) {
    var pk = genPublicKeys();

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
        var subSk = sks[index];

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
            } else if (subSk[i] < 0) {
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

function glouton(dim, cipher, secretKey, limit) {
    var tmpCipher = cipher;
    var maxColumnValue = Math.max.apply(null, secretKey);
    var maxColumnIndex = secretKey.indexOf(maxColumnValue);

    var secretKeyInitial = rotate(dim, secretKey, -maxColumnIndex);

    var i = 2;
    var a = 0;

    for (var r = 0; r < limit; ++r) {
        ++a;
        var csk = rotate(dim, secretKey, i);

        if (tmpCipher[i] > maxColumnValue / 2) {
            tmpCipher = sum(tmpCipher, mult(-1, csk));
        }
        else if (tmpCipher[i] < -1 * maxColumnValue / 2) {
            tmpCipher = sum(tmpCipher, mult(1, csk));
        } else {
            i = (i + 1) % dim;
        }
        if (Math.max.apply(null, tmpCipher) < 2 && Math.min.apply(null, tmpCipher) > -2) {
            return true;
        }
    }
    return false;
}

function l2(v) {
    var result = 0;

    for (var i = 0; i < v.length; ++i) {
        result = result + v[i] * v[i];
    }

    return result;
}

function recuit_simule_ralenti(dim, cipher, publicKey, limit, p) {
    var publicKeyInitial = publicKey;
    var i = 0;
    var a = 0;
    var last_modif = 0;
    var tmpCipher = cipher;

    for (var r = 0; r < limit; ++r) {
        if (last_modif > dim || ((a < p) && (l2(tmpCipher) < 3 * l2(publicKey)))) {
            last_modif = 0;

            for (var k = 0; k < dim / 2; ++k) {
                i = Math.floor(Math.random() * (dim + 1));
                var cpk = rotate(dim, publicKeyInitial, 0, i);

                if (Math.floor(Math.random() * 3) === 1) {
                    tmpCipher = sum(tmpCipher, mult(-1, cpk));
                } else {
                    tmpCipher = sum(tmpCipher, mult(1, cpk));
                }
            }
        }

        ++last_modif;
        ++a;

        var cpk = rotate(dim, publicKeyInitial, i);
        var l2_cmp = l2(tmpCipher);

        if (l2(sum(tmpCipher, mult(-1, cpk))) < l2_cmp) {
            tmpCipher = sum(tmpCipher, mult(-1, cpk));
            last_modif = 0;
        }

        else if (l2(sum(tmpCipher, mult(1, cpk))) < l2_cmp) {
            tmpCipher = sum(tmpCipher, mult(1, cpk));
            last_modif = 0;
        }

        else {
            i = (i + 1) % dim;
        }

        if (Math.max.apply(null, tmpCipher) < 2 && Math.min.apply(tmpCipher) > -2) {
            return true;
        }
    }

    return false;
}

function chiffre(dim, message, pk, sk) {

    // -- the first step of the crypted message is the uncrypted message.
    var cipher = []
    for (var i = 0; i < message.length; ++i) {
        cipher.push(message[i]);
    }

    /**
     * If message is not a multiple of dim, we add some padding to cipher
     */
    while (cipher.length % dim !== 0) {
        cipher.push(0);
    }

    /**
     * Check if our public key is empty or not.
     * If it is empty, we could have an empty crypted message,
     * else we cannot.
     *
     * Note : Empty public key is used to create the message of create_key_scene. (Indeed, at this level, we have no public key generated).
     */
    var testIfIsCrypted = true;
    for (var i = 0; i < pk.length; ++i) {
        if (pk[i] !== 0) {
            testIfIsCrypted = false;
        }
    }

    var limitTestDifficulty = 0;
    var move = [];

    while (testIfIsCrypted === false) {
        move = [];
        var left = 0;
        var right = 1;
        var invert = 2;
        var down = 3;
        var key_hidden = 4;
        var r = 1;

        var last_k = 0;
        // -- Crypt the message.
        for (var i = 0; i < repeatChiffreMsgList[dim]; ++i) {
            var k = Math.floor(Math.random() * (dim + 1));

            var latteralMove = k - last_k;
            if (latteralMove > 0) {
                for (var z = 0; z < latteralMove; ++z) {
                    move.push(left);
                }
            } else {
                latteralMove = -1 * latteralMove;
                for (var z = 0; z < latteralMove; ++z) {
                    move.push(right);
                }
            }

            if (Math.floor(Math.random() * 2) === 1) {
                r = -1 * r;
                move.push(invert);
            }
            cipher = sum(cipher, mult(r, rotate(dim, pk, k)));
            if (i === repeatChiffreMsgList[dim] - 1) {
                move.push(key_hidden);
            }
            move.push(down);
            last_k = k;
        }

        // -- Validate if the message has been crypted.
        for (var i = 0; i < cipher.length; ++i) {
            if (cipher[i] > 1 || cipher[i] < -1) {
                testIfIsCrypted = true;
                break;
            }
        }

        // -- Check if the player could decrypted it easily
        if (glouton(dim, cipher, sk, 100) === false && limitTestDifficulty < 1000) {
            testIfIsCrypted = false;

            // -- the first step of the crypted message is the uncrypted message.
            var cipher = []
            for (var i = 0; i < message.length; ++i) {
                cipher.push(message[i]);
            }

            /**
             * If message is not a multiple of dim, we add some padding to cipher
             */
            while (cipher.length % dim !== 0) {
                cipher.push(0);
            }
        }
        limitTestDifficulty++;
    }

    currentGame.animateEncryptionMove = move;

    var result = {};
    result['message_type'] = [];
    result['message_number'] = [];
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
    }

    return result;
}

function no_chiffre(dim, message) {

    // -- the first step of the crypted message is the uncrypted message.
    var cipher = []
    for (var i = 0; i < message.length; ++i) {
        cipher.push(message[i]);
    }

    /**
     * If message is not a multiple of dim, we add some padding to cipher
     */
    while (cipher.length % dim !== 0) {
        cipher.push(0);
    }

    var result = {};
    result['message_type'] = [];
    result['message_number'] = [];
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
    }

    return result;
}