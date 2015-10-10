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

var app = angular.module('mealRankApp', ['ngRoute',  'ngFileUpload', 'ngAnimate', 'mealList', 
                               'angular-datepicker', 'frontendServices', 'ngDropdowns'])

.value('googleChartApiConfig', {
            version: '1.0',
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
.config(function($routeProvider, $httpProvider) {

	// console.log("ROUTINT");
	// console.log($routeProvider);
	$routeProvider.when('/', {
		templateUrl : 'meal-list.html',
		controller : 'MealListCtrl',
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
		templateUrl : 'login.html',
		//controller : 'MealDetailCtrl',
		notInRoot: false
	}).otherwise('/'	);

    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

  })
  .factory('header',function(){
  return {notInRoot:false,
	  	viewTitle: 'RankMyFood'};
})
.run(['$rootScope', '$location', '$http', '$route',
      function ($rootScope, $location, $http, $route) {
	
 
    
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // console.log($location.path());
        // redirect to login page if trying to access
        // a secure page and not logged in
        var nextRoute = $route.routes[$location.path()];
        
            // console.log("Routing: " + nextRoute);
            
    }
    );	
    
    
   angular.element(document).on("click", function(e) {
	$rootScope.$broadcast("documentClicked", angular.element(e.target));
	});
	
		}])	
 .controller('MainCtrl', ['$rootScope', '$scope' , 'NewUserService', 'TimeService', '$timeout',
                          function ($rootScope, $scope, NewUserService, TimeService, $timeout) {
	 console.log("In MainCtrl");
	 $scope.loggingOut = false;
	 $scope.progressMesssage={"message": ""};
	 $scope.ctrlLoaded=false;
	 
	 $scope.$on('$routeChangeStart', function(next, current) { 
		 $scope.ctrlLoaded=false;
	 });
	 
	  $rootScope.isVeryGood = function(gap){
		  var ngap = parseInt(gap);
		  return (ngap>=180)&&(ngap<=300) ? true : false;
	  }
	  $rootScope.isPrettyGood = function(gap){
		  var ngap = parseInt(gap);
		  return ((ngap>=120)&&(ngap<180))||((ngap>=300)&&(ngap<=360)) ? true : false;
	  }
	  $rootScope.isNoGood = function(gap){
		  var ngap = parseInt(gap);
		  return (ngap<120)||(ngap>360) ? true : false;
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
	 NewUserService.updateUserInfo($scope);
	 
  	/* Main menu links */
	 $scope.ddMenuOptions = [
	                         {
	                        	 text: 'Latest meals',
	                        	 href: '#/'
	                         }, 
	                         {
	                        	 text: 'Compare others',
	  	                         href: '#/compare'	
	                         }, 
	                         {
	                        	 text: 'MySummary',
	  	                         href: '#/mysummary'
	                         }, 
	                         {
	                        	 text: 'Setttings',
	                        	 href: '#/settings'
	                         }, 
		                     {
	                           divider: true
	                         }, 
	                         {
	                           text: 'LOGOUT',
	                           href: '/logout'
	                         }
	                       ];

	 $scope.ddMenuSelected = {};
	                       
	 //$scope.headerData = {viewTitle: "RankMyFood", notInRoot: false};	 
	 /* If child change the header, update the view */
	 
	 $scope.$on('headerChanged', function(event, data) { 
		 $scope.headerData = data;
		 $scope.appReady=true;
	 });

	 $scope.$on('progressUpdate', function(event, data) { 
		 $scope.progressMessage = data;
		 $scope.ctrlLoaded = true;

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
		 console.log("LOGOUT B");
		 $scope.loggingOut = true;
		 NewUserService.logout();
	 }	  
  

 }])
 
 
 .controller('AppCtrl', function($scope) {
     
     

 }) .controller('MealCompareCtrl', ['$rootScope', '$scope' , '$routeParams', '$fancyModal', 'MealService', 'NewUserService', 
                                    'NewMealService', 'TimeService', 'googleChartApiPromise', '$timeout',
                                   function ($rootScope, $scope, $routeParams, $fancyModal, MealService, NewUserService, 
                                		   NewMealService, TimeService, googleChartApiPromise, $timeout) {
	 console.log("In MealCompareCtrl: ");
	 $scope.showNewMealButton = false;
	 $scope.dataLoaded = false;

	 $scope.chart = {};

	  TimeService.resetCurrentDate();
	  
	  $scope.timeRanges = [
	          {
	        	  "name":"All",
	        	  "from": $scope.oldestDate, 
	        	  "to": TimeService.currentDate00(), 
	        	  "format":  "MMM d", 
	        	  "gridCount": 6,
	        	  "pointSize": 0
	          },           
			  {
	        	  "name":"Last month",
	        	  "from": TimeService.currentDate.subtractDays(29), 
	        	  "to": TimeService.currentDate00(), 
	        	  "format":  "MMM d", 
	        	  "gridCount": 6,
	        	  "pointSize": 0
			  },
			  {
				  "name": "Last week",
				  "from": TimeService.currentDate.subtractDays(6), 
				  "to": TimeService.currentDate00(), 
				  "format":  "EEE", 
				  "gridCount": 7,
				  "pointSize": 10	
			  }
				
			  ];
	  $scope.currSel = $scope.timeRanges[0];
	  $scope.prevSel = {};
  
	$scope.changeTimeRange = function(){
		
		if( $scope.currSel == $scope.prevSel)
			return;
		
		
		console.log("Change range from " + $scope.currSel.from + " to " + $scope.currSel.to);
		$scope.chart.options.hAxis.gridlines.count = $scope.currSel.gridCount;
		var tst = $scope.currSel.from;
		tst.setDate(tst.getDate()-1);
		tst.setHours(23);
		tst.setMinutes(59);
		tst.setSeconds(0);
		$scope.chart.options.hAxis.viewWindow.min = tst;
		$scope.chart.options.hAxis.viewWindow.max = $scope.currSel.to;
		$scope.chart.options.hAxis.format = $scope.currSel.format;
		$scope.chart.options.hAxis.baseline = $scope.oldestDate;
		$scope.chart.options.pointSize = $scope.currSel.pointSize;
		$scope.prevSel = $scope.currSel;
			
	}

	var wd = document.getElementById("listScroller").offsetWidth;
	var hd = document.getElementById("listScroller").clientHeight;
	console.log("W " + wd + " H " + hd);
	$scope.cssStyle="width:100%;height:100%;";
		
	 $scope.chart.options ={
			 height: (hd/4)*3,
			 
	 
			 legend: {position: 'top', maxLines: 5, textStyle: {color: '#4d1f00'}},
             fontName: 'Racing Sans One',
             fontSize: 16,
             backgroundColor: { fill:'transparent' },
			 interpolateNulls: true,
             colors: ['#ff8a00', '#4fb2fe', '#00a7e2', '#01dc1c'],
             
             pointSize: 0,
             series: {
                   0: { pointShape: 'circle' },
                   1: { pointShape: 'square' },
                   2: { pointShape: 'triangle' },
                   3: { pointShape: 'diamond' },
                   4: { pointShape: 'star' },
                   5: { pointShape: 'polygon' }
             },

             chartArea: 
             {
            	 backgroundColor: { fill:'#fdfdfd', stroke: '#666', strokeWidth: 1},
            	 // top: 80,
            	 height: '40%',
            	 is3D: false,
            	 width: '70%'
             },
			 vAxis:{
				 textStyle:{color: '#4d1f00', is3D: false},
                 gridlines: {color: '#ccc', count:7	},
                 baselineColor: '#4d1f00',
                 baseline: 4,
                 is3D: false,
                 textPosition : 'out',
                 fontSize: 16,

                 viewWindowMode:'explicit',
                 viewWindow:{ max:10, min:4 }
			 },
			 hAxis:{
				 textStyle:{color: '#4d1f00'},
                 gridlines: {color: '#ccc', count:6},
                  baselineColor: '#4d1f00',
                  baseline: $scope.oldestDate,
                  fontSize: 14,
                  format: 'MMM d',
                  showTextEvery: 1,
                  direction:1, 
                  slantedText:true, 
                  slantedTextAngle:90,	
                  viewWindowMode:'explicit',
                  viewWindow:{ max:$scope.currSel.to, min:$scope.currSel.from }
				/* 
				    baseline: 1,
     */	
                    },
				 
	}
	 init();

	 function init(){
		 googleChartApiPromise.then(chartApiSuccess);
	 }
	 function chartApiSuccess(){
		 $scope.chart.type = 'LineChart';
		 $scope.othersData = new google.visualization.DataTable();
		 $scope.myData = new google.visualization.DataTable();
		 var cd = new google.visualization.DataTable();
		 cd.addColumn('number', 'Date');
		 cd.addColumn('number', 'Me');
		 //$scope.chart.data = cd;

		 $scope.myData.addColumn('number', 'Date');
		 $scope.myData.addColumn('number', 'Me');
		 $scope.othersData.addColumn('number', 'Date');
		 $scope.othersData.addColumn('number', 'Others');
		 
		 console.log("Google chart Api loaded");
		 dataLoad();
	 }	    

	 
	 $scope.$emit('headerChanged', {viewTitle:"Compare", notInRoot: false});
	 // For storing User model
	 $scope.um = {};
	 // For storing Group members model
	 $scope.gm = {};
    
     function dataLoad(){ 
	     NewUserService.updateUserInfoPromise().then(function(data){
	     	$scope.um = data;
	
	     	 NewMealService.searchMyRanks($scope.um.userName, 1).then(function(data){
	       		$scope.myRanks = data; 
	       		// console.log("Search my ranks");
//	       		console.log(data);
	       		$scope.myData.addRows(data);
	       		
	       		
		     	 NewMealService.searchGroupRanks($scope.um.groupName, 1).then(function(data){
			       		$scope.groupRanks = data; 
			       		$scope.othersData.addRows(data);
			       		var dataTable = google.visualization.data.join($scope.myData, $scope.othersData,
			       				'full', [[0,0]], [1], [1]);
			       		
				 
			       		console.log($scope.groupRanks);
			       		console.log($scope.myRanks);
			       		
			       		var oldestStamp = Math.min($scope.groupRanks[0][0], $scope.groupRanks[0][0]);
			       		
			       		$scope.oldestDate = new Date(oldestStamp);
			       		$scope.oldestDate.setHours(0);
			       		$scope.oldestDate.setMinutes(0);

			       		// console.log($scope.oldestDate);
			       		
			       		var view = new google.visualization.DataView(dataTable);

			       		view.setColumns([{
			       		    type: 'date',
			       		    label: dataTable.getColumnLabel(0),
			       		    calc: function (dt, row) {
			       		        var timestamp = dt.getValue(row, 0); // convert to milliseconds
			       		        var date = new Date(timestamp);
			       		        //console.log("A " + new Date(timestamp).toISOString());
			       		        date.setHours(0);
			       		        date.setMinutes(1);
			       		        date.setSeconds(0);

			       		        //console.log("B " + date);

			       		        return date;
			       		        //return new Date(2015, 7, 28, 12, 0, 0, 0);
			       		    	//return dt.getValue(row, 0);
			       		    }
			       		}, 
			       		
			       		{
			       		    type: 'number',
			       		    label: dataTable.getColumnLabel(1),
			       		    calc: function (dt, row) {
			       		        var timestamp = dt.getValue(row, 1); // convert to milliseconds
			       		        return timestamp;
			       		    }
			       		}, 
			       		
			       		{
			       		    type: 'number',
			       		    label: dataTable.getColumnLabel(2),
			       		    calc: function (dt, row) {
			       		        var timestamp = dt.getValue(row, 2); // convert to milliseconds
			       		        return timestamp;
			       		    }
			       		}
			       		]);

			       		$scope.timeRanges[0].from = $scope.oldestDate;
			       		$scope.currSel = $scope.timeRanges[0];
			       		$scope.changeTimeRange();
			       		// console.log(view);

			          	// Create a formatter.
				       	// This example uses object literal notation to define the options.
				     //  	var formatter = new google.visualization.DateFormat({formatType: 'long'});
	
				       	// Reformat our data.
				       //	formatter.format(dataTable, 1);
   		
			       		
			       		$scope.chart.options.displayed=false;
			       		$scope.chart.data = view;
			       		$scope.dataLoaded = true;
			       		// $scope.prepareData(0, $scope.groupMeals);
			       		// console.log($scope.groupRanks);
			          	$scope.$emit('progressUpdate', {message: ""});

			     });
		     	 
	       	 });
	     	 

	     	 

	
	     });
     }	

 }])
  .controller('SettingsCtrl', ['$rootScope', '$scope' , '$routeParams', '$fancyModal', 'MealService', '$timeout',
                                   function ($rootScope, $scope, $routeParams, $fancyModal, MealService, $timeout) {
	  console.log("In SettingsCtrl: " + $routeParams.mealId);
  		$scope.$emit('headerChanged', {viewTitle:"Settings", notInRoot: false});
  		 $scope.showNewMealButton = false;
     	$scope.$emit('progressUpdate', {message: ""});

 }])
  .controller('MealSummaryCtrl', ['$rootScope', '$scope' , '$routeParams', '$fancyModal', 'MealService', 
                                  'NewUserService', 'NewMealService', 'TimeService', '$timeout',
                                   function ($rootScope, $scope, $routeParams, $fancyModal, MealService, 
                                		   NewUserService, NewMealService, TimeService, $timeout) {
	  console.log("In MealSummaryCtrl: " + $routeParams.mealId);
	  $scope.$emit('headerChanged', {viewTitle:"Summary", notInRoot: false});
	  $scope.showNewMealButton = false;
	  TimeService.resetCurrentDate();

	  $scope.vm = {currSel: {"name":"Today","from": TimeService.getCurrentDate(), "to": TimeService.getCurrentDate()}};
	  $scope.vm.timeRanges = [
			  {"name":"Today","from": TimeService.getCurrentDate(), "to": TimeService.getCurrentDate()},
			  {"name":"Week","from":"all", "to": "all"},
			  {"name":"Month","from":"all", "to": "all"},
			  {"name":"All","from":"all", "to": "all"}			
			  ];
		 
	  $scope.myMeals = {};
	  $scope.formatDate = function(date){
		  return TimeService.niceDateDisplay(date);
	  }
	  $scope.formatMealGap = function(gap){
		  return TimeService.minutesToHoursAndMinutesDisplay(gap);
	  }
	  
	  
	  $scope.addDay = function(){
		  TimeService.daysForward(1);
		  // console.log(timeService.getCurrentDate());	  
		  $scope.vm.currSel = {"name":$scope.formatDate(TimeService.getCurrentDate()),"from": TimeService.getCurrentDate(), "to": TimeService.getCurrentDate()};
	  }
	  $scope.subtractDay = function(){
		  TimeService.daysBack(1);
		  // console.log(timeService.getCurrentDate());
		  $scope.vm.currSel = {"name":$scope.formatDate(TimeService.getCurrentDate()),"from": TimeService.getCurrentDate(), "to": TimeService.getCurrentDate()};
	  }
	  NewUserService.updateUserInfoPromise().then(function(data){
	     	$scope.um = data;
	     	 NewMealService.searchMyMeals($scope.um.userName, 1).then(function(data){
                 $scope.imageNames=[];
                 var inmin = data.meals[0].time.split(":"); // in minutes
                 $scope.prevTime = parseInt(inmin[0])*60 + parseInt(inmin[1]); // in minutes
                 $scope.myMeals.meals = _.map(data.meals, function (meal) {
                      meal.selected = false;
                     meal.averageRankDisplayed = $scope.plotRank(meal.averageRank, 1);
                     $scope.imageNames.push(meal.imageName); 
                     meal.imageName="noimage";
                     var inmin = meal.time.split(":"); // in minutes

                     meal.gap = $scope.prevTime - (parseInt(inmin[0])*60 + parseInt(inmin[1]));
                     $scope.prevTime = parseInt(inmin[0])*60 + parseInt(inmin[1]);
                     return meal;
                 });
                 $rootScope.timeSinceLastMeal = $rootScope.updateTimeSinceLastMeal( $scope.myMeals.meals, $scope.um);

                 for(var i=0;i<$scope.imageNames.length;i++){
                	 $scope.myMeals.meals[i].imageName = $scope.imageNames[i]; 
                 }	
             	$scope.$emit('progressUpdate', {message: ""});

	     		 
	     	 });
	     });
	        

 }])
  .controller('MealDetailCtrl', ['$rootScope', '$scope' , '$routeParams', '$fancyModal', 'MealService', '$timeout',
                                 function ($rootScope, $scope, $routeParams, $fancyModal, MealService, $timeout) {
	  console.log("In MealDetailCtrl: " + $routeParams.mealId);	
	  	$scope.showNewMealButton = false;

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
	   MealService.getMealDetails($scope.vm.mealId, $scope)
	   .then(function (data) {
		   
		   $scope.vm.errorMessages = [];
		   // console.log(data);
		   $scope.vm.meal = data;
		   $scope.viewTitle = $scope.vm.meal.categoryName; 
		   $scope.vm.meal.voteCount = $scope.vm.meal.rank.length;
           $scope.vm.meal.averageRankDisplayed = $scope.plotRank($scope.vm.meal.averageRank, 1);
           $scope.vm.meal.src = "/mealimages/lg/" + $scope.vm.meal.imageName;
           
		   $scope.$emit('headerChanged', {viewTitle:$scope.vm.meal.categoryName, notInRoot: true});
		   $scope.$emit('progressUpdate', {message: ""});

	   });
                    

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
	
  			$scope.vm.errorMessages = [];
  			// console.log(data);
  			$scope.vm.meal = data;
  			$scope.viewTitle = $scope.vm.meal.categoryName; 
  			$scope.vm.meal.voteCount = $scope.vm.meal.rank.length;
  			$scope.vm.meal.averageRankDisplayed = $scope.plotRank($scope.vm.meal.averageRank, 1);
  			$scope.vm.meal.src = "/mealimages/lg/" + $scope.vm.meal.imageName;
  		});		   
  		
  	}
    function markAppAsInitialized() {
        if ($scope.vm.appReady == undefined) {
            $scope.vm.appReady = true;
        }
       //  console.log($scope.vm.appReady);

    }
	  //    $http.get('/resource/').success(function(data) {
//      $scope.greeting = data;
//    })
  }]).controller('MealNewCtrl', ['$rootScope', '$scope' , 'Upload', '$http', '$routeParams', 'MealService', 'NewUserService', '$timeout', '$fancyModal',
                                 function ($rootScope, $scope, Upload, $http, $routeParams, MealService, NewUserService, $timeout, $fancyModal) {
	  $scope.showDetails = false;
	  $scope.showNewMealButton = false;

	  console.log("In MealNewCtrl");
	  $scope.vm = {currSel: {"name":"Snack","description":""}};
	  loadCategories();
	  $scope.imageSrc = "";

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
    	console.log("WATCH");
    }
    $scope.$watch('formData.realDate', function() {$scope.uiDate.date =  $scope.formData.realDate.getDate() + "." + ($scope.formData.realDate.getMonth() + 1) + "." + $scope.formData.realDate.getFullYear();}, true);

	$scope.vm.options = {
			format: 'dd.mm.yyyy', // ISO formatted date
			formatSubmit: 'yyyy/mm/dd', // ISO formatted date
			closeOnSelect: true,
			onClose: function(e){
				console.log("Close Pick a Date");
			}
	}
  	$scope.setFancyTime = function(){
			console.log("Set Time");
			$fancyModal.open({ showCloseButton: false, templateUrl: 'settime.html', scope: $scope });
  	};

    $scope.processForm = function() {
	    
    	console.log("Processing form...");
    	$scope.savePrompt = " Saving meal ";
		$fancyModal.open({ showCloseButton: false, templateUrl: 'savemealdialog.html', scope: $scope });

        var file = $scope.selectedFile[0];
        
        $scope.formData.categoryName = $scope.vm.currSel.name;
            $scope.upload = Upload.upload({
                url: '/api/uploadmeal',
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
            		window.location.replace('/resources/meal-rank-app.html');
            		}, 1000); 
            	
            });
        
    };	  	  

    $scope.simulateNgfSelect = function($event){
    	$event.stopPropagation();	
		console.log("NG CLICK");

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
	  $scope.$emit('progressUpdate', {message: ""});

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
			property: "@"
		},
		link: function(scope) {
			scope.listVisible = false;
			scope.clickRegistered = false;
			scope.isPlaceholder = true;

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

