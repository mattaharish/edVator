myApp.controller('testCtrl', ['$location', '$rootScope', '$scope', '$window', '$timeout', '$route', 'TestService', 'TestInfo', 'jwtHelper', function ($location, $rootScope, $scope, $window, $timeout, $route, TestService, TestInfo, jwtHelper) {

    var main = this;

    $scope.labels = ["Test-1", "Test-2", "Test-3", "Test-4", "Test-5", "Test-6", "Test-7"];
    //$scope.series = ['Series A'];
    $scope.data = [];
    $scope.options = {
        scales: {
            yAxes: [{
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                ticks: {
                    beginAtZero: true,
                    steps: 10,
                    stepValue: 5,
                    max: 100
                },
                position: 'left'
            }]
        }
    };

    this.i = 1;
    main.show = true;
    main.index = 1;

    main.addTest = function () {
        var data = {
            title: main.title,
            description: main.description,
            count: main.count,
            time: main.time,
            instructions: main.instructions
        };
        main.show = false;
        console.log(data);
        //main.message = "Created";
        TestService.createTest(data).then(function successCallback(response) {
            console.log(response);
            main.tid = response.data.data._id;
            console.log(main.tid);
            main.message = response.data.message;

        }, function errorCallback(response) {
            console.log(response);
        });
        $window.scrollTo(0, 0);
    };

    main.questionTracker = function () {
        console.log(main.i);
        //console.log("Matta");
        console.log(main.count);
        if (main.i < main.count) {
            main.addQuestion(main.tid);
            console.log(main.i);
            console.log(main.count);
            main.i++;
        } else {
            main.addQuestion(main.tid);
            //alert("Done");
            $location.path("/dashboard");
        }
        main.index++;
        //alert("Added all questions");
    };

    main.showQuestionForm = function () {
        alert("Make sure you have updated the 'No of Questions' Field in Test Details form !");
        main.addQ = true;
    };

    main.editTest = function (tid) {
        var data = {
            title: main.data.title,
            description: main.data.description,
            count: main.data.count,
            time: main.data.time,
            instructions: main.data.instructions
        };
        console.log(data);
        TestService.editTest(tid, data).then(function successCallback(response) {
            console.log(response);
            main.message = response.data.message;
            alert(main.message);
            $window.scrollTo(0, 0);
            TestService.testDetails(tid).then(function successCallback(response) {
                var data = response.data.data;
                main.testData(data);
                $route.reload();
            }, function errorCallback(response) {
                console.log(response);
            });
        }, function errorCallback(response) {
            console.log(response);
        });

    };

    main.addQuestion = function (tid) {
        console.log(tid);
        var data = {
            tid: tid,
            question: main.question,
            A: main.A,
            B: main.B,
            C: main.C,
            D: main.D,
            answer: main.answer
        };
        TestService.addQuestion(data).then(function successCallback(response) {
            console.log(response);
            main.message = response.data.message;
            alert(main.message);
            if (main.addQ) {
                TestService.testDetails(tid).then(function successCallback(response) {
                    var data = response.data.data;
                    main.testData(data);
                    $route.reload();

                }, function errorCallback(response) {
                    console.log(response);
                });
            }

        }, function errorCallback(response) {
            console.log(response);
        });
        $window.scrollTo(0, 0);
        console.log(data);
        main.question = "";
        main.A = "";
        main.B = "";
        main.C = "";
        main.D = "";
        main.answer = "";
    };

    main.confirmDelete = function (tid, qid) {
        if (confirm("Make sure you updated the test details, before deleting the question")) {
            main.deleteQuestion(tid, qid);
        }
    };

    main.deleteQuestion = function (tid, qid) {
        console.log(tid + " " + qid);
        TestService.deleteQuestion(tid, qid).then(function successCallback(response) {
            console.log(response);
            main.message = response.data.message;
            alert(main.message);
            $window.scrollTo(0, 0);
            TestService.testDetails(tid).then(function successCallback(response) {
                var data = response.data.data;
                main.testData(data);
                $route.reload();
            }, function errorCallback(response) {
                console.log(response);
            });
        }, function errorCallback(response) {
            console.log(response);
        })
    };

    main.allTests = function () {
        console.log("Test");
        TestService.getAllTests().then(function successCallback(response) {
            console.log(response);
            main.alltests = response.data.data;
            main.userTakenTests();
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    main.allTests();

    main.testData = function (data) {
        console.log("Matta111");
        main.testCompleteInfo = data;
        TestInfo.setData(main.testCompleteInfo);
        main.get();
        //$location.path("/testDetails");

    };

    main.get = function () {
        main.data = TestInfo.getData();
        console.log(main.data);
    };
    main.get();

    main.editQuestion = function (qid, index) {
        var data = {
            question: main.data.questions[index].question,
            A: main.data.questions[index].A,
            B: main.data.questions[index].B,
            C: main.data.questions[index].C,
            D: main.data.questions[index].D,
            answer: main.data.questions[index].answer
        };
        console.log(data);
        TestService.editQuestion(qid, data).then(function successCallback(response) {
            console.log(response);
            alert(response.data.message);

        }, function errorCallback(response) {
            console.log(response);
        });
    };

    main.deleteTest = function (testid) {
        TestService.deleteTest(testid).then(function successCallback(response) {
            console.log(response);
            alert(response.data.message);
            $location.path('/dashboard');
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    main.timer = function () {
        main.Minutes = 0;
        main.Counter = 60;
        main.onTimeout = function () {
            main.Counter--;
            console.log(main.Counter);
            if (main.Counter == -1) {
                main.Counter = 60;
                main.Minutes--;
            }
            if (main.Minutes == -1) {
                alert("Time Up");
            }
            mytimeout = $timeout(main.onTimeout, 1000);
        };
        var mytimeout = $timeout(main.onTimeout, 1000);

        main.stop = function () {
            $timeout.cancel(mytimeout);
        };
    };
    //main.timer();

    main.userTakenTests = function () {
        var token = JSON.parse(localStorage.getItem('currentUser')).token;
        console.log(token);
        var data = {
            token: token
        };
        TestService.userTakenTests(data).then(function successCallback(response) {
            console.log(response);
            main.takenTests = response.data.data;
            main.testsTakenByUser();
            main.userMetrics();
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    main.userMetrics = function () {

        main.testsCount = main.takenTests.length;
        var sum = 0;
        var temp, temp1 = 0,
            temp2 = 0;
        let max = 0;
        let min = (parseInt(main.takenTests[0].score) / parseInt(main.takenTests[0].questions)) * 100;
        for (let i = 0; i < main.takenTests.length; i++) {
            //main.takenTests[i].score + ' '+ main.takenTests[i].question
            temp = (parseInt(main.takenTests[i].score) / parseInt(main.takenTests[i].questions)) * 100;
            $scope.data[i]=temp;
            if (temp > max) {
                temp1 = i;
                max = temp;
            }
            if (temp < min) {
                temp2 = i;
                min = temp;
            }
            sum = sum + temp;
        }
        console.log(sum);
        tempavg = (sum / main.testsCount);
        main.avg = Number((tempavg).toFixed(1));
        main.max = main.takenTests[temp1].score + ' out of ' + main.takenTests[temp1].questions;
        main.min = main.takenTests[temp2].score + ' out of ' + main.takenTests[temp2].questions;
        console.log(max + " " + min);
        $scope.Percent = main.avg;
    };

    main.testScoreInfo = function (testdata) {
        console.log(testdata)
        console.log("testt..");
        main.testScore = testdata.score;
        main.qCount = testdata.questions;
        var per = (main.testScore/main.qCount)*100;
        main.testPercent = Number((per).toFixed(2));
    };

    main.testsTakenByUser = function () {
        var teststaken = [];
        var testsAvailable = [];
        var temp = 0;
        var data;
        var flag;
        console.log(main.alltests);
        console.log(main.takenTests);
        for (let i = 0; i < main.alltests.length; i++) {
            flag = 0;
            for (let j = 0; j < main.takenTests.length; j++) {
                if (main.alltests[i]._id == main.takenTests[j].testid) {
                    data = {
                        title: main.alltests[i].title,
                        questions: main.alltests[i].count,
                        time: main.alltests[i].time,
                        score: main.takenTests[j].score
                    };
                    teststaken.push(data);
                    flag = 1;
                }
            }
            if (flag == 0) {
                testsAvailable.push(main.alltests[i]);
            }
        }
        main.teststaken = teststaken;
        console.log(main.teststaken);
        main.testsAvailable = testsAvailable;
        console.log(main.testsAvailable);
        main.setAvailable(main.testsAvailable);
    };

    main.setAvailable = function (data) {
        console.log(data);
        TestInfo.setAvailable(data);
    };

    main.getAvailable = function () {
        main.availableTests = TestInfo.getAvailable();
        console.log(main.availableTests);
    }
    main.getAvailable();

}]); // end controller
