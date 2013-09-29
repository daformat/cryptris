var authorizedLength = [4, MIN_BOARD_LENGTH, MEDIUM_BOARD_LENGTH, MAX_BOARD_LENGTH, 20];

function genSecretKey(dim) {

    var sk = [];

    var pre_key = [8, -3, 1, 0, -1, 0, -1, 1, 2, 0, -2, 1, 0, 2, 1, 0, 1, -1, -1, 4, 2, 1, -2, 0, 0, 0, 3, -3, -2, 0];

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

function resetPublicKey(newPk) {

    if (currentGame.playerKeyInfo !== null && currentGame.playerKeyInfo !== undefined) {

        for (var j = 0; j < authorizedLength.length; j++) {
            var index = authorizedLength[j];

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
}

function chiffre(dim, message, pk) {
    var cipher = message;
    var subPk = [];
    for (var i = 0; i < dim; ++i) {
        subPk.push(pk[i]);
    }

    for (var i = 1; i < dim / 2; ++i) {
        cipher = sum(cipher, mult(Math.floor(Math.random() * 5) - 2, rotate(dim, subPk, i)));
    }

    var result = {};
    result['message_type'] = [];
    result['message_number'] = [];
    result['message_original'] = [];

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
