angular.module('common', ['ngMessages', 'auth'])
    .controller('BaseFormCtrl', ['$scope', '$rootScope', '$http', '$location', 'LoginService', 'auth', function ($scope, $rootScope, $http, $location, LoginService, auth) {
	
        var fieldWithFocus;


	$rootScope.showMealClock = true;
        $scope.vm = {
            submitted: false,
            errorMessages: []
        };
	
	
	$scope.credentials = {};
	
        $scope.authenticated = function() {
            return auth.authenticated;
        }
	
        $scope.newLogin = function(credentials) {
	    console.log("IN NEW LOGIN " + credentials.username);
            auth.authenticate(credentials, function(authenticated) {
                if (authenticated) {
//		    $scope.setProgressMessage("");
                    console.log("Login succeeded")
		    $scope.setStatusMessage("Login succeeded");
                    $scope.error = false;
                } else {
		    $scope.setProgressMessage("");
                    console.log("Login failed")
		    $scope.setErrorMessage("Wrong username or password");
                    $scope.vm.username = "";
                    $scope.vm.password = "";
                    $scope.error = true;
                }
            })
        };
	
        $scope.new_logout = function() {
            auth.clear();
        }
	
/*******************/

        $scope.focus = function (fieldName) {
            fieldWithFocus = fieldName;
            $scope.vm.errorMessages = [];
        };
        
        $scope.blur = function (fieldName) {
            fieldWithFocus = undefined;
        };

        $scope.isMessagesVisible = function (fieldName) {
            return fieldWithFocus === fieldName || $scope.vm.submitted;
        };

        $scope.preparePostData = function () {
            var username = $scope.vm.username != undefined ? $scope.vm.username : '';
            var password = $scope.vm.password != undefined ? $scope.vm.password : '';
            var email = $scope.vm.email != undefined ? $scope.vm.email : '';

            return 'username=' + username + '&password=' + password + '&email=' + email;
        }

        $scope.setErrorMessage = function(desc){
            $scope.vm.statusMessages = [];
            $scope.vm.errorMessages = [];
            $scope.vm.errorMessages.push({description: desc});
	};

        $scope.setStatusMessage = function(desc){
            $scope.vm.statusMessages = [];
            $scope.vm.errorMessages = [];
            $scope.vm.statusMessages.push({description: desc});
	};

        $scope.resetAllMessages = function(){
            $scope.vm.statusMessages = [];
            $scope.vm.errorMessages = [];
	};


        
    }])
    .directive('checkPasswordsMatch', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModel) {
                ngModel.$validators.checkPasswordsMatch = function (modelValue, viewValue) {
                    if (scope.vm && scope.vm.password && viewValue) {
                        return scope.vm.password === viewValue;
                    }
                    return true;
                };
            }
        };
    })

      .directive('ttErrorMessages', function() {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                scope.extraStyles = attrs.extraStyles;
            },
            templateUrl: 'error-messages.html'
        }
    })
      .directive('ttStatusMessages', function() {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                scope.extraStyles = attrs.extraStyles;
            },
            templateUrl: 'status-messages.html'
        }
    });
