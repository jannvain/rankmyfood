angular.module('loginApp', ['common'])
    .controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {
	        
        $scope.demoLogin = function(){
	    $scope.setProgressMessage("Logging in");
            $scope.vm.username = "janne";
            $scope.vm.password = "Password2";
            $scope.vm.email = "janne@janne.fi";
	    console.log("DEMO LOGIN " + $scope.vm.username);
	    $scope.credentials = $scope.vm;
	    $scope.newLogin($scope.vm);
        }
 
        
        $scope.onLogin = function () {
	    $scope.setProgressMessage("Logging in");
            console.log('Attempting login with username ' + $scope.vm.username + ' and password ' + $scope.vm.password + "form valid:" + $scope.form.$invalid);
            if ($scope.form.$invalid) {
		$scope.setErrorMessage("Complete the fields first!");
		$scope.setProgressMessage("");
                return;
            }
	    $scope.setStatusMessage("Logging in...");
            $scope.newLogin($scope.vm);

        };
    	$scope.$emit('headerChanged', {viewTitle:"Login", notInRoot: false});
//	$scope.$emit('finishLoadingCtrl', {message: ""});
        $scope.setProgressMessage("");

    }]);
