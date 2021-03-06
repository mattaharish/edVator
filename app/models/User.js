var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    password: {
        type: String
    },
    uid: {
        type: String
    },
    token: {
        type: String
    },
    name: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', userSchema);