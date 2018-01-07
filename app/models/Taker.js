var mongoose = require('mongoose');

var answerWithTime = new mongoose.Schema({

    question: {
        type: String
    },
    answer: {
        type: String
    },
    timeTaken: {
        type: String, //in secs
        default: 0
    }

});

var TakerSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    testid: {
        type: String
    },
    score: {
        type: String
    },
    questions: {
        type: String
    },
    answerTime: [answerWithTime],
    takenat: {
        type: Date,
        default: Date.now
    }

});

var Taker = module.exports = mongoose.model('Taker', TakerSchema);