

angular.module('frontendServices', [])
.factory('TimeService', ['$rootScope', function($rootScope) {
	timeService = {};
	timeService.pad = function(a,b){return(1e15+a+"").slice(-b)}

	timeService.currentDate = new Date();
	
	timeService.currentDate00 = function(){
		var date = timeService.currentDate;
		date.setHours(0);
		date.setMinutes(0);
		return date;
	}
	timeService.getCurrentDate = function(){
		return timeService.currentDate.getFullYear() + "/" + timeService.pad(timeService.currentDate.getMonth()+1, 2)
		+ "/" + timeService.pad(timeService.currentDate.getDate(), 2);
	}
	timeService.resetCurrentDate = function(){
		timeService.currentDate = new Date();
		console.log("Reset to current data " + timeService.currentDate);
	}

	
	timeService.daysBack = function(days){
		timeService.currentDate = timeService.currentDate.subtractDays(days);
	}
	timeService.daysForward = function(days){
		timeService.currentDate = timeService.currentDate.addDays(days);
	}
	

	timeService.timeDifferenceString = function(startTime, endTime){
		
		return "2h";
	}
	
	
	 timeService.updateTimeSinceLastMeal = function(meals, um){
		 var today = new Date();
		 
		 var currentDate = today.getFullYear() + "/" + timeService.pad(today.getMonth() + 1, 2) + "/" + timeService.pad(today.getDate(), 2);
		 
		 var currentTimeInMinutes = today.getMinutes() + today.getHours() * 60;
		 var gap=-1;
		 var notFound = true;
		 
		 _.forEach(meals, function(meal, key) {
			 // console.log(meal.userName + " " + um.userName);
			 
			 if(notFound){
				 if(um.userName == meal.userName){
					 // console.log(currentDate + " " + meal.date);
					 if(currentDate == meal.date){
						 var inmin = meal.time.split(":"); // in minutes
			             var cmpMinutes = parseInt(inmin[0])*60 + parseInt(inmin[1]); // in minutes
			                 
			             if(currentTimeInMinutes-cmpMinutes>=0){
							 // console.log(meal, key);
							 gap = currentTimeInMinutes-cmpMinutes;
							 notFound = false;
			             }    
					 }
				 }
			 }
		 });
		 return(gap);
	 }

	timeService.minutesToHoursAndMinutesDisplay = function(gap){
		var hours = parseInt(gap/60);
		var minutes = parseInt(gap % 60);
		return(hours+"h"+minutes+"m");
	}
	timeService.niceDateDisplay = function(date){
		var cToday = new Date();
		var cYesterday = new Date(cToday.getFullYear(), cToday.getMonth(), cToday.getDate()-1);
		var sToday = cToday.getFullYear() + "/" + timeService.pad(cToday.getMonth() + 1,2) + "/" + timeService.pad(cToday.getDate(),2);
		var sYesterday = cYesterday .getFullYear() + "/" + timeService.pad(cYesterday .getMonth() + 1,2) + "/" + 
		timeService.pad(cYesterday .getDate(),2);
		
		// console.log(sToday + " : " + sYesterday + " : " + date );
		
		var splitDate = date.split("/");
		if(sToday == date)
			date="Today";
		else if(sYesterday == date)
			date="Yesterday";
		else
			date = (splitDate[2] + "." + splitDate[1] + "." + splitDate[0].slice(-2));
		return date;
	}
	timeService.todayDateString = function(){
		
		var cToday = new Date();
		var sToday = cToday.getFullYear() + "/" + timeService.pad(cToday.getMonth() + 1,2) + "/" + timeService.pad(cToday.getDate(),2);
		
		return sToday;
		
	}
	return timeService;
}])
.factory('NewMealService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
	mealService = {};
	
    mealService.searchGroupMeals =  function(groupname, pageNumber) {
        var deferred = $q.defer();

        function prepareTime(time) {
            return time ? '1970/01/01 ' + time : null;
        }

        $http.get('/api/meal/',{
            params: {
                groupname: groupname,
                pageNumber: pageNumber
            }
        })
        .then(function (response) {
            if (response.status == 200) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject('Error retrieving list of meals');
            }
        });

        return deferred.promise;
    }           
    mealService.searchGroupRanks =  function(groupname, pageNumber) {
        var deferred = $q.defer();

        function prepareTime(time) {
            return time ? '1970/01/01 ' + time : null;
        }

        $http.get('/api/rankstat/',{
            params: {
                groupname: groupname,
                pageNumber: pageNumber
            }
        })
        .then(function (response) {
            if (response.status == 200) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject('Error retrieving list of ranks');
            }
        });

        return deferred.promise;
    }           
    
    mealService.searchMyMeals = function(username, pageNumber) {
        var deferred = $q.defer();

        function prepareTime(time) {
            return time ? '1970/01/01 ' + time : null;
        }

        $http.get('/api/meal/',{
            params: {
                username: username,
                pageNumber: pageNumber
            }
        })
        .then(function (response) {
            if (response.status == 200) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject('Error retrieving list of meals');
            }
        });

        return deferred.promise;
    }
    
    mealService.searchMyRanks = function(username, pageNumber) {
        var deferred = $q.defer();

        function prepareTime(time) {
            return time ? '1970/01/01 ' + time : null;
        }

        $http.get('/api/rankstat/',{
            params: {
                username: username,
                pageNumber: pageNumber
            }
        })
        .then(function (response) {
            if (response.status == 200) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject('Error retrieving list of ranks');
            }
        });

        return deferred.promise;
    }
    
    
	return mealService;
}])
.factory('NewUserService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
	service = {}
	service.userData = null;
	service.groupMembers = null;
	
	    
    service.getUserInfo = function() {
        var deferred = $q.defer();
        
        if(service.userData){
        	console.log("Get cached userdata");
        	deferred.resolve(service.userData);
        }
        else{
        	console.log("Get HTTP userdata");

        	$http.get('/api/user')
	            .then(function (response) {
	                if (response.status == 200) {
	                    deferred.resolve(response.data);
	                	service.userData = response.data;
	
	                }
	                else {
	                    deferred.reject('Error retrieving user info ' + response.status);
	                }
	        });
        }
        return deferred.promise;
    }

    service.searchGroupMembers = function(groupname) {
        var deferred = $q.defer();

        if(service.groupMembers){
        	console.log("Get cached Group data");
        	deferred.resolve(service.groupMembers);
        }
        else{

	        $http.get('/api/groupmembers/',{
	            params: {
	                groupname: groupname
	            }
	        })
	        .then(function (response) {
	            if (response.status == 200) {
	                deferred.resolve(response.data);
                	service.groupMembers = response.data;
	            }
	            else {
	                deferred.reject('Error retrieving group members');
	            }
	        });
        }
        
        return deferred.promise;
    }
    service.serviceError = function(){
    	console.log("SERVICE ERROR");
    }
    service.updateUserInfoPromise = function() {
    	return service.getUserInfo();
    }
    

    service.updateUserInfo = function(scope) {
    	service.getUserInfo()
            .then(function (userInfo) {
                scope.um = userInfo;
           	 /* Then getting the group members, adding special user ALL to cover all data */
                service.loadMyGroupMembers(scope, scope.um.groupName);
            },
            function (errorMessage) {
                showErrorMessage(errorMessage);
            });
                    
    }
    service.loadMyGroupMembers = function(scope, groupname) {
    	service.searchGroupMembers(groupname).then(function (data) {
   		 scope.gm = data;
   		 if(scope.gm[0].nickName != "ALL"){
   			scope.gm.unshift({"nickName":"Not ranked","groupName":"ALL", "ranked": true});
   			 scope.gm.unshift({"nickName":"ALL","groupName":"ALL", "ranked": false});
   		
   		 }
    	});
    }
    service.logout = function () {
        $http({
            method: 'POST',
            url: '/logout'
        })
        .then(function (response) {
            if (response.status == 200) {
            	window.location.replace('/resources/public/login.html');
            //window.location.reload();
            }
            else {
                console.log("Logout failed!");
            }
        });
    }
    /* Return service */
	return service;
	
}
])
    .service('MealService', ['$http', '$q', function($http, $q) {
        return {
        	        	
        	getMealDetails: function(mealId, scope){
                var deferred = $q.defer();

                $http.get('/api/meal/'+mealId)
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                        console.log("RETRIEVED MEAL DETAIL ", response.data)
                    }
                    else {
                        deferred.reject('Error retrieving meal details for mealId = ' + mealId);
                    }
                });                
                // console.log("SERVICE GET MEAL DETAILS");
                return deferred.promise;

        	},
        	
            getCategories: function() {
                var deferred = $q.defer();
                $http.get('/api/categories')
                    .then(function (response) {
                        if (response.status == 200) {
                        	userData = response.data;
                            deferred.resolve(response.data);
                        }
                        else {
                            deferred.reject('Error retrieving user info ' + response.status);
                        }
                });

                return deferred.promise;
            },
        	
            searchMyMeals: function(username, pageNumber) {
                var deferred = $q.defer();

                function prepareTime(time) {
                    return time ? '1970/01/01 ' + time : null;
                }

                $http.get('/api/meal/',{
                    params: {
                        username: username,
                        pageNumber: pageNumber
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                        deferred.reject('Error retrieving list of meals');
                    }
                });

                return deferred.promise;
            },
            searchGroupMeals: function(groupname, pageNumber) {
                var deferred = $q.defer();

                function prepareTime(time) {
                    return time ? '1970/01/01 ' + time : null;
                }

                $http.get('/api/meal/',{
                    params: {
                        groupname: groupname,
                        pageNumber: pageNumber
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                        deferred.reject('Error retrieving list of meals');
                    }
                });

                return deferred.promise;
            },            
            searchMeals: function(fromDate, fromTime, toDate, toTime, pageNumber) {
                var deferred = $q.defer();

                function prepareTime(time) {
                    return time ? '1970/01/01 ' + time : null;
                }

                $http.get('/api/meal/',{
                    params: {
                        fromDate: fromDate,
                        toDate: toDate,
                        fromTime: prepareTime(fromTime),
                        toTime: prepareTime(toTime),
                        pageNumber: pageNumber
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                        deferred.reject('Error retrieving list of meals');
                    }
                });

                return deferred.promise;
            },

            deleteMeals: function(deletedMealIds) {
                var deferred = $q.defer();

                $http({
                    method: 'DELETE',
                    url: '/api/meal',
                    data: deletedMealIds,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject('Error deleting meals');
                    }
                });

                return deferred.promise;
            },

            saveMeals: function(dirtyMeals) {
                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: '/api/meal',
                    data: dirtyMeals,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/plain, application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve();
                    }
                    else {
                    deferred.reject("Error saving meals: " + response.data);
                    }
                });

                return deferred.promise;
            },
            saveMeal: function(meal, scope) {
                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: '/api/newmeal',
                    data: meal,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/plain, application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve();
                    }
                    else {
                    deferred.reject("Error saving meal: " + response.data);
                    }
                });

                return deferred.promise;
            },
            rankMeal: function(rank) {
                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: '/api/newrank',
                    data: rank,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/plain, application/json"
                    }
                })
                .then(function (response) {
                    if (response.status == 200) {
                        deferred.resolve(response.data);
                    }
                    else {
                    deferred.reject("Error ranking meal: " + response.data);
                    }
                });

                return deferred.promise;
            }

            
        }
            
       
    }]);
  