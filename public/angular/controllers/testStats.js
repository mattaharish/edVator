myApp.controller('testStats', ['$location', '$rootScope', '$window', 'TestService', 'TestInfo', function ($location, $rootScope, $window, TestService, TestInfo) {

    var main = this;

    const testDetails = () => {
        if (main.data) {

            TestService.testTakenByID(main.data._id).then(function successCallback(response) {
                console.log(response);
                main.info = response.data.data;
                calculateMaxAndMinScore();
            }, function errorCallback(response) {
                console.log(response);
            });
        }
    };

    main.get = function () {
        main.data = TestInfo.getData();
        console.log(main.data);
        testDetails();
    };
    main.get();

    let calculateMaxAndMinScore = () => {
        var sum = 0;
        main.count = main.info.length;
        let max = 0;
        let min = main.info[0].score;
        for (let i = 0; i < main.info.length; i++) {
            if (main.info[i].score > max) {
                max = main.info[i].score;
            }
            if (main.info[i].score < min) {
                min = main.info[i].score;
            }
        }
        for (let i = 0; i < main.info.length; i++) {
            sum = sum + parseInt(main.info[i].score);
        }
        console.log(sum);
        main.avg = sum / main.count;
        main.max = max;
        main.min = min;
        console.log(max + " " + min);
    };

    const allUsers = () => {
        TestService.allUsers().then(function successCallback(response) {
            console.log(response);
            main.allusers = response.data.data;
        }, function errorCallback(response) {
            console.log(response);
            alert(response.message);
        });
    };

    allUsers();

    main.getDetails = function (data) {

        TestService.userTestsByAdmin(data).then(function successCallback(response) {
            console.log(response);
            main.takenTests = response.data.data;
            main.userMetrics();
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    main.userMetrics = function () {

        main.testsCount = main.takenTests.length;
        if (main.testsCount>0) {
            var sum = 0;
            var temp, temp1 = 0,
                temp2 = 0;
            let max = 0;
            let min = (parseInt(main.takenTests[0].score) / parseInt(main.takenTests[0].questions)) * 100;
            for (let i = 0; i < main.takenTests.length; i++) {
                //main.takenTests[i].score + ' '+ main.takenTests[i].question
                temp = (parseInt(main.takenTests[i].score) / parseInt(main.takenTests[i].questions)) * 100;
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
            const data = {
                testcount: main.testsCount,
                max: main.max,
                min: main.min,
                avg: main.avg
            };
            console.log(data);
            TestInfo.setUserStats(data);
            $location.path('/userStats');
        }
        
        else{
            alert("User Has Not Attempted Any Tests :(")
        }
    };

    const getUserStats = function () {
        main.userdata = TestInfo.getUserStats();
        console.log(main.userdata);
    };

    getUserStats();

}]);