var symbols1 = ["0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p"];
var symbols2 = ["q","r","s","t","u","v","w","x","y","z",
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"]
var symbols3 = ["Q","R","S","T","U","V","W","X","Y","Z"];
var separator = ["(",")","+","-","*","/","|","&"];

function HTMLentities(texte) {

    texte = texte.replace(/"/g,'&quot;'); // 34 22
    texte = texte.replace(/&/g,'&amp;'); // 38 26
    texte = texte.replace(/\'/g,'&#39;'); // 39 27
    texte = texte.replace(/</g,'&lt;'); // 60 3C
    texte = texte.replace(/>/g,'&gt;'); // 62 3E
    texte = texte.replace(/\^/g,'&circ;'); // 94 5E
    texte = texte.replace(/‘/g,'&lsquo;'); // 145 91
    texte = texte.replace(/’/g,'&rsquo;'); // 146 92
    texte = texte.replace(/“/g,'&ldquo;'); // 147 93
    texte = texte.replace(/”/g,'&rdquo;'); // 148 94
    texte = texte.replace(/•/g,'&bull;'); // 149 95
    texte = texte.replace(/–/g,'&ndash;'); // 150 96
    texte = texte.replace(/—/g,'&mdash;'); // 151 97
    texte = texte.replace(/˜/g,'&tilde;'); // 152 98
    texte = texte.replace(/™/g,'&trade;'); // 153 99
    texte = texte.replace(/š/g,'&scaron;'); // 154 9A
    texte = texte.replace(/›/g,'&rsaquo;'); // 155 9B
    texte = texte.replace(/œ/g,'&oelig;'); // 156 9C
    texte = texte.replace(//g,'&#357;'); // 157 9D
    texte = texte.replace(/ž/g,'&#382;'); // 158 9E
    texte = texte.replace(/Ÿ/g,'&Yuml;'); // 159 9F
    // texte = texte.replace(/ /g,'&nbsp;'); // 160 A0
    texte = texte.replace(/¡/g,'&iexcl;'); // 161 A1
    texte = texte.replace(/¢/g,'&cent;'); // 162 A2
    texte = texte.replace(/£/g,'&pound;'); // 163 A3
    //texte = texte.replace(/ /g,'&curren;'); // 164 A4
    texte = texte.replace(/¥/g,'&yen;'); // 165 A5
    texte = texte.replace(/¦/g,'&brvbar;'); // 166 A6
    texte = texte.replace(/§/g,'&sect;'); // 167 A7
    texte = texte.replace(/¨/g,'&uml;'); // 168 A8
    texte = texte.replace(/©/g,'&copy;'); // 169 A9
    texte = texte.replace(/ª/g,'&ordf;'); // 170 AA
    texte = texte.replace(/«/g,'&laquo;'); // 171 AB
    texte = texte.replace(/¬/g,'&not;'); // 172 AC
    texte = texte.replace(/­/g,'&shy;'); // 173 AD
    texte = texte.replace(/®/g,'&reg;'); // 174 AE
    texte = texte.replace(/¯/g,'&macr;'); // 175 AF
    texte = texte.replace(/°/g,'&deg;'); // 176 B0
    texte = texte.replace(/±/g,'&plusmn;'); // 177 B1
    texte = texte.replace(/²/g,'&sup2;'); // 178 B2
    texte = texte.replace(/³/g,'&sup3;'); // 179 B3
    texte = texte.replace(/´/g,'&acute;'); // 180 B4
    texte = texte.replace(/µ/g,'&micro;'); // 181 B5
    texte = texte.replace(/¶/g,'&para'); // 182 B6
    texte = texte.replace(/·/g,'&middot;'); // 183 B7
    texte = texte.replace(/¸/g,'&cedil;'); // 184 B8
    texte = texte.replace(/¹/g,'&sup1;'); // 185 B9
    texte = texte.replace(/º/g,'&ordm;'); // 186 BA
    texte = texte.replace(/»/g,'&raquo;'); // 187 BB
    texte = texte.replace(/¼/g,'&frac14;'); // 188 BC
    texte = texte.replace(/½/g,'&frac12;'); // 189 BD
    texte = texte.replace(/¾/g,'&frac34;'); // 190 BE
    texte = texte.replace(/¿/g,'&iquest;'); // 191 BF
    texte = texte.replace(/À/g,'&Agrave;'); // 192 C0
    texte = texte.replace(/Á/g,'&Aacute;'); // 193 C1
    texte = texte.replace(/Â/g,'&Acirc;'); // 194 C2
    texte = texte.replace(/Ã/g,'&Atilde;'); // 195 C3
    texte = texte.replace(/Ä/g,'&Auml;'); // 196 C4
    texte = texte.replace(/Å/g,'&Aring;'); // 197 C5
    texte = texte.replace(/Æ/g,'&AElig;'); // 198 C6
    texte = texte.replace(/Ç/g,'&Ccedil;'); // 199 C7
    texte = texte.replace(/È/g,'&Egrave;'); // 200 C8
    texte = texte.replace(/É/g,'&Eacute;'); // 201 C9
    texte = texte.replace(/Ê/g,'&Ecirc;'); // 202 CA
    texte = texte.replace(/Ë/g,'&Euml;'); // 203 CB
    texte = texte.replace(/Ì/g,'&Igrave;'); // 204 CC
    texte = texte.replace(/Í/g,'&Iacute;'); // 205 CD
    texte = texte.replace(/Î/g,'&Icirc;'); // 206 CE
    texte = texte.replace(/Ï/g,'&Iuml;'); // 207 CF
    texte = texte.replace(/Ð/g,'&ETH;'); // 208 D0
    texte = texte.replace(/Ñ/g,'&Ntilde;'); // 209 D1
    texte = texte.replace(/Ò/g,'&Ograve;'); // 210 D2
    texte = texte.replace(/Ó/g,'&Oacute;'); // 211 D3
    texte = texte.replace(/Ô/g,'&Ocirc;'); // 212 D4
    texte = texte.replace(/Õ/g,'&Otilde;'); // 213 D5
    texte = texte.replace(/Ö/g,'&Ouml;'); // 214 D6
    texte = texte.replace(/×/g,'&times;'); // 215 D7
    texte = texte.replace(/Ø/g,'&Oslash;'); // 216 D8
    texte = texte.replace(/Ù/g,'&Ugrave;'); // 217 D9
    texte = texte.replace(/Ú/g,'&Uacute;'); // 218 DA
    texte = texte.replace(/Û/g,'&Ucirc;'); // 219 DB
    texte = texte.replace(/Ü/g,'&Uuml;'); // 220 DC
    texte = texte.replace(/Ý/g,'&Yacute;'); // 221 DD
    texte = texte.replace(/Þ/g,'&THORN;'); // 222 DE
    texte = texte.replace(/ß/g,'&szlig;'); // 223 DF
    texte = texte.replace(/à/g,'&agrave;'); // 224 E0
    texte = texte.replace(/á/g,'&aacute;'); // 225 E1
    texte = texte.replace(/â/g,'&acirc;'); // 226 E2
    texte = texte.replace(/ã/g,'&atilde;'); // 227 E3
    texte = texte.replace(/ä/g,'&auml;'); // 228 E4
    texte = texte.replace(/å/g,'&aring;'); // 229 E5
    texte = texte.replace(/æ/g,'&aelig;'); // 230 E6
    texte = texte.replace(/ç/g,'&ccedil;'); // 231 E7
    texte = texte.replace(/è/g,'&egrave;'); // 232 E8
    texte = texte.replace(/é/g,'&eacute;'); // 233 E9
    texte = texte.replace(/ê/g,'&ecirc;'); // 234 EA
    texte = texte.replace(/ë/g,'&euml;'); // 235 EB
    texte = texte.replace(/ì/g,'&igrave;'); // 236 EC
    texte = texte.replace(/í/g,'&iacute;'); // 237 ED
    texte = texte.replace(/î/g,'&icirc;'); // 238 EE
    texte = texte.replace(/ï/g,'&iuml;'); // 239 EF
    texte = texte.replace(/ð/g,'&eth;'); // 240 F0
    texte = texte.replace(/ñ/g,'&ntilde;'); // 241 F1
    texte = texte.replace(/ò/g,'&ograve;'); // 242 F2
    texte = texte.replace(/ó/g,'&oacute;'); // 243 F3
    texte = texte.replace(/ô/g,'&ocirc;'); // 244 F4
    texte = texte.replace(/õ/g,'&otilde;'); // 245 F5
    texte = texte.replace(/ö/g,'&ouml;'); // 246 F6
    texte = texte.replace(/÷/g,'&divide;'); // 247 F7
    texte = texte.replace(/ø/g,'&oslash;'); // 248 F8
    texte = texte.replace(/ù/g,'&ugrave;'); // 249 F9
    texte = texte.replace(/ú/g,'&uacute;'); // 250 FA
    texte = texte.replace(/û/g,'&ucirc;'); // 251 FB
    texte = texte.replace(/ü/g,'&uuml;'); // 252 FC
    texte = texte.replace(/ý/g,'&yacute;'); // 253 FD
    texte = texte.replace(/þ/g,'&thorn;'); // 254 FE
    texte = texte.replace(/ÿ/g,'&yuml;'); // 255 FF
    return texte;
}

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

var symbols = [" ", "0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    ";", ".", ",","!","?","&","%","'","\\","\"","(",")","+","-","*","/","|","□"];

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
    var html_string = HTMLentities(string);
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
}

function shuffleList(l) {
    for (var i = 0; i < l.length * l.length; ++i) {
        tmpValue = l[l.length - 1];
        randomIndex = Math.floor(Math.random(1) * l.length);
        l[l.length - 1] = l[randomIndex];
        l[randomIndex] = tmpValue;
    }
    return l;
}

var sks = {
    8 : shuffleList([7, 1, -1, 1, 0, 0, 0, 0]),
    10 : shuffleList([11, 1, 1, -1, -2, -1, 0, 0, 0, 0]),
    12 : shuffleList([16, 1, 2, 1, -1, -2, -1, -1, 0, 0, 0, 0]),
    14 : shuffleList([21, 1, 2, 1, -1, -1, -2, 1, 1, 0, 0, 0, 0, 1]),
    16 : shuffleList([25, 1, 2, 1, 1, -2, -1, -1, 1, 0, 1, 0, -2, 0, 0, 0])
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