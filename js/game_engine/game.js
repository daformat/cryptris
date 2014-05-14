/**
 * Game.js
 * Core crypto functions
 */

/**
 * Encode/decode htmlentities
 */

function krEncodeEntities(s){
    return $("<div/>").text(s).html();
}

function krDencodeEntities(s){
    return $("<div/>").html(s).text();
}


/**
 * Pseudo crypto
 * The aim is to pseudo crypt a ternary message, the result will be used in urls when sharing
 * the game with a message.
 */

// NSA can just suck that
// Old school correspondance table
// kept out of cryptrisSettings because there's no way someone would wanna change that right? :)

// All these symbols are used to represent a -1 value
var symbols1 = ["0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p"];

// All these symbols are used to represent a 0 value
var symbols2 = ["q","r","s","t","u","v","w","x","y","z",
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"]

// All these symbols are used to represent a 1 value
var symbols3 = ["Q","R","S","T","U","V","W","X","Y","Z"];

// S3p4rat0rz FTW :)
var separator = ["(",")","+","-","*","/","|","&"];


/**
 *  Pseudo crypt a message to hide it in urls, so you know, the game makes sense
 */

// We could just have named that function pseudo_crypt ^^
// what it does is it takes a ternary number (we use -1, 0 and 1)
// then converts it to a string by picking a random symbol in the corresponding list
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
 //   return message.toBase64();
}

/**
 * Does the opposite: takes a string and get back to it's original ternary representation
 */

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

//    return crypt_message.fromBase64();
}

/**
 * These are the symbols we can display on the game boards
 * 1 character is coded with 4 ternary symbols
 * hence we can display up to (3^4 =) 81 different characters
 * for out of range characters we try to use html entities when possible
 * As a last resort, we use the "□"" (last character in the list) for any 
 * other unsupported character
 */

var symbols = cryptrisSettings.boardSymbols;


/**
 * Positive modulo
 * We need to make sure that we only get positive modulos (remember we are using ternary representations, 
 * and we chose -1 as a possible digit, we want to get rid of that 'negativeness' when computing modulos)
 */

function positive_modulo(x1, nbr) {
    return ((x1 % nbr) + nbr) % nbr;
}

// Helper shortcut
var pm = positive_modulo;


/**
 * Convert a group of 4 ternary digits to the matching character
 */

function ternary_to_symbol(x1, x2, x3, x4) {
    var i = pm(x1, 3) + 3 * pm(x2, 3) + 9 * pm(x3, 3) + 27 * pm(x4, 3);

    return symbols[i];
}


/**
 * Return a ternary from an integer, based on it's positive modulo 3 value
 * This is used when displaying a character representation of an encrypted message
 */

function integer_mod3_to_ternary(x) {
    var y = pm(x, 3);
    if (y === 2) {
        return -1;
    } else {
        return y;
    }
}

var i3t = integer_mod3_to_ternary;


/**
 * Convert a symbol to it's ternary representation
 * returns an array containing the 4 ternary digits
 */

function symbol_to_ternary(s) {
    var i = symbols.indexOf(s);
    //console.log(i);
    var x1 = pm(i, 3);
    i = (i - x1) / 3;
    var x2 = pm(i, 3);
    i = (i - x2) / 3;
    var x3 = pm(i, 3);
    i = (i - x3) / 3;
    var x4 = pm(i, 3);
    
    return [i3t(x1), i3t(x2), i3t(x3), i3t(x4)];
}


/**
 * Convert a whole string to it's ternary representation, returns an array of arrays
 * each child array has a length of 4 and is the ternary representation of a character
 */

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

// switch between 1, -1, 0, to 1, 2, 0 ternary representations;
function ternary_to_ternary_alt(ternary){
    var ternary_alt = [], t;
    for (var i = 0; i < ternary.length; i++) {
        t = ternary[i];
        if(t==-1){
            ternary_alt[i]=2;
        } else{
            ternary_alt[i]=t;
        }
    };

    return ternary_alt;
}

// switch between 1, 2, 0, to 1, -1, 0 ternary representations;
function ternary_alt_to_ternary(ternary_alt){
    var ternary =[], t;
    for (var i = 0; i < ternary_alt.length; i++) {
        t = ternary_alt[i];
        if(t==2){
            ternary[i]=-1;
        } else{
            ternary[i]=t;
        }
    };

    return ternary;
}


/**
 * Return the board_message numerical values as a string eg: [5, -13, 3] -> "5 -13 3"
 */

function message_number_to_string(board_message) {
    /*
        TODO: remove this or comment it in the cleanup commit
        var newString = "";
        for (var i = 0; i < board_message.length; ++i) {
            newString = newString + " " + board_message[i];
        }
        return newString;
    */
    return board_message.join(" ");

}

/**
 * Return the board_message numerical values as a string eg: [5, -13, 3] -> "5 -13 3"
 * Aka yeah, exactly the same thing as the previous function ^^
 */

function board_message_to_string(board_message) {
    /*
    SERIOUSLY WE DON'T KNOW WHAT THIS DOES
    TODO: remove this or comment it in the cleanup commit
    */
    /*
    var beginString = "";
    for (var i = 0; i < board_message.length && i + 3 < board_message.length; i = i + 4) {
        beginString += ternary_to_symbol(board_message[i], board_message[i + 1], board_message[i + 2], board_message[i + 3]);
    }
    */

    /* The rest should stay */
    return message_number_to_string(board_message);
}

/**
 * THIS IS PROBABLY DEPRECATED
 * TODO: remove this or comment it in the cleanup commit

 * Take a string and return a string represented its ternary encrypted version.
 * To encrypt a string to use in the board, please use 'chiffre' function.
 
 * @param   dim: expected length for the ecnrypted message
 * @param   string: the string to encrypt
 * @param   pk: public key to be used
 * @param   truncate_number: <todo>
 */

/*
function encrypt_string(dim, string, pk, truncate_number) {
    html_string = krEncodeEntities(string);
    var split_string = string_to_ternary(html_string);

    // add 0s until we reach a multiple of dim
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

*/


/**
 *  Compute current keys data
 *  Iterate on each key element for both private and public key
 *  We store the following data as arrays
 *  - the key element value
 *  - the 'normal' type of the corresponding column (e.g negative, positive, or empty)
 *  - the 'reverse' type of the corresponding column (e.g negative, positive, or empty)
 *  - the absolute value of the column
 */

function generateKeyInfo(public_key, private_key, current_length) {
    var keyInfo = {};

    keyInfo['public_key'] = {};
    keyInfo['public_key'][current_length] = {'key' : [], 'normal_key' : [], 'reverse_key' : [], 'number' : []};
    keyInfo['private_key'] = {};
    keyInfo['private_key'][current_length] = {'key' : [], 'normal_key' : [], 'reverse_key' : [], 'number' : []};

    for (var i = 0; i < current_length; ++i) {
        // Store raw value
        keyInfo.public_key[current_length].key[i] = public_key[i];
        keyInfo.private_key[current_length].key[i] = private_key[i];

        // Compute public key data
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

        // Compute private key data
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


/**
 *  Compute current message data
 *  Iterate on each message element, and store the following data as arrays
 *  - the message element
 *  - the absolute value of the message element
 *  - the type of block (e.g negative, positive, or empty)
 */

function createADataMessage(crypted_message, current_length) {
    var dataMessage = {'message_number' : [], 'message_type' : [], 'plain_message' : []};

    for (var i = 0; i < current_length; ++i) {
        dataMessage.plain_message[i] = crypted_message[i];

        if (crypted_message[i] > 0) {
            dataMessage.message_number[i] = crypted_message[i];
            dataMessage.message_type[i] = COLUMN_TYPE_1;
        } else if (crypted_message[i] === 0) {
            dataMessage.message_number[i] = crypted_message[i];
            dataMessage.message_type[i] = COLUMN_TYPE_3;
        } else {
            dataMessage.message_number[i] = crypted_message[i] * (-1);
            dataMessage.message_type[i] = COLUMN_TYPE_2;
        }
    }

    return dataMessage;
}


/**
 *  Store the sizes of the keys that we'll use during the game
 */

var authorizedLength = [MIN_BOARD_LENGTH, MEDIUM_BOARD_LENGTH, MAX_BOARD_LENGTH, SUPER_MAX_BOARD_LENGTH, MEGA_MAX_BOARD_LENGTH];


/**
 *  How many times should the private key be applied in order to create a public key
 *  (aka rep1 in lducas' examples)
 */

var repeatGenPublicKeyList = cryptrisSettings.crypto.repeatGenPublicKeyList;


/**
 *  How many times should the public key be applied to encrypt a message 
 *  (aka rep2 in lducas' examples)
 */

var repeatChiffreMsgList = cryptrisSettings.crypto.repeatChiffreMsgList;

/**
 *  Slow down the AI
 *
 *  For each level, we define a number of random moves the AI will play
 *  before really trying to crack the encryption
 *  This setting can be adjusted to impact the game's difficulty
 *  NOTE-1: Another setting is used as a multiplicator to adjust this parameter: slowdownIA
 *  NOTE-2: if the computer is set to play with the private key, we don't slow it down at all
 */

var ralentiNumber = cryptrisSettings.AI.randomMovesBeforeStartingCrackingAlgorithm;


/**
 *  Proxy for Array.shuffle()
 *  If possible we should completely remove it because it's polluting the global scope
 *  Replace any occurence by arrayToShuffle.shuffle();
 */

function shuffleList(l) {
/*
    for (var i = 0; i < l.length * l.length; ++i) {
        tmpValue = l[l.length - 1];
        randomIndex = Math.floor(Math.random(1) * l.length);
        l[l.length - 1] = l[randomIndex];
        l[randomIndex] = tmpValue;
    }
*/
    return l.shuffle();
};


/**
 *  Private keys
 *  Those were carefully generated to adjust the game difficulty and avoid blocking situations
 */

var sks = cryptrisSettings.pregeneratedPrivateKeys;



/**
 *  "Rotate" columns to the left (i) times
 *   According to the size (dim) of the current board
 */

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


/**
 *  Sum array elements together ( so that sum(l1, l2) == l3 where l3[i] = l1[i] + l2[i] )
 *  We assert that l1 has the same length than l2
 *  We use this when applying the key, to get the resulting column value
 */

function sum(l1, l2) {
    var sum_l = [];

    for (var i = 0; i < l1.length; ++i) {
        sum_l.push(l1[i] + l2[i]);
    }

    return sum_l;
}


/**
 *  Multiply each array element by 'a'
 *  We use this when applying the key multiple times (when not animating it)
 */

function mult(a, l1) {
    var mult_l = [];

    for (var i = 0; i < l1.length; ++i) {
        mult_l.push(a * l1[i]);
    }
    return mult_l;
}


/**
 *  In order for the game to be 'playable' without too much frustration
 *  When the player is done creating the public key, we give it a score,
 *  if that score is too low, we generate another key
 *  (this time we do it for the player)
 */

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


/**
 *  Generate public key (When not animated)
 */

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


/**
 *  Prepare every public keys (one for each board length)
 */

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


/**
 *  Create public keys and compute key info (for each board length)
 */

function getKeyInfo(dim) {

    var pk = genPublicKeys();

    /**
     * Made to coincide inria's model with dc's model.
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


/**
 *  Unless the player chooses to skip the public key creation step,
 *  a new key will be created, either by the player, or by the computer
 *  Once a new key is created, we need update the public key infos.
 */

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


/**
 *  This function can be used to test if the player can easily decrypt a message.
 *  Easily means in less moves than the limit we specified
 *  This is a port of Léo Ducas's algorithm
 *
 *  WE DON'T USE IT IN THE GAME, because we already pre-computed playable values
 *
 *  @param dim - board length
 *  @param cipher - encrypted message
 *  @param secretKey - the private key
 *  @param limit - maximum moves before aborting
 */

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


/**
 *  TODO
 */

function l2(v) {
    var result = 0;

    for (var i = 0; i < v.length; ++i) {
        result = result + v[i] * v[i];
    }

    return result;
}


/**
 *  TODO
 */

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


/**
 *  TODO
 */

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
    }

    currentGame.lastAnimateEncryptionMove = move;

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


/**
 *  TODO
 */

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
