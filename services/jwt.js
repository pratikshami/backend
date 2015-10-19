var crypto = require('crypto');


exports.encode = function (paylode, secret) {
    algorithm = 'HS256';

    var header = {
        type: 'JWT',
        alg: algorithm

    };

    var jwt = base64Encode(JSON.stringify(header)) + '.' + base64Encode(JSON.stringify(paylode));
    return jwt + '.' + sign(jwt, secret);
}



exports.decode = function (token, secret) {
    var segments = token.split('.');

    //veryfing if the token has three parts some thime it may have 2 or 4 in that situation error should be passed invalid token
    if (segments.length !== 3)
        throw new Error("Token Structure Incorrect");

    var headers = JSON.parse(base64Decode(segments[0]));
    var payload = JSON.parse(base64Decode(segments[1]));

    var rawSignature = segments[0] + '.' + segments[1];

    if (!verify(rawSignature, secret, segments[2]))
        throw new Error("Verification Failed");

    return payload;
}




function verify(raw, secret, signature) {
    return signature === sign(raw, secret);
}

function sign(str, key) {
    return crypto.createHmac('sha256', key).update(str).digest('base64');
}

function base64Encode(str) {
    return new Buffer(str).toString('base64');
}

function base64Decode(str) {
    return new Buffer(str, 'base64').toString();
}