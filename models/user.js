const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/passportapp');
const bcrypt = require('bcryptjs');


//user Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
});


//init user db
const User = module.exports = mongoose.model('User', UserSchema);


//registering the new user
module.exports.registerUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err){
                console.log(err);
            }
            newUser.password = hash;
            newUser.save(callback);
        })
    })
};

//get user by user name
module.exports.getUserByUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
}


//get user by user id
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

//match the password
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}





