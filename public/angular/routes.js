myApp.config(['$routeProvider', '$locationProvider', 'jwtInterceptorProvider', function ($routeProvider, $locationProvider, $rootScope, jwtInterceptorProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/home.html'
        })
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'userCtrl',
            controllerAs: 'account'
        })
        .when('/dashboard', {
            templateUrl: '/views/dashboard.html',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    checkBeforeRouteChange($location, $rootScope, jwtHelper);
                }
            },
            controller: 'testCtrl',
            controllerAs: 'test'
        })
        .when('/addtest', {
            templateUrl: '/views/add-test.html',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    checkBeforeRouteChange($location, $rootScope, jwtHelper);
                }
            },
            controller: 'testCtrl',
            controllerAs: 'test'
        })
        .when('/testDetails', {
            templateUrl: '/views/test-details.html',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    checkBeforeRouteChange($location, $rootScope, jwtHelper);
                }
            },
            controller: 'testCtrl',
            controllerAs: 'test'
        })
        .when('/homepage', {
            templateUrl: '/views/user-dashboard.html',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    checkBeforeRouteChange($location, $rootScope, jwtHelper);
                }
            },
            controller: 'testCtrl',
            controllerAs: 'test'
        })
        .when('/testrun', {
            templateUrl: '/views/test-run.html',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    checkBeforeRouteChange($location, $rootScope, jwtHelper);
                }
            },
            controller: 'testRunCtrl',
            controllerAs: 'run'
        })
        .when('/testStats', {
            templateUrl: '/views/statistics.html',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    checkBeforeRouteChange($location, $rootScope, jwtHelper);
                }
            },
            controller: 'testStats',
            controllerAs: 'stat'
        })
        .when('/userStats', {
            templateUrl: '/views/user-stats.html',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    checkBeforeRouteChange($location, $rootScope, jwtHelper);
                }
            },
            controller: 'testStats',
            controllerAs: 'stat'
        })
        .when('/available-tests', {
            templateUrl: '/views/available-tests.html',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    checkBeforeRouteChange($location, $rootScope, jwtHelper);
                }
            },
            controller: 'testCtrl',
            controllerAs: 'test'
        })
        .when('/allusers', {
            templateUrl: '/views/all-users.html',
            resolve: {
                "check": function ($location, $rootScope, jwtHelper) {
                    checkBeforeRouteChange($location, $rootScope, jwtHelper);
                }
            },
            controller: 'testStats',
            controllerAs: 'stat'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });

    function checkBeforeRouteChange($location, $rootScope, jwtHelper) {
        //alert("Matta");
        if (localStorage.getItem('currentUser')) {

            var token = JSON.parse(localStorage.getItem('currentUser')).token;

            if (jwtHelper.isTokenExpired(token)) {
                alert("Token Expired :(");
                $location.path('/');
                $rootScope.show = false;
            } else {

                $rootScope.show = true;
                //$location.path('/dashboard');
            }

        } else {
            $location.path('/');
            $rootScope.show = false;
        }
    };

}]);