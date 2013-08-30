function game() {
	this.username = null;
	this.scenes = null;
}

function genSecretKey(dim) {

    var sk = null;

    var pre_key12 = [8, -3, 1, 0, -1, 0, -1, 1, 2, 0, -2, 1];
    var pre_key10 = [8, -3, 1, 0, -1, 0, -1, 1, 2, 0];
    var pre_key8 = [8, -3, 1, 0, -1, 0, -1, 1];

    if (dim === 8) {
        sk = pre_key8;
    } else if (dim === 10) {
        sk = pre_key10;
    } else if (dim === 12) {
        sk = pre_key12;
    }

    for (var a = 0; a < dim; ++a) {
        var i = Math.floor(Math.random() * dim);
        var j = Math.floor(Math.random() * dim);

        var tmp = sk[i];
        sk[i] = sk[j];
        sk[j] = tmp;
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

function getKeyInfo(dim) {
    var sk = genSecretKey(dim);
    var pk = genPublicKey(dim, sk);

    /**
     * Make to coincide inria's model with dc's model.
     */
    var result = {};

    result['public_key'] = {};
    result['public_key']['key'] = pk;
    result['public_key']['normal_key'] = [];
    result['public_key']['reverse_key'] = [];
    result['public_key']['number'] = [];

    result['private_key'] = {};
    result['private_key']['key'] = pk;
    result['private_key']['normal_key'] = [];
    result['private_key']['reverse_key'] = [];
    result['private_key']['number'] = [];

    for (var i = 0; i < pk.length; ++i) {
        if (pk[i] > 0) {
            result['public_key']['normal_key'].push(COLUMN_TYPE_1);
            result['public_key']['reverse_key'].push(COLUMN_TYPE_2);
            result['public_key']['number'].push(pk[i]);
        } else if (pk[i] < 0) {
            result['public_key']['normal_key'].push(COLUMN_TYPE_2);
            result['public_key']['reverse_key'].push(COLUMN_TYPE_1);
            result['public_key']['number'].push(-1 * pk[i]);
        } else {
            result['public_key']['normal_key'].push(COLUMN_TYPE_3);
            result['public_key']['reverse_key'].push(COLUMN_TYPE_3);
            result['public_key']['number'].push(pk[i]);
        }


        if (sk[i] > 0) {
            result['private_key']['normal_key'].push(COLUMN_TYPE_1);
            result['private_key']['reverse_key'].push(COLUMN_TYPE_2);
            result['private_key']['number'].push(sk[i]);
        } else if (sk[i] < 0) {
            result['private_key']['normal_key'].push(COLUMN_TYPE_2);
            result['private_key']['reverse_key'].push(COLUMN_TYPE_1);
            result['private_key']['number'].push(-1 * sk[i]);
        } else {
            result['private_key']['normal_key'].push(COLUMN_TYPE_3);
            result['private_key']['reverse_key'].push(COLUMN_TYPE_3);
            result['private_key']['number'].push(sk[i]);
        }
    }

    return result;
}

function chiffre(dim, message, pk) {
    var cipher = message;

    for (var i = 1; i < dim / 2; ++i) {
        cipher = sum(cipher, mult(Math.floor(Math.random() * 5) - 2, rotate(dim, pk, i)));
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
