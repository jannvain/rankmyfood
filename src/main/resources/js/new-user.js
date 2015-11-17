angular.module('newUserApp', ['common'])
    .controller('NewUserCtrl', ['$scope', '$http', function ($scope, $http) {

	$scope.setProgressMessage("New user");

        $scope.createUser = function () {
            console.log('Creating user with username ' + $scope.vm.username + ' and password ' + $scope.vm.password + "form valid:" + $scope.form.$invalid);

            if ($scope.form.$invalid) {

                $scope.setErrorMessage("Complete the fields first!");
		console.log("NEW USER SET ERROR " + $scope.vm.errorMessages);		
                return;
            }
            $scope.vm.submitted = true;
	    
            var postData = {
                username: $scope.vm.username,
                plainTextPassword: $scope.vm.password,
                email: $scope.vm.email,
                gender: $scope.vm.gender
            };

            $http({
                method: 'POST',
                url: 'api/user',
                data: postData,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "text/plain"
                }
            })
		.then(
		    function (response) {
			if (response.status == 200) {
                	    console.log("SUCCESS : " + response.status);
                	    $scope.vm.created = true;
                	    setTimeout(function () {$scope.newLogin($scope.vm)}, 1000);
			    $scope.setStatusMessage("User Created");
			}
			else {
			    console.log("FAILURE : " + response.status);
			    $scope.vm.submitted = false;
			    $scope.vm.created = false;
			    $scope.setErrorMessage(response.data);
			    console.log("failed user creation: " + response.data);
			}

		    },
		    
		    function (response) {
			if (response.status == 409) {
			    console.log("FAILURE : " + response.status);
			    $scope.vm.submitted = false;
			    $scope.vm.created = false;
			    $scope.setErrorMessage(response.data);
			    $scope.vm.username = "";
			    $scope.vm.password = "";
			    $scope.vm.confirmPassword = "";
			    console.log("failed user creation: " + response.data);
			    
			}
			else {
			    console.log("FAILURE : " + response.status);
			    $scope.vm.submitted = false;
			    $scope.vm.created = false;
			    $scope.setErrorMessage(response.data);
			    $scope.vm.username = "";
			    $scope.vm.password = "";
			    $scope.vm.confirmPassword = "";
			    console.log("failed user creation2: " + response.data);
			}
		    }
		    
		);
        }
    	$scope.$emit('headerChanged', {viewTitle:"New User", notInRoot: false});
	$scope.setProgressMessage("");
    }]);
