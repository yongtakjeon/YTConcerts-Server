const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})


let User; // to be defined on new connection (see initialize)
module.exports.initialize = function() {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection('mongodb+srv://dbUser:456654@cluster0.svjg9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("Users", userSchema);
            resolve();
        })
    });
};

module.exports.registerUser = function(userData) {
    return new Promise(function (resolve, reject) {

        if(userData.password !== userData.password2) {
            reject("Password do not match.");
        }
        else {
            bcrypt.genSalt(10, function(err, salt) { // Generate a "salt" using 10 rounds
                if(err) {
                    reject("There was an error encrypting the password.");
                }
                else {
                    bcrypt.hash(userData.password, salt, function(err, hash) { // encrypt the password
                        if(err) {
                            reject("There was an error encrypting the password.");
                        }
                        else {
                            userData.password = hash; // assign encrypted password

                            User.create(userData, function(err, newUser) {
                                if(err) {
                                    if(err.code == 11000) {
                                        reject("User Name is already taken.");
                                    }
                                    else {
                                        reject("There was an error creating the user: " + err);
                                    }
                                }
                                else {
                                    resolve("User " + userData.userID + " successfully registered.");
                                }
                            });

                        }
                    });
                }
            });
        }
    });
};


module.exports.checkUser = function(userData) {
    return new Promise(function (resolve, reject) {

        User.find({ userID: userData.userID })
        .exec()
        .then((users) => {
            if(users.length === 0) {
                reject("Unable to find user: " + userData.userID);
            }
            else {
                bcrypt.compare(userData.password, users[0].password).then((result) => {
                    if(result === true) {
                        resolve(users[0]);
                    }
                    else {
                        reject("Incorrect Password for user: " + userData.userID);
                    }
                })
            }
        })
        .catch((err) => {
            reject("Unable to find user: " + userData.userID);
        });

    });
};