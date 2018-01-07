myApp.controller('testRunCtrl', ['$location', '$timeout', '$interval', '$window', 'TestService', 'TestInfo', 'jwtHelper', function ($location, $timeout, $interval, $window, TestService, TestInfo, jwtHelper) {

    var main = this;

    main.i = 1;
    main.index = 0;
    main.question = "";
    main.answer = "";
    main.option1 = "";
    main.option2 = "";
    main.option3 = "";
    main.option4 = "";
    main.autosubmit = false;

    main.userAnswers = [];
    main.correctAnswers = [];

    main.get = function () {
        main.data = TestInfo.getData();
        console.log(main.data.questions);
        main.time = main.data.time;
        main.question = main.data.questions[main.index].question;
        main.option1 = main.data.questions[main.index].A;
        main.option2 = main.data.questions[main.index].B;
        main.option3 = main.data.questions[main.index].C;
        main.option4 = main.data.questions[main.index].D;
        //main.timer();
        console.log(main.data.questions[0].answer);
        for (var temp = 0; temp < main.data.count; temp++) {
            console.log(main.data.questions[temp]);
            main.correctAnswers[temp] = main.data.questions[temp].answer;
        }
        //console.table(main.correctAnswers);
        main.timeTaken = new Array(main.data.count);
        for (let i = 0; i < main.data.count; i++) {
            main.timeTaken[i] = 0;
        }
        console.table(main.timeTaken);
        console.table(main.correctAnswers);
    };
    main.get();

    main.timer = function () {
        main.Minutes = main.time - 1;
        main.Counter = 60;
        main.onTimeout = function () {
            main.timeTaken[main.index] = main.timeTaken[main.index] + 1;
            main.Counter--;
            //console.log(main.Counter);
            if (main.Counter == -1) {
                main.Counter = 60;
                main.Minutes--;
            }
            if (main.Minutes == -1) {
                main.stop();
                alert("Time Up! Thanks for Taking the Test!!");
                main.autosubmit = true;
                main.testSubmit();
                main.confirm = true;
            }
            //mytimeout = $interval(main.onTimeout, 1000);
        };
        var mytimeout = $interval(main.onTimeout, 1000);

        main.stop = function () {

            $interval.cancel(mytimeout);
        };
    };

    main.timer();

    main.previousQuestion = function () {

        main.userAnswers[main.index] = main.answer;
        main.index--;
        console.log(main.answer);
        main.i--;
        main.question = main.data.questions[main.index].question;
        main.option1 = main.data.questions[main.index].A;
        main.option2 = main.data.questions[main.index].B;
        main.option3 = main.data.questions[main.index].C;
        main.option4 = main.data.questions[main.index].D;
        console.log(main.i);
        console.log(main.data.count);
        //main.answer = "";
        main.answer = main.userAnswers[main.index];
        /*if (main.i == 1) {
            main.show = true;
        }*/

    };

    main.nextQuestion = function () {

        main.userAnswers[main.index] = main.answer;
        main.index++;
        main.i++;
        main.question = main.data.questions[main.index].question;
        main.option1 = main.data.questions[main.index].A;
        main.option2 = main.data.questions[main.index].B;
        main.option3 = main.data.questions[main.index].C;
        main.option4 = main.data.questions[main.index].D;
        console.log(main.i);
        console.log(main.data.count);
        main.answer = main.userAnswers[main.index];
        /*if (main.i == main.data.count) {
            main.show = false;
        } */
    };

    main.testSubmit = function () {
        main.userAnswers[main.index] = main.answer;
        console.table(main.userAnswers);
        console.table(main.correctAnswers);
        console.table(main.timeTaken);
        if (!main.autosubmit) {
            if ($window.confirm("Are you sure, you want to submit the Test ?")) {
                main.stop();
                main.calculateScore();
                main.confirm = true;
                console.log(main.confirm);
            }
        } else {
            main.calculateScore();
        }
    };

    main.calculateScore = function () {
        main.score = 0;
        for (var temp = 0; temp < main.data.count; temp++) {
            if (main.userAnswers[temp] == main.correctAnswers[temp]) {
                main.score++;
            }
        }
        var userinfo = jwtHelper.decodeToken(JSON.parse(localStorage.getItem('currentUser')).token);
        console.log(userinfo);
        if (userinfo.firstname) {
            var username = userinfo.firstname + ' ' + userinfo.lastname;
        } else {
            username = userinfo.name;
        }
        var email = userinfo.email;
        var testid = main.data._id;
        var score = main.score;
        var questioncount = main.data.questions.length;
        
        var q = new Array(main.data.count);
        for (let i = 0; i < main.data.count; i++) {
            q[i] = main.data.questions[i].question;
        }
        console.table(q);
        console.table(main.timeTaken);
        console.table(main.correctAnswers);
        var data = {
            email: email,
            username: username,
            testid: testid,
            score: score,
            questions: questioncount,
            testQuestions:q,
            testAnswers:main.correctAnswers,
            timeTakenForEachQuestion:main.timeTaken
        };
        console.table(data);
        //console.log(data);
        //console.log(main.score);
        TestService.saveTaker(data).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

}]); // end controller