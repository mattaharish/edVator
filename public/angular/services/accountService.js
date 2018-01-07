myApp.service('AccountService', function ($http) {

    var main = this;
    this.baseUrl = "";

    this.register = function (data) {

        return $http.post(main.baseUrl + '/register', data);

    }; // end registering user account

    this.login = function (data) {

        return $http.post(main.baseUrl + '/login', data);

    }; //end Login to Account

    this.passportLogin = function () {

        return $http.get(main.baseUrl + '/userDetails');

    }; //end getting passport login details

    this.forgotPassword = function (data) {

        return $http.post(main.baseUrl + '/forgot-password', data);

    }; //end forgot password email intake

    this.verifyUnique = function (data) {

        return $http.get(main.baseUrl + '/verify-unique', {
            params: {
                otp: data
            }
        });
    }; //end verifying unique id

    this.resetPassword = function (data) {

        return $http.post(main.baseUrl + '/reset-password', data);

    }; //end of reset-password

    this.logout = function(){
        
        return $http.get('/logout');
    };

}); //end account service