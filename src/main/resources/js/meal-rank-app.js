Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    dat.setHours(0);
    dat.setMinutes(1);
    return dat;
}
Date.prototype.subtractDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() - days);
    dat.setHours(0);
    dat.setMinutes(1);
    
    return dat;
}

var app = angular.module('mealRankApp', ['ngRoute',  'ngFileUpload', 'ngAnimate', 
					 'mealList', 'common', 'loginApp', 'mealCompare',
					 'mealSummary', 'newUserApp', 
					 'angular-datepicker', 'frontendServices',
					 'ngDropdowns', 'auth'])
    .value('googleChartApiConfig', {
	version: '1.1',
	optionalSettings: {
            packages: ['corechart'] /*,
				      language: 'en'*/
        }
    })                               
    .filter('day', function () {
	return function (input, filter) {
            return _.filter(input, function (item) {
        	// console.log("in filter");
        	// console.log(filter.from);
        	// console.log(filter.to);
        	// console.log(item.date);
		
        	if(filter.from == "all")
        	    return true;
        	else
        	    return ((filter.from >= item.date)&&(filter.to<=item.date))? true: false;
            });
	}
    })
    .config(function($locationProvider, $routeProvider, $httpProvider) {
	
	$locationProvider.html5Mode(true);
	
	// console.log("ROUTINT");
	// console.log($routeProvider);
	$routeProvider
	    .when('/latest', {
		templateUrl : 'meal-list.html',
		controller : 'MealListCtrl',
		notInroot: false,
		viewTitle: 'RankMyFood',
	    }). when('/login', {
		templateUrl : 'nov2015.html',
	    controller : 'BaseFormCtrl',
		notInroot: false,
		viewTitle: 'RankMyFood',
	    }). when('/nov2015', {
		templateUrl : 'nov2015.html',
	    controller : 'BaseFormCtrl',
		notInroot: false,
		viewTitle: 'RankMyFood',
	    }). when('/new-user', {
		templateUrl : 'new-user.html',
		controller : 'BaseFormCtrl',
		notInroot: false,
		viewTitle: 'RankMyFood',
	    }).when('/meal/:mealId', {
		templateUrl : 'meal-details.html',
		controller : 'MealDetailCtrl',
		viewTitle: '...',
		notInRoot: true
	    }).when('/newmeal', {
		templateUrl : 'meal-new.html',
		controller : 'MealNewCtrl',
		viewTitle: '...',
		notInRoot: true
	    }).when('/compare', {
		templateUrl : 'compare.html',
	    controller : 'MealCompareCtrl',
		viewTitle: '...',
		notInRoot: true
	    })
	    .when('/settings', {
		templateUrl : 'settings.html',
		controller : 'SettingsCtrl',
		viewTitle: '...',
		notInRoot: true
	    }).when('/mysummary', {
		templateUrl : 'mysummary.html',
		controller : 'MealSummaryCtrl',
		viewTitle: '...',
		notInRoot: true
	    }).when('/logout', {
		templateUrl : 'nov2015.html',
		controller : 'BaseFormCtrl',
		notInRoot: false
	    }).when('/', {
		templateUrl : 'login.html',
		controller : 'BaseFormCtrl',
		notInRoot: false
	    }).otherwise('/'	);
    
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	
    })
    .factory('header',function(){
	return {notInRoot:false,
	  	viewTitle: 'RankMyFood'};
    })
    .run(['$rootScope', '$location', '$http', '$route', 'LoginService', 'NewUserService', 'auth',
	  function ($rootScope, $location, $http, $route, LoginService, NewUserService, auth) {
	      
	      auth.init('/latest', '/login', '/logout', '/new-user');
	      
	      /*    
		    $rootScope.$on('$locationChangeStart', function (event, next, current) {
		    console.log($location.path());
		    
		    // redirect to login page if trying to access
		    // a secure page and not logged in
		    var nextRoute = $route.routes[$location.path()];
		    console.log("Routing: " + nextRoute);        
		    console.log(NewUserService.userData);
		    if(!LoginService.hasAuthenticated){
		    //            $location.path('login');
		    console.log("HAS TO LOGIN");
		    }
		    else
		    console.log("READY TO GO");
		    }
		    );	
  */  
	      
	      angular.element(document).on("click", function(e) {
		  $rootScope.$broadcast("documentClicked", angular.element(e.target));
	      });
	      
	  }])	
    .controller('MainCtrl', ['$rootScope', '$scope' , 'NewUserService', 'TimeService', 'StatusService', 'auth', '$timeout', function ($rootScope, $scope, NewUserService, TimeService, StatusService, auth, $timeout) {
	console.log("In MainCtrl");
	// console.log("MAIN AUTH: " + auth.authenticated);
	// Cleaned up settings
        $scope.authenticated = function() {
            return auth.authenticated;
        }

        $scope.ctrlLoaded = false;
	$scope.progressMessage={message: ""};
//	 $scope.$on('progressUpdate', function(event, data) { 
	 $scope.$on('finishLoadingCtrl', function(event, data) { 
	     $scope.ctrlLoaded = false;
	 });

	 $scope.setProgressMessage = function(message){
	     $scope.progressMessage.message = message;
	     if(message=="")
		 $scope.ctrlLoaded = true;
	     else
		 $scope.ctrlLoaded = false;
	 }

	$scope.setProgressMessage("Initializing");
	// Cleaned up ends

	$scope.loggingOut = false;



	$rootScope.showMealClock = true;

	$scope.status = StatusService;
			      
	 $scope.$on('$routeChangeStart', function(next, current) { 
//		 $scope.ctrlLoaded=false;
	 });
	 
	  $rootScope.isVeryGood = function(gap){
		  var ngap = parseInt(gap);
		  return (ngap>=180)&&(ngap<=240) ? true : false;
	  }
	  $rootScope.isPrettyGood = function(gap){
		  var ngap = parseInt(gap);
		  return ((ngap>=120)&&(ngap<180))||((ngap>=240)&&(ngap<=300)) ? true : false;
	  }
	  $rootScope.isNoGood = function(gap){
		  var ngap = parseInt(gap);
		  return (ngap<120)||(ngap>300) ? true : false;
	  }
	  $rootScope.isVeryBad = function(gap){
		  var ngap = parseInt(gap);
		  // console.log("GAP " + ngap);
		  return (ngap<120) ? true : false;
		  
	  }

	 // For storing User model
	 $scope.um = {};
	 // For storing Group members model
	 $scope.gm = {};
	 $scope.showNewMealButton = true;
	 $rootScope.timeSinceLastMeal=-1;
	 
	 
	 $rootScope.updateTimeSinceLastMeal = function(meals, um){
		 return TimeService.updateTimeSinceLastMeal(meals, um);
	 }
	 
	 $scope.formatTimeSinceLastMeal = function(){
		 if(parseInt($scope.timeSinceLastMeal)<0)
			 return "-";
			 else return parseInt($scope.timeSinceLastMeal/60) + "h";
				 
	 }

	 /* Get logged in user data, we need his/her groupname to fetch data from other group members */
//	 NewUserService.updateUserInfo($scope);
	 
  	/* Main menu links */
	 $scope.ddMenuOptions = [
	                         {
	                        	 text: 'Latest meals',
	                        	 href: 'latest'
	                         }, 
	                         {
	                        	 text: 'Meal rankings',
	  	                         href: 'compare'	
	                         }, 
	                         {
	                        	 text: 'Meal frequencies',
	  	                         href: 'mysummary'
	                         }, 
/*	                         {
	                        	 text: 'Setttings',
	                        	 href: 'settings'
	                         }, */
		                     {
	                           divider: true
	                         }, 
	                         {
	                           text: 'LOGOUT',
	                           href: 'logout'
	                         }
	                       ];

	 $scope.ddMenuSelected = {};
	                       
	 //$scope.headerData = {viewTitle: "RankMyFood", notInRoot: false};	 
	 /* If child change the header, update the view */
	 
	 $scope.$on('headerChanged', function(event, data) { 
		 $scope.headerData = data;
	 });



	 $scope.plotRank = function(ave, ind){
		 // console.log("PLOTTING AVE RANK " + "( " +ind + " ) " + ave );
		 if(isNaN(ave))
			 return("-");
	    	
		 var dec = ave - parseInt(ave);
		 var add="";
		 if(dec>=0.75){
			 add = "-";
			 ave = ave + 1;
		 }	
		 else if(dec>= 0.5){
			 add = "\xBD";
		 }
		 else if (dec>=0.25){
			 add = "+";
		 }
		 else{
			 add = "";
		 }
		 
		 return( parseInt(ave) + add);
	 }	  
	                          
	 $scope.logout = function () {
		 // console.log("LOGOUT B");
		 $scope.loggingOut = true;
		 NewUserService.logout();
	 }	  
  

 }])
 
 
 .controller('AppCtrl', function($scope) {
     
     $rootScope.showMealClock = true;

 })
  .controller('SettingsCtrl', ['$rootScope', '$scope' , '$routeParams', '$fancyModal', 'MealService', '$timeout',
                                   function ($rootScope, $scope, $routeParams, $fancyModal, MealService, $timeout) {
	  // console.log("In SettingsCtrl: " + $routeParams.mealId);
  		$scope.$emit('headerChanged', {viewTitle:"Settings", notInRoot: false});
  		 $scope.showNewMealButton = false;

	  $rootScope.showMealClock = true;
     	// $scope.$emit('finishLoadingCtrl', {message: ""});
				       $scope.setProgressMessage("");

 }])

    .controller('MealDetailCtrl', ['$rootScope', '$scope' , '$routeParams', '$fancyModal', 'NewUserService', 'MealService', 'TimeService', '$timeout', function ($rootScope, $scope, $routeParams, $fancyModal, NewUserService, MealService, TimeService, $timeout) {
	console.log("In MealDetailCtrl: " + $routeParams.mealId);	
	$scope.showNewMealButton = false;
	$rootScope.showMealClock = false;

	$scope.user = NewUserService.userData;
	$scope.showDate = function(date){
	    if(date)
		return TimeService.niceDateDisplay(date);
	    else
		return "";
	}
        

  	$scope.deleteMeal = function(meal){
  	    console.log("Confirm delete");
  	    $fancyModal.open({showCloseButton: false,  themeClass: 'voteTheme', templateUrl: 'confirm.html', scope: $scope });
  	    
  	}
  	$scope.closeDeleteDialog = function(){
	    $fancyModal.close();   
  	    console.log("Cancel delete");	    
	}
	
	$scope.sendDelete = function(meal){
	    console.log("Deleting Meal: " + meal.id);
  	    $fancyModal.close();       
	    $scope.setProgressMessage("DElETING");
	    MealService.deleteMeals([meal.id]);

	}

	$scope.displayGender = function(gender){
	    if(gender==0)
		return "male fa-1x malecss";
	    else
		return "female fa-1x femalecss";
	}
	$scope.notInRoot = $routeParams.notInRoot,
	$scope.loggingOut = false;
	
	   $scope.hours=["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", 
	                 "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", ];
	   $scope.minutes=["00", "15", "30", "45" ];

	   tmpDate = new Date();
	   tmpMinutes = $scope.minutes[Math.floor(tmpDate.getMinutes()/15)];
	   tmpHours =  $scope.hours[tmpDate.getHours()];

       $scope.voteData = {
    		   mealId: $routeParams.mealId,
    		   voteValue: "",
    		   description: "",
    		   date: tmpDate.getFullYear() + "/" + (tmpDate.getMonth() + 1) + "/" + tmpDate.getDate(),
    		   time: tmpHours + ":" + tmpMinutes
       };
	   $scope.vm = {
			   mealId: $routeParams.mealId,

	            currentPage: 1,
	            totalPages: 0,
	            originalMeals: [],
	            meals: [],
	            isSelectionEmpty: true,
	            errorMessages: [],
	            infoMessages: []
	        };



	   $scope.fetchMealDetails = function(){
	       MealService.getMealDetails($scope.vm.mealId, $scope)
		   .then(function (data) {
		       
		       $scope.vm.errorMessages = [];
		       // console.log(data);
		       $scope.vm.meal = data;
		       $scope.viewTitle = $scope.vm.meal.categoryName; 
		       $scope.vm.meal.voteCount = $scope.vm.meal.rank.length;
		       $scope.vm.meal.averageRankDisplayed = $scope.plotRank($scope.vm.meal.averageRank, 1);
		       $scope.vm.meal.src = "mealimages/lg/" + $scope.vm.meal.imageName;
		       
		       $scope.$emit('headerChanged', {viewTitle:$scope.vm.meal.categoryName, notInRoot: true});
		       // $scope.$emit('finishLoadingCtrl', {message: ""});
		       		    $scope.setProgressMessage("");
		   });
           }

	$scope.fetchMealDetails();			     
  	markAppAsInitialized();
  	
  	$scope.vote = function(){
  			// console.log("Vote");
  	        $fancyModal.open({showCloseButton: false,  themeClass: 'voteTheme', templateUrl: 'vote.html', scope: $scope });
  		
  	}
  	$scope.closeVoteDialog = function(){
			$fancyModal.close();   
			//$scope.voteData.voteValue=7;
			//$scope.voteData.description="";
			
	}

  	$scope.sendVote = function(){
  		
  		// console.log("Voting " + $scope.voteData.voteValue);
  		MealService.rankMeal($scope.voteData, $scope)
  		.then(function (data) {
  		    $fancyModal.close();       
		    $scope.fetchMealDetails();			     	
  		});		   
  		
  	}
    function markAppAsInitialized() {

    }
	  //    $http.get('/resource/').success(function(data) {
//      $scope.greeting = data;
//    })
  }]).controller('MealNewCtrl', ['$rootScope', '$scope' , '$location', 'Upload', '$http', '$routeParams', 'MealService', 'NewUserService', '$timeout', '$fancyModal',
                                 function ($rootScope, $scope, $location, Upload, $http, $routeParams, MealService, NewUserService, $timeout, $fancyModal) {
	  $scope.showDetails = false;
	  $scope.showNewMealButton = false;
	 $scope.newView = true;
          $scope.imageChanged = function(){
	      // console.log("IMG CHANGE ");

}
	  console.log("In MealNewCtrl");
	  $scope.vm = {currSel: {"name":"Snack","description":""}};
	  loadCategories();
	  $scope.imageSrc = "";
	  $rootScope.showMealClock = false;

	 /* Set default time and date to the current time instance */
	  $scope.uploadProgress = 0;
	  $scope.uploadSteps = [0];

 	 $scope.hours=["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", 
 	               "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", ];
 	 $scope.minutes=["00", "15", "30", "45" ];

 	 tmpDate = new Date();
 	 tmpMinutes = $scope.minutes[Math.floor(tmpDate.getMinutes()/15)];
 	 tmpHours =  $scope.hours[tmpDate.getHours()];
	 $scope.uiDate = {
			 date: tmpDate.getDate() + "." + (tmpDate.getMonth() + 1) + "." + tmpDate.getFullYear(),
			 minutes: tmpMinutes,
			 hours: tmpHours,
			 time: tmpHours + ":" + tmpMinutes
	 }

	 $scope.closeSetTime = function(){
		 $fancyModal.close();
	 }
	 $rootScope.$on('$fancyModal.closed', function (e, id) {
		    $scope.uiDate.time = $scope.uiDate.hours + ":" + $scope.uiDate.minutes;
		    $scope.formData.time = $scope.uiDate.time;
		    
	 });

	 $scope.formData = {
	    		username: "", /* Username is not needed because server uses authenticated user in the session */
	  			id: null, /* New meal, getting id after saving */
	  			date: $scope.uiDate.date,
	  			realDate: new Date(),
	  			time: $scope.uiDate.time,
	  			description: "",
	  			categoryName: "Snack",
	  			imageName: "test.jpg",
	  			userId: null,
	  			ranks: []
	    };	  

	$scope.updateForm = function(){
	    $scope.uiDate.time = $scope.uiDate.hours + ":" + $scope.uiDate.minutes;
	    $scope.formData.time = $scope.uiDate.time;
	} 
    $scope.updateUiDate = function(date) {
    	$scope.uiDate.date =  date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    	// console.log("WATCH");
    }
    $scope.$watch('formData.realDate', function() {$scope.uiDate.date =  $scope.formData.realDate.getDate() + "." + ($scope.formData.realDate.getMonth() + 1) + "." + $scope.formData.realDate.getFullYear();}, true);

	$scope.vm.options = {
			format: 'dd.mm.yyyy', // ISO formatted date
			formatSubmit: 'yyyy/mm/dd', // ISO formatted date
			closeOnSelect: true,
			onClose: function(e){
				// console.log("Close Pick a Date");
			}
	}
  	$scope.setFancyTime = function(){
			// console.log("Set Time");
			$fancyModal.open({ showCloseButton: false, templateUrl: 'settime.html', scope: $scope });
  	};

    $scope.processForm = function() {
	    
    	console.log("Processing form...");
    	$scope.savePrompt = " Saving meal ";
		$fancyModal.open({ showCloseButton: false, templateUrl: 'savemealdialog.html', scope: $scope });

//        var file = $scope.selectedFile[0];
        var file = $scope.selectedFile;

        //$fancyModal.close();               
        //window.location.replace('index.html');
	// console.log("FILES " + $scope.selectedFile);
	// console.log("FILES " + $scope.selectedFile[0]);
	
        $scope.formData.categoryName = $scope.vm.currSel.name;
            $scope.upload = Upload.upload({
                url: 'api/uploadmeal',
                method: 'POST',
                data: angular.toJson($scope.formData),
                file: file
            }).progress(function (evt) {
                $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total, 10);
                // console.log("PROG " + $scope.uploadProgress);
                var n = parseInt($scope.uploadProgress/10);
                for(var i=$scope.uploadSteps.length;i<n;i++)
                	$scope.uploadSteps.push(i);
            }).success(function (data) {
            	
            	$scope.uploadProgress = 100;
            	$scope.uploadSteps = [0,1,2,3,4,5,6,7,8,9];
            	$scope.savePrompt = " Saved! ";
            	
            	setTimeout(function(){
                    $fancyModal.close();
		    // console.log("BACK TO LATEST");


		    $rootScope.$apply(function() {
			
			$location.path("/latest");
			// console.log($location.path());
		    });


		    // console.log("BACK TO LATEST 2");   
//            		window.location.replace('index.html');
            		}, 1000); 
            	
            });
        
    };	  	  

    $scope.simulateNgfSelect = function($event){
    	$event.stopPropagation();	
		// console.log("NG CLICK");

    	// console.log($event);
    	el = document.getElementById("ngfElement");
    	
    	event = document.createEvent( 'HTMLEvents' );

    	event.initEvent( 'click', true, true );
    	el.dispatchEvent( event );
 
    }
    $scope.onFileSelect = function ($files, $event) {
    	
		// console.log("Selecting file");

    	// console.log($event);
    	if(1){
    		$scope.uploadProgress = 0;
    		$scope.selectedFile = $files;
    		// console.log($files);

    		$scope.formData.imageName = $files[0];
    		$scope.imageSrc = $files[0];

	    
    	   	var file = $files;


    	   	EXIF.getData(file, function(){
   			 // console.log("READ EXIF");
   			 // console.log(this);

    			 // console.log(EXIF.pretty(this));
    		 });
   		 
    		 
    		// console.log($files[0]);
       
    	}
    };
 
    $scope.clickMenu = function (val){
     	$scope.vm.currSel = val;
     	$scope.formData.categoryName = val;
     	$scope.showDetails = ! $scope.showDetails;
     }            

    function loadCategories() {
    	MealService.getCategories().then(function (data) {
    		// console.log(data);
    		$scope.vm.categories = data;
    		$scope.vm.currSel = $scope.vm.categories[0];
  	       		});
    }	  
    
	
/************************ */	  
	  
	
	    
	    $scope.$on("fileProgress", function(e, progress) {
	      $scope.progress = progress.loaded / progress.total;
	    });	   
	    	  
	  $scope.$emit('headerChanged', {viewTitle:"New Meal", notInRoot: true});
	  // $scope.$emit('finishLoadingCtrl', {message: ""});
				     $scope.setProgressMessage("");

  }])
.directive('imageonload', function() {
    return {
        restrict: 'A',
      
        link: function(scope, element) {
          element.on('load', function() {
            // Set visibility: true + remove spinner overlay
              element.removeClass('spinner-hide');
              element.addClass('spinner-show');
              // console.log(element.parent().find('span'));
              var els = element.parent().find('span');
              // console.log(els[0]);
              // console.log(els[1]);
              
              els[0].parentElement.removeChild(els[0]);
              els[1].parentElement.removeChild(els[1]);

              
          });
          scope.$watch('ngSrc', function() {
            // Set visibility: false + inject temporary spinner overlay
              element.addClass('spinner-hide');
  
              // element.parent().append('<span class="spinner"></span>');
          });
        }
    };
})
    .directive("dropdown", function($rootScope) {
	return {
	    restrict: "E",
	    templateUrl: "dropdown.html",
	    scope: {
		placeholder: "@",
		list: "=",
		selected: "=",
		property: "@",
		control: "="
		},
	    link: function(scope) {
		scope.listVisible = false;
		scope.clickRegistered = false;
		scope.isPlaceholder = true;

		scope.internalControl = scope.control || {};
		scope.internalControl.select = function(item) {
		    scope.isPlaceholder = false;
		    scope.display =  item;
		}
		
		scope.select = function(item) {
		    scope.isPlaceholder = false;
		    scope.selected = item;
		};
		
		scope.isSelected = function(item) {
		    return item[scope.property] === scope.selected[scope.property];
		};
		
		scope.show = function() {
		    if(scope.listVisible){
			scope.clickRegistered = false;
			scope.listVisible = false;
			
			return;
		    }
		    
		    scope.listVisible = true;
		    scope.clickRegistered =true;
		    // console.log("CLICK");
		};
		
		$rootScope.$on("documentClicked", function(inner, target) {
		    // console.log("CLICK 2");
		    if(scope.clickRegistered){
			scope.clickRegistered = false;
			return;
		    }
		    if(!scope.listVisible)
			return;
		    scope.$apply(function() {
			scope.listVisible = false;
		    });
		    /*				console.log($(target[0]).is(".dropdown-display.clicked") || $(target[0]).parents(".dropdown-display.clicked").length > 0);
						if (!$(target[0]).is(".dropdown-display.clicked") && !$(target[0]).parents(".dropdown-display.clicked").length > 0)
						scope.$apply(function() {
						scope.listVisible = false;
						});*/
		});
		
		scope.$watch("selected", function(value) {
		    scope.isPlaceholder = scope.selected[scope.property] === undefined;
		    scope.display = scope.selected[scope.property];
		    
		});
	    }
	}
    });

