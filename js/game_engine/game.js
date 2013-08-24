function game() {
	this.username = null;
	this.scenes = null;
}

function genSecretKey(dim) {

    var sk = null;

    /*
    var pre_key4 = [4, 1, -1, 0];
    var pre_key8 = [7, 1, 1, -1, -1, 0, 0, 0, 0];
    var pre_key12 = [8, 1, 1, 1, 1, -1, -1, -1, -1, 0, 0, 0];
    var pre_key16 = [9, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0];
    */
    var pre_key4 = [2, 1, -1, 0];
    var pre_key8 = [2, 1, 1, -1, -1, 0, 0, 0, 0];
    var pre_key12 = [2, 1, 1, 1, 1, -1, -1, -1, -1, 0, 0, 0];
    var pre_key16 = [2, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0];

    if (dim === 4)
        sk = pre_key4;
    else if (dim === 8)
        sk = pre_key8;
    else if (dim === 12)
        sk = pre_key12;
    else if (dim === 16)
        sk = pre_key16;


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

    for (var i = 1; i < dim; ++i) {
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

    result['public_key'] = pk;
    result['private_key'] = sk;
    result['normal_key'] = [];
    result['reverse_key'] = [];
    result['number'] = [];

    for (var i = 0; i < pk.length; ++i) {
        if (pk[i] > 0) {
            result['normal_key'].push(COLUMN_TYPE_1);
            result['reverse_key'].push(COLUMN_TYPE_2);
            result['number'].push(pk[i]);
        } else if (pk[i] < 0) {
            result['normal_key'].push(COLUMN_TYPE_2);
            result['reverse_key'].push(COLUMN_TYPE_1);
            result['number'].push(-1 * pk[i]);
        } else {
            result['normal_key'].push(COLUMN_TYPE_3);
            result['reverse_key'].push(COLUMN_TYPE_3);
            result['number'].push(pk[i]);
        }
    }

    return result;
}

function chiffre(dim, message, pk) {
    var cipher = message;

    for (var i = 1; i < dim; ++i) {
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
