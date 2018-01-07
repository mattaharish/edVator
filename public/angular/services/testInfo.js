myApp.service('TestInfo', function () {
    var main = this;
    this.setData = function (data) {
        main.testData = data;
    };
    this.getData = function () {
        console.log(main.testData);
        return main.testData;
    };
    this.setAvailable = function (data) {
        main.availableTests = data;
    };
    this.getAvailable = function () {
        return main.availableTests;
    };
    this.setUserStats = function (data) {
        main.userStats = data;
    };
    this.getUserStats = function (data) {
        return main.userStats;
    };

});