var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({

    question: {
        type: String
    },
    A: {
        type: String
    },
    B: {
        type: String
    },
    C: {
        type: String
    },
    D: {
        type: String
    },
    answer: {
        type: String
    }
});

var testSchema = new mongoose.Schema({

    testid: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    count: {
        type: Number
    },
    time: {
        type: String
    },
    instructions: {
        type: String
    },
    questions: [questionSchema],
    created: {
        type: Date,
        default: Date.now
    }
});

var Test = module.exports = mongoose.model('Test', testSchema);