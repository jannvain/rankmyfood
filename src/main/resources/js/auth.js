/* Based on the https://github.com/dsyer/spring-security-angular/tree/master/modular */

angular.module('auth', []).service(
    'auth', 
    
    function($http, $location, $rootScope, NewUserService) {

	enter = function() {
	    // console.log("AUTH ENTER: " + auth.newUserPath + " LOC " + $location.path());
	    if (($location.path() != auth.loginPath)&& ($location.path() != auth.newUserPath) && ($location.path() != "/")) {
		auth.path = $location.path();
		if (!auth.authenticated) {

		    /* Check whether user has just refreshed the page and authentication
		       in server-side is still valid*/

        	    $http.get('api/user')
			.then(
			    function (response) {
				// console.log("Response Status " + response.status);
				// console.log(response);
				if (response.status == 200 && response.data.userName) {
				    
				    //				$location.path(auth.path);
				
				    
				    auth.authenticated = true;
				    
				    NewUserService.userData = response.data;
				    
				    //console.log("PATH " + auth.path);
				    // console.log("AUTH STILL VALID, JUST GO AHEAD ");
				}
				else {
				    auth.authenticated = false;
				    $location.path(auth.loginPath);
				}
			    },
			    function(response){
				// console.log(response);
				auth.authenticated = false;
				$location.path(auth.loginPath);
			    }
			);


		}
	    }
	}

	var auth = {
	    
            authenticated : false,
	    
            loginPath : '/login',
            newUserPath : '/new-user',
            logoutPath : '/logout',
            homePath : '/latest',
	    
            authenticate : function(credentials, callback) {
		
		console.log("AUTH INIT");
		
        	var postData = 'username=' + credentials.username + '&password=' 
		    + credentials.password + '&email=' + credentials.email +
		    '&remember-me=true';

		$http({
                    method: 'POST',
                    url: 'authenticate',
                    data: postData,
                    headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"X-Login-Ajax-call": 'true'
                    }
		})
		.then(
		    function(response) {
			if (response.data == 'ok') {
			    auth.authenticated = true;
			    $location.path(auth.homePath);
			    callback && callback(auth.authenticated);
			}
			else {
			    auth.authenticated = false;
			    callback && callback(false);
			}
		    }
		);
	    },

            clear : function() {
		auth.authenticated = false;
		$location.path(auth.loginPath);
		$http.post(auth.logoutPath, {});
	    },
	    
            init : function(homePath, loginPath, logoutPath, newUserPath) { 
		auth.homePath = homePath;
		auth.loginPath = loginPath;
		auth.logoutPath = logoutPath;
		auth.newUserPath = newUserPath;
/*
		auth.authenticate({}, function(authenticated) {
		    if (authenticated) {
			$location.path(auth.path);
		    }
		});
*/
		$rootScope.$on('$routeChangeStart', function() {
		    enter();
		});


	    }
	    
	};

      return auth;
	
    });
