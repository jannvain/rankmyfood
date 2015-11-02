angular.module('mealList', []).filter('excludeDeleted', function () {
    return function (input) {
        return _.filter(input, function (item) {
	    return true;
//	    return item.deleted == undefined || !item.deleted;
        });
    }
}).filter('user', function () {
    return function (input, currSel) {
        return _.filter(input, function (item) {
	    return true;
//	    return currSel != "ALL" && currSel!="Not ranked" ? item.nickName == currSel : true;
        });
    }
}).filter('ranked', function () {
    return function (input, currSel) {
    	//console.log(currSel.nickName + " : " + item.hasVoted);
        return _.filter(input, function (item) {
            return currSel.name=="Not ranked" ? !item.hasVoted : true;
        });
    }
}).filter('rankrange', function () {
    return function (input, currSel) {	
        return _.filter(input, function (item) {
            return currSel.name!="Not ranked" ? (currSel.name=="ALL" ? true : ((item.averageRank>currSel.range.min) && (item.averageRank<currSel.range.max) && item.hasVoted)) : !item.hasVoted;
        });
    }}).controller('MealListCtrl', ['$rootScope', '$scope' , '$filter','MealService', 'NewUserService', 'TimeService', '$timeout', function ($rootScope, $scope, $filter, MealService, NewUserService, TimeService, $timeout) {
	
	$scope.showDetails = false;
	$scope.newButtonClicked=false;
	$scope.detailButtonClicked=false;
	$scope.showNewMealButton = true;
	$rootScope.showMealClock = true;
	
	console.log("In MealListCtrl ");
	$scope.setProgressMessage("Load meal list");
	$scope.um = {};
	$scope.gm = {};
	$scope.showNumOfPages=1;
	$scope.numOfItemsInPages=10;
	
	$scope.showNumOfItems = $scope.numOfItemsInPages * $scope.showNumOfPages;
	$scope.moreItems = function(){
	    if($scope.showNumOfPages<$scope.vm.totalPages){
		$scope.showNumOfPages += 1;
		$scope.showNumOfItems = $scope.numOfItemsInPages * $scope.showNumOfPages;
	    }
	    $scope.vm.currSel.touch=true;
	    //$filter('rankrange')($scope.vm.meals, $scope.vm.currSel);
	}
	
	
	$scope.refreshMealList = function(){
	    $scope.setProgressMessage("Load meal list");
	    LoadGroupMeals($scope.um.groupName, 1); // TEST WAS USER
	}
	$scope.listFilter =[
	    {"name":"ALL",range:{"min":3,"max":11}},
	    {"name":"Not ranked", range:{"min":3,"max":11}},
	    {"name":"Rank 9-10", range:{"min":8.50,"max":11}},
	    {"name":"Rank 7-8", range:{"min":6.50,"max":8.51}},
	    {"name":"Rank 4-6", range:{"min":3,"max":6.51}}
	    
	]
	$scope.vm = {
            currentPage: 1,
            totalPages: 0,
            originalMeals: [],
            meals: [],
            isSelectionEmpty: true,
            errorMessages: [],
            infoMessages: [],
            currSel: {"name":"ALL", range:{"min":3,"max":11}}
	};
	$scope.loggingOut = false;
	
	$scope.$emit('headerChanged', {viewTitle:"Latest", notInRoot: false});
	$scope.pad = function(a,b){return(1e15+a+"").slice(-b)}
	
	$scope.showDate = function(date){
	    return TimeService.niceDateDisplay(date);
	}
	NewUserService.updateUserInfoPromise().then(function(data){
            $scope.um = data;
	    // console.log("API/USER " + data.userName);
	    // console.log($scope.um);
        LoadGroupMeals($scope.um.groupName, 1); // TEST WAS USER
            NewUserService.loadMyGroupMembers($scope, $scope.um.groupName);
	});
	
	function markAppAsInitialized() {
	    
	}
	
	$scope.displayGender = function(gender){
	    if(gender==0)
		return "male malecss";
	    else
	    return "female femalecss";
	}
	function LoadGroupMeals(username, pageNumber) {
            MealService.searchGroupMeals(username, pageNumber)        
		.then(function (data) {
                    $scope.vm.errorMessages = [];
                    $scope.vm.currentPage = data.currentPage;
                    $scope.vm.totalPages = data.totalPages;
                    $scope.imageNames=[];
                    $scope.vm.meals = _.map(data.meals, function (meal) {
			meal.datetime = meal.date + ' ' + meal.time;
			meal.selected = false;
			meal.averageRankDisplayed = $scope.plotRank(meal.averageRank, 1);
			$scope.imageNames.push(meal.imageName); 
			meal.imageName="noimage";
			
			meal.voteCount = meal.rank.length;
			return meal;
                    });
                // $scope.$emit('finishLoadingCtrl', {message: ""});
		    $scope.setProgressMessage("");
                    $rootScope.timeSinceLastMeal = $rootScope.updateTimeSinceLastMeal( $scope.vm.meals, $scope.um);
		    
		    //                    $scope.vm.meals = _.cloneDeep($scope.vm.originalMeals);
		    
		    //                    _.each($scope.vm.meals, function (meal) {
		    //                        meal.selected = false;
		    //                        meal.averageRankDisplayed = $scope.plotRank(meal.averageRank, 1);
		//                    });
		    
                    markAppAsInitialized();
		    
                    if ($scope.vm.meals && $scope.vm.meals.length == 0) {
			showInfoMessage("No results found.");
                    }
                    
                    
                    setTimeout(function(){
			
			$scope.$apply(function () {
                	    for(var i=0;i<$scope.imageNames.length;i++){
                		$scope.vm.meals[i].imageName = $scope.imageNames[i]; 
                            }	
                    });
                    }	  
                	       , 500); 
                    
                    
		},
                      function (errorMessage) {
			  showErrorMessage(errorMessage);
			  markAppAsInitialized();
                      });
	}
	
	function clearMessages() {
            $scope.vm.errorMessages = [];
            $scope.vm.infoMessages = [];
	}
	
	function showInfoMessage(infoMessage) {
            $scope.vm.infoMessages = [];
            $scope.vm.infoMessages.push({description: infoMessage});
            $timeout(function () {
		$scope.vm.infoMessages = [];
            }, 1000);
	}
	$scope.pages = function () {
        return _.range(1, $scope.vm.totalPages + 1);
	};
	
	$scope.previous = function () {
            if ($scope.vm.currentPage > 1) {
		$scope.vm.currentPage-= 1;
		loadMealData($scope.vm.fromDate, $scope.vm.fromTime,
			     $scope.vm.toDate, $scope.vm.toTime, $scope.vm.currentPage);
            }
    };
	
	$scope.next = function () {
            if ($scope.vm.currentPage < $scope.vm.totalPages) {
		$scope.vm.currentPage += 1;
		loadMealData($scope.vm.fromDate, $scope.vm.fromTime,
			     $scope.vm.toDate, $scope.vm.toTime, $scope.vm.currentPage);
            }
	};
    $scope.logout = function () {
        // console.log("LOGOUT");
        NewUserService.logout();
    }
	$scope.mealDetail = function(mealId){
            MealService.getMealDetails(mealId);
	}
	
    }]);


/*
  
  $scope.goToPage = function (pageNumber) {
  if (pageNumber > 0 && pageNumber <= $scope.vm.totalPages) {
  $scope.vm.currentPage = pageNumber;
  loadMealData($scope.vm.fromDate, $scope.vm.fromTime, $scope.vm.toDate, $scope.vm.toTime, pageNumber);
  }
  };
  
  $scope.add = function () {
  $scope.vm.meals.unshift({
  id: null,
  datetime: null,
  description: null,
  selected: false,
  new: true
  });
  };
  
  $scope.delete = function () {
  var deletedMealIds = _.chain($scope.vm.meals)
  .filter(function (meal) {
  return meal.selected && !meal.new;
  })
  .map(function (meal) {
  return meal.id;
  })
  .value();
  
  MealService.deleteMeals(deletedMealIds)
  .then(function () {
  clearMessages();
  showInfoMessage("deletion successful.");
  
  _.remove($scope.vm.meals, function(meal) {
  return meal.selected;
  });
  
  $scope.selectionChanged();
  updateUserInfo();
  
  },
  function () {
  clearMessages();
  $scope.vm.errorMessages.push({description: "deletion failed."});
  });
  };
  
  $scope.reset = function () {
  $scope.vm.meals = $scope.vm.originalMeals;
  };
  
  function getNotNew(meals) {
  return  _.chain(meals)
  .filter(function (meal) {
  return !meal.new;
  })
  .value();
  }
  
  function prepareMealsDto(meals) {
  return  _.chain(meals)
  .each(function (meal) {
  if (meal.datetime) {
  var dt = meal.datetime.split(" ");
  meal.date = dt[0];
  meal.time = dt[1];
  }
  })
  .map(function (meal) {
  return {
  id: meal.id,
  date: meal.date,
  time: meal.time,
  description: meal.description,
  version: meal.version
  }
  })
  .value();
  }
  
  $scope.save = function () {
  
  var maybeDirty = prepareMealsDto(getNotNew($scope.vm.meals));
  
  var original = prepareMealsDto(getNotNew($scope.vm.originalMeals));
  
  var dirty = _.filter(maybeDirty).filter(function (meal) {
  
  var originalMeal = _.filter(original, function (orig) {
  return orig.id === meal.id;
  });
  
  if (originalMeal.length == 1) {
  originalMeal = originalMeal[0];
  }
  
  return originalMeal && ( originalMeal.date != meal.date ||
  originalMeal.time != meal.time || originalMeal.description != meal.description)
  });
  
  var newItems = _.filter($scope.vm.meals, function (meal) {
  return meal.new;
  });
  
  var saveAll = prepareMealsDto(newItems);
  saveAll = saveAll.concat(dirty);
  
  $scope.vm.errorMessages = [];
  
  // save all new items plus the ones that where modified
  MealService.saveMeals(saveAll).then(function () {
  $scope.search($scope.vm.currentPage);
  showInfoMessage("Changes saved successfully");
  updateUserInfo();
  },
  function (errorMessage) {
  showErrorMessage(errorMessage);
  });
  
  };
  
  
  }]);
  
*/




