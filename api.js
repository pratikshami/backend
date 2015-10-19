var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var User = require('./models/User.js');
//var jwt = require('./services/jwt.js'); // here i am replacing the jwt service which i have written by the npm module 
var jwt = require('jwt-simple');



app.use(bodyParser.json());

//CORS cross originon headers : need to study that ===============>>>
app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        next();
    })
    //<<<<<<<<<<<<<<<<<<<<<<<<<=======================




app.post('/register', function (req, res) {
    //console.log(req.body);
    var user = req.body;
    var newUser = new User.model({
        email: user.email,
        password: user.password
    });

    var payload = {
        iss: req.hostname, //issuer
        sub: newUser.id //subject
    }
    var token = jwt.encode(payload, "shhh.."); // shh is secret key


    newUser.save(function (err) {
        res.status(200).send({
            user: newUser.toJSON(),
            token: token
        });
    })
})

var jobs = ['cooks', 'hero', 'coader'];


app.get('/jobs', function (req, res) {

    if (!req.headers.authorization) {
        return res.status(401).send({
            message: 'You are not authoroized'
        });
    }
    var token = req.headers.authorization.split(' ')[1]; // here i am fetching the token and split it with respect of space and took the payload from the token 
    var payload = jwt.decode(token, "shhh..") //decoding the payload with the help of token and secet key 


    //payload.sub is the subject which will send and set the user._id i have created it above in this page 
    // it is a security measure to verify the subject
    if (!payload.sub) {
        res.status(401).send({
            message: 'Authentication Failed'
        });
    }


    res.json(jobs);

})

mongoose.connect('mongodb://172.27.59.185:27017/psjwt');

// to test the token
//console.log(jwt.encode('hi', 'secret'));

//study this
var server = app.listen(3000, function () {
    console.log('Backend Listening on' + '   ' + server.address().port);
})