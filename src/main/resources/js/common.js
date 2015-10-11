angular.module('common', ['ngMessages'])
    .controller('BaseFormCtrl', ['$scope', '$http', function ($scope, $http) {

        var fieldWithFocus;

        $scope.vm = {
            submitted: false,
            appReady: false,
            errorMessages: []
        };

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

     $scope.directLogin = function (userName, password) {
        	
        	var email = "janne@kk.fi";
        	var postData = 'username=' + userName + '&password=' + password + '&email=' + email;
          	$scope.vm.submitted = true;

            $http({
                method: 'POST',
                url: '/eatingchallenge/authenticate',
                data: postData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Login-Ajax-call": 'true'
                }
            })
            .then(function(response) {
                if (response.data == 'ok') {
                	window.location.replace('index.html');
                }
                else {
                    $scope.vm.errorMessages = [];
                    $scope.vm.errorMessages.push({description: 'Access denied'});
                    $scope.vm.username = "";
                    $scope.vm.password = "";

                    $scope.vm.submitted = false;
                }
            });

        };
        
        $scope.login = function (username, password) {
        	$scope.vm.submitted = true;

            var postData = $scope.preparePostData();

            $http({
                method: 'POST',
                url: '/eatingchallenge/authenticate',

                data: postData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Login-Ajax-call": 'true'
                }
            })
            .then(function(response) {
                if (response.data == 'ok') {
                	window.location.replace('index.html');

                }
                else {
                    $scope.vm.errorMessages = [];
                    $scope.vm.errorMessages.push({description: 'Access denied'});
                    $scope.vm.username = "";
                    $scope.vm.password = "";

                    $scope.vm.submitted = false;
                }
            });

        }
        
        
     
        
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
    });
