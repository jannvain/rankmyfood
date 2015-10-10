angular.module('newUserApp', ['common', 'spring-security-csrf-token-interceptor'])
    .controller('NewUserCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.createUser = function () {
            console.log('Creating user with username ' + $scope.vm.username + ' and password ' + $scope.vm.password);


            if ($scope.form.$invalid) {
                $scope.vm.errorMessages = [];
                $scope.vm.errorMessages.push({description: "Fill in the fields first!"});
                return;
            }
            $scope.vm.submitted = true;

            var postData = {
                username: $scope.vm.username,
                plainTextPassword: $scope.vm.password,
                email: $scope.vm.email
            };

            $http({
                method: 'POST',
                url: '/api/user',
                data: postData,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "text/plain"
                }
            })
            .then(function (response) {
                if (response.status == 200) {
                	
                	$scope.vm.created = true;
                	setInterval(function () {$scope.login($scope.vm.userName, $scope.vm.password)}, 1000);
                	
                }
                else {
                	$scope.vm.submitted = false;
                	$scope.vm.created = false;
                	$scope.vm.errorMessages = [];
                    $scope.vm.errorMessages.push({description: response.data});
                    console.log("failed user creation: " + response.data);
                }
            });
        }
        $scope.vm.appReady=true;
    }]);