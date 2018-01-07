var router = require('express').Router();
var mongoose = require('mongoose');
//var events = require('events');
var random = require('randomstring');

var User = require('./../models/User.js');
var Test = require('./../models/Test.js');
var Taker = require('./../models/Taker.js');

var responseGenerator = require('./../../libs/responseGenerator.js');
var auth = require('./../../libs/auth.js');
//var config = require('./../../config/config.js');
//var eventEmitter = new events.EventEmitter();
var response;

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

// API to get all tests in DB
router.get('/all', function (req, res) {
    //console.log("Tests-->");
    Test.find({}, function (err, result) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
        } else if (!result) {
            response = responseGenerator.generate(false, "No Tests Available", 200, result);
            res.send(response);
        } else {
            response = responseGenerator.generate(false, "Tests Available", 200, result);
            res.send(response);
        }
    });
});

// API to create a test
router.post('/create-test', function (req, res) {
    var newTest = new Test({
        testid: random.generate({
            length: 10,
            charset: 'numeric'
        }),
        title: req.body.title,
        description: req.body.description,
        count: req.body.count,
        time: req.body.time,
        instructions: req.body.instructions,
    });
    newTest.save(function (err) {
        if (err) {
            response = responseGenerator.generate(true, "Some error", 500, null);
            res.send(response);
        } else {
            response = responseGenerator.generate(false, "Test Created Successfully", 200, newTest);
            res.send(response);
        }
    });

});

// API to get a complete details of test
router.get('/:id', function (req, res) {
    //console.log(req);
    Test.findOne({
        '_id': req.params.id
    }, function (err, result) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
        } else {
            response = responseGenerator.generate(false, "Test Details", 200, result);
            res.send(response);
        }
    });
});

// API to delete test
router.post('/delete/:id', function (req, res) {
    Test.findByIdAndRemove({
        '_id': req.params.id
    }, function (err) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
        } else {
            response = responseGenerator.generate(false, "Test Deleted", 200, null);
            res.send(response);
        }
    });
});

// API to add questions to test created
router.post('/:tid/add-question', function (req, res) {
    //console.log(req.params.id);
    console.log(req.body);
    Test.findOneAndUpdate({
        '_id': req.params.tid
    }, {
        '$push': {
            questions: req.body
        }
    }, function (err) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
        } else {
            //console.log(result);
            response = responseGenerator.generate(false, "Question added Successfully", 200, null);
            res.send(response);
        }
    });
});

//API to delete a question in particular test
router.post('/delete/:tid/:qid', function (req, res) {
    Test.update({
        '_id': req.params.tid
    }, {
        "$pull": {
            "questions": {
                _id: req.params.qid
            }
        }
    }, function (err, result) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(result);
        } else {
            response = responseGenerator.generate(false, "Question Deleted Successfully", 200, result);
            res.send(response);
        }
    });
});

// API to edit question
router.put('/:qid', function (req, res) {
    Test.findOneAndUpdate({
        "questions._id": req.params.qid
    }, {
        "$set": {
            "questions.$.question": req.body.question,
            "questions.$.A": req.body.A,
            "questions.$.B": req.body.B,
            "questions.$.C": req.body.C,
            "questions.$.D": req.body.D,
            "questions.$.answer": req.body.answer,
        }
    }, function (err) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
        } else {
            response = responseGenerator.generate(false, "Question Edited Successfully", 200, null);
            res.send(response);
        }
    });
});

// API to edit test details
router.put('/edit/:tid', function (req, res) {
    console.log(req.body);
    Test.findOneAndUpdate({
        "_id": req.params.tid
    }, req.body, function (err) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
        } else {
            response = responseGenerator.generate(false, "Test Edited Successfully", 200, null);
            res.send(response);
        }
    });
});

//API to store result in TakerSchema
router.post('/addtaker', function (req, res) {
    console.log(req.body);
    var taker = new Taker({
        username: req.body.username,
        email: req.body.email,
        testid: req.body.testid,
        score: req.body.score,
        questions: req.body.questions
    });
    //console.log(taker);
    taker.save(function (err, result) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
            return;
        } else {
            console.log(result);
            for (let i = 0; i < req.body.questions; i++) {
                console.log(result._id);
                //result.answerTime[i].question = req.body.testQuestions[i];
                console.log(result.answerTime);
                var test = {
                    question: req.body.testQuestions[i],
                    answer: req.body.testAnswers[i],
                    timeTaken: req.body.timeTakenForEachQuestion[i]
                };
                console.log(test);
                Taker.findOneAndUpdate({
                    "_id": result._id
                }, {
                    "$push": {
                        "answerTime": test
                    }
                }, function (error) {
                    console.log(error);
                });
            }
            response = responseGenerator.generate(false, "Added Test Taker Successfully", 200, null);
            res.send(response);
        }
    });
});

//API to get tests attempted by user
router.get('/user/usertests', auth.auth, function (req, res) {
    console.log(req.user);
    Taker.find({
        email: req.user.email
    }, function (err, result) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
        } else {
            response = responseGenerator.generate(false, "Tests Taken By User", 200, result);
            res.send(response);
        }
    });
});

//API to get tests attempted by user by admin
router.get('/admin/usertests/:email', function (req, res) {
    //console.log(req.user);
    Taker.find({
        email: req.params.email
    }, function (err, result) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
        } else {
            response = responseGenerator.generate(false, "Tests Taken By User", 200, result);
            res.send(response);
        }
    });
});

//API to get list of test takers of particular test
router.get('/taken/:id', function (req, res) {
    Taker.find({
        testid: req.params.id
    }, function (err, result) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
        } else {
            response = responseGenerator.generate(false, "TestTakers of Test", 200, result);
            res.send(response);
        }
    });
});

//API to get all the tests taken
router.get('/admin/allteststaken', function (req, res) {
    Taker.find({}, function (err, result) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
        } else {
            response = responseGenerator.generate(false, "All Takers who attempted test", 200, result);
            res.send(response);
        }
    });
});

//API to retrieve all the users registered in edVator
router.get('/users/allusers', function (req, res) {
    console.log("Matta");
    User.find({}, function (err, result) {
        if (err) {
            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(response);
        } else if (!result) {
            console.log(result);
            response = responseGenerator.generate(false, "No Users available ", 200, result);
            res.send(response);
        } else {
            console.log(result);
            response = responseGenerator.generate(false, "All registered users", 200, result);
            res.send(response);
        }
    });
});

//router
module.exports = router;