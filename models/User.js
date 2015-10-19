var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: String,
    password: String
})


//Here I am removing the password from the response 
// i am creating the custom method toJSON and call it in the mail api while sending back the response

UserSchema.methods.toJSON = function(){
    var user = this.toObject();
    delete user.password;
    //console.log(user);
    return user;
}



exports.model = mongoose.model('User',UserSchema);

//middleware to encript the password I m using bctpet-nodejs module for this 
// pre is the event which is going to happen before the schema is going to persist in the database.
UserSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password'))
        return next();
    
    bcrypt.genSalt(10, function(err,salt){
        if (err) return next(err);
        
        // null is the extra functionality provided by bcrypt-nodejs other then normal bcrypt
        bcrypt.hash(user.password, salt, null, function(err,hash){ 
            if(err) return next(err);
            user.password = hash; // hashed password is saved in the database
            next();
        })
    })
})

