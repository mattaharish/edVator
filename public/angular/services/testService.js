myApp.service('TestService', function ($http) {

    this.createTest = function (data) {
        return $http.post('/test/create-test', data);
    }; // End Creating Test

    this.addQuestion = function (data) {
        return $http.post('/test/' + data.tid + '/add-question', data);
    }; //End Adding Question to particular test

    this.getAllTests = function () {
        return $http.get('/test/all');
    }; //End getting all tests in DB

    this.editQuestion = function (qid, data) {
        return $http.put('/test/' + qid, data);
    }; //End editing question of particular test

    this.deleteTest = function (testid) {
        return $http.post('/test/delete/' + testid);
    }; //End deleting a test

    this.saveTaker = function (data) {
        console.table(data);
        return $http.post('/test/addtaker', data);
    }; //End adding test taker

    this.userTakenTests = function (data) {
        console.log(data);
        return $http.get('/test/user/usertests', {
            headers: {
                'x-access-token': data.token
            }
        });
    }; //End of retriving the tests taken by user

    this.userTestsByAdmin = function (data) {
        console.log(data);
        return $http.get('/test/admin/usertests/' + data);
    }; //End of retriving the tests taken by user from admin section

    this.testTakenByID = function (data) {
        console.log(data);
        return $http.get('/test/taken/' + data);
    }; //End of retrieving users who took a particular test

    this.editTest = function (tid, data) {
        return $http.put('/test/edit/' + tid, data);
    }; //End of editing the test details

    this.deleteQuestion = function (tid, qid) {
        return $http.post('/test/delete/' + tid + '/' + qid);
    }; //End of deleting a question of particular test

    this.testDetails = function (tid) {
        return $http.get('/test/' + tid);
    }; //End of retrieving details of single test

    this.allUsers = function () {
        console.log("Matta");
        return $http.get('/test/users/allusers');
    }; //End of retrieving all users

});