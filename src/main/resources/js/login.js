angular.module('loginApp', ['common', 'spring-security-csrf-token-interceptor'])
    .controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {

  
        
        $scope.demoLogin = function(){
        	$scope.vm.userName = "janne";
        	$scope.vm.password = "Password2";
        	$scope.directLogin("janne", "Password2");
        }
 
        
        $scope.onLogin = function () {
            console.log('Attempting login with username ' + $scope.vm.username + ' and password ' + $scope.vm.password);
            if ($scope.form.$invalid) {
                $scope.vm.errorMessages = [];
                $scope.vm.errorMessages.push({description: "Fill in the fields first!"});
                return;
            }

            $scope.login($scope.vm.userName, $scope.vm.password);

        };
        $scope.vm.appReady = true; // Disable wait spinner        
    }]);
