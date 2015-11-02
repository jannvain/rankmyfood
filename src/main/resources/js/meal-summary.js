angular.module('mealSummary', [])


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

.controller('MealSummaryCtrl', ['$rootScope', '$scope' , '$routeParams', '$fancyModal', 'MealService', 'NewUserService', 'NewMealService', 'TimeService', '$timeout', 'googleChartApiPromise', function ($rootScope, $scope, $routeParams, $fancyModal, MealService, NewUserService, NewMealService, TimeService, $timeout, googleChartApiPromise) {
    console.log("In MealSummaryCtrl: " + $routeParams.mealId);
    $scope.setProgressMessage("Load meal gaps");
    $rootScope.showMealClock = true;    
    $scope.showNewMealButton = false;
    $scope.dataLoaded = false;
    $scope.chart = {};
    $scope.myMeals = {};
    // For storing User model
    $scope.um = {};
    
    TimeService.resetCurrentDate();
    $scope.$emit('headerChanged', {viewTitle:"Meal Frequency", notInRoot: false});

    $scope.timeRanges = [
	{
	    "stat":false, 
	    "name":"Today",
	    "from": TimeService.getCurrentDate(), 
	    "to": TimeService.getCurrentDate(),
	    "format":  "", 
	    "gridCount": 7,
	    "pointSize": 0	
	},
/*
	{
	    "stat":true, 
	    "name":"Week",
	    "from": TimeService.currentDate.subtractDays(6),
	    "to": TimeService.currentDate00(), 
	    "format":  "EEE",
	    "gridCount": 6, 
	    "pointSize": 10	
	},
	{
	    "stat": true, 
	    "name":"Month",
	    "from": TimeService.currentDate.subtractDays(29), 
	    "to": TimeService.currentDate00(), 
	    "format":  "MMM d", 
	    "gridCount": 6,
	    "pointSize": 0	
	},*/
	{
	    "stat":true, 
	    "name":"All",
	    "from": $scope.oldestDate,  
	    "to": TimeService.currentDate00(), 
	    "format":  "MMM d", 
	    "gridCount": 6,
	    "pointSize": 0	
	}
    ];

    $scope.currSel = $scope.timeRanges[0];
    $scope.prevSel = null;

    $scope.changeTimeRange = function(){
	if( $scope.currSel == $scope.prevSel)
	    return;
	console.log("Change range from " + $scope.currSel.from + " to " + $scope.currSel.to);

	if($scope.currSel.name != "Today"){
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
	    if($scope.prevSel){ 
//		console.log("PLOTTING");
//		console.log($scope.chart.options);
//		console.log($scope.chart.data);
		$scope.visibleChart = {};		
	    $scope.visibleChart.type = 'ComboChart';
		$scope.visibleChart.options = $scope.gapChartOptions;
		$scope.visibleChart.data = $scope.chart.data;		
		
	    }
	}
	$scope.prevSel = $scope.currSel;

    }

    var wd = document.getElementById("listScroller").offsetWidth;
    var hd = document.getElementById("listScroller").clientHeight;
    // console.log("W " + wd + " H " + hd);
    $scope.cssStyle="width:100%;height:100%;";

    $scope.gapChartOptions = {
	height: (hd/4)*3,
	legend: {position: 'top', maxLines: 5, textStyle: {color: '#4d1f00'}},
        fontName: 'Racing Sans One',
        fontSize: 16,

        isStacked: true,

        backgroundColor: { fill:'transparent' },
	interpolateNulls: true,
        colors: ['#ff8a00', '#4fb2fe', '#cb6683', '#ffb580', '#c8dc6e', '#ffb580', '#cb6683'],

        pointSize: 0,
        series: {
            0: { pointShape: 'circle',
                type: 'line'
	       },
            1: { pointShape: 'square',
	         type: 'line'
	       },
            2: { pointShape: 'triangle',
		 type: 'area' ,
                 lineWidth: 0,
                 visibleInLegend: false,
		 enableInteractivity: false, 
		 tooltip: 'none'
	       },
            3: { pointShape: 'diamond',
		 type: 'area',
                 lineWidth: 0,
                 visibleInLegend: false,
		 enableInteractivity: false, 
		 tooltip: 'none'
	       },
            4: { pointShape: 'star',
		 type: 'area',
                 lineWidth: 0,
                 visibleInLegend: false,
		 enableInteractivity: false, 
		 tooltip: 'none'
	       },
            5: { pointShape: 'polygon',
		 type: 'area',
                 lineWidth: 0,
                 visibleInLegend: false,
		 enableInteractivity: false, 
		 tooltip: 'none'
	       },
            6: { pointShape: 'polygon',
		 type: 'area',
                 lineWidth: 0,
                 visibleInLegend: false,
		 enableInteractivity: false, 
		 tooltip: 'none'
	       }
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
            slantedTextAngle:90 /*,	
            viewWindowMode:'explicit',
            viewWindow:{ max:$scope.currSel.to, min:$scope.currSel.from }*/
	}
    }

    $scope.chart.options ={
	height: (hd/4)*3,
	legend: {position: 'top', maxLines: 5, textStyle: {color: '#4d1f00'}},
        fontName: 'Racing Sans One',
        fontSize: 16,
        backgroundColor: { fill:'transparent' },
	interpolateNulls: true,
        colors: ['#ff8a00', '#4fb2fe', '#cb6683', '#ffb580', '#ffb580', '#ffb580', '#cb6683'],
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
            baseline: 0,
            is3D: false,
            textPosition : 'out',
            fontSize: 16 /*,
            viewWindowMode:'explicit',
            viewWindow:{ max:10, min:4 }*/
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
	},
    }

    init();
    function init(){
	googleChartApiPromise.then(chartApiSuccess);
    }

    function chartApiSuccess(){
	$scope.chart.type = 'ComboChart';
	$scope.othersData = new google.visualization.DataTable();
	$scope.myData = new google.visualization.DataTable();
	$scope.myData.addColumn('number', 'Date');
	$scope.myData.addColumn('number', 'Me');
	$scope.othersData.addColumn('number', 'Date');
	$scope.othersData.addColumn('number', 'Others');


	console.log("Google chart Api loaded");
	dataLoad();
    }


/*********/
    
    $scope.formatDate = function(date){
	return TimeService.niceDateDisplay(date);
    }
    $scope.formatMealGap = function(gap){
	return TimeService.minutesToHoursAndMinutesDisplay(gap);
    }
    $scope.addDay = function(){
	TimeService.daysForward(1);
	$scope.currSel.name = $scope.formatDate(TimeService.getCurrentDate());
	$scope.currSel.from = TimeService.getCurrentDate();
	$scope.currSel.to =  TimeService.getCurrentDate();
    }
    $scope.subtractDay = function(){
	TimeService.daysBack(1);

	$scope.currSel.name = $scope.formatDate(TimeService.getCurrentDate());
	$scope.currSel.from = TimeService.getCurrentDate();
	$scope.currSel.to =  TimeService.getCurrentDate();

    }
    
    dataLoad = function(){

//	console.log("Trying to load user data");
	NewUserService.updateUserInfoPromise().then(function(data){
	    $scope.um = data;
//	    console.log("User data loaded");

//	    console.log("Trying to load my gap data");	    
	    NewMealService.searchMyGapStat($scope.um.userName, 1).then(function(data){
//		console.log(data);
//	    console.log("My gap data loaded");
		$scope.myData.addRows(data);
		$scope.myGaps = data;
//		console.log("Trying to load group gap data");	    		
		NewMealService.searchGroupGapStat($scope.um.groupName, 1).then(function(data){
//		    console.log("Group gap data loaded");
//		    console.log(data);
		    $scope.othersData.addRows(data);
		    var dataTable = new google.visualization.data.join($scope.myData, $scope.othersData,
			       					   'full', [[0,0]], [1], [1]);
		    
		    var nr = dataTable.getNumberOfRows();

//		    $scope.bandData = new google.visualization.DataTable();
		    
		    dataTable.addColumn('number', 'red band 1');
		    dataTable.addColumn('number', 'orange band 1');
		    dataTable.addColumn('number', 'Green band');
		    dataTable.addColumn('number', 'orange band 2');
		    dataTable.addColumn('number', 'red band 2');
		    
		    for(var i=1; i < nr;i++){
			dataTable.setCell(i,3, 120);
			dataTable.setCell(i,4, 60);
			dataTable.setCell(i,5, 60);
			dataTable.setCell(i,6, 60);
			dataTable.setCell(i,7, 120);
		    } 

		    
//		    console.log($scope.bandData);

		    


//		    var oldestStamp = $scope.myGaps[0] ? Math.min($scope.myGaps[0][0], data[0][0]) : data[0] ? data[0][0] : null;
		    
		    var oldestStamp = $scope.myGaps[0] ? ( data[0] ? Math.min($scope.myGaps[0][0], data[0][0]) : $scope.myGaps[0][0] ) : (data[0] ? data[0][0]: null);


		    $scope.oldestDate = new Date(oldestStamp);
		    $scope.oldestDate.setHours(0);
		    $scope.oldestDate.setMinutes(0);
		    // console.log("Create google data view");
		    var view = new google.visualization.DataView(dataTable);
		    var timeConvert = function(n){
			var minutes = n%60
			var hours = (n - minutes) / 60
			//console.log(hours + ":" + minutes)
			return([ hours, minutes, 0, 0]);
		    }

		    view.setColumns([
			{
			    type: 'date',
			    label: dataTable.getColumnLabel(0),
			    calc: function (dt, row) {
				var timestamp = dt.getValue(row, 0); // convert to milliseconds
				var date = new Date(timestamp);
				// console.log("A " + timestamp);
				// console.log("A " + new Date(timestamp).toISOString());
				date.setHours(0);
				date.setMinutes(1);
				date.setSeconds(0);
				// console.log("A " + new Date(timestamp).toISOString());
				return date;
			    }
			}, 
			{
			    type: 'timeofday',
			    label: dataTable.getColumnLabel(1),
			    calc: function (dt, row) {
				var timestamp = dt.getValue(row, 1); // convert to milliseconds


				// console.log("B " + timestamp);
				return timeConvert(timestamp);

			    }
			}, 
			
			{
			    type: 'timeofday',
			    label: dataTable.getColumnLabel(2),
			    calc: function (dt, row) {
				var timestamp = dt.getValue(row, 2); // convert to milliseconds
				//console.log("C " + timestamp);
				return timeConvert(timestamp);
			    }
			},
			{
			    type: 'timeofday',
			    
			    label: dataTable.getColumnLabel(3),
			    calc: function (dt, row) {
				var timestamp = dt.getValue(row, 3);
				return timeConvert(timestamp);
			    }
			},
			{
			    type: 'timeofday',
			    
			    label: dataTable.getColumnLabel(4),
			    calc: function (dt, row) {
				var timestamp = dt.getValue(row, 4);
				return timeConvert(timestamp);
			    }
			},
			{
			    type: 'timeofday',
			    
			    label: dataTable.getColumnLabel(5),
			    calc: function (dt, row) {
				var timestamp = dt.getValue(row, 5);
				return timeConvert(timestamp);
			    }
			},
			{
			    type: 'timeofday',
			    
			    label: dataTable.getColumnLabel(6),
			    calc: function (dt, row) {
				var timestamp = dt.getValue(row, 6);
				return timeConvert(timestamp);
			    }
			},
			{
			    type: 'timeofday',
			    
			    label: dataTable.getColumnLabel(7),
			    calc: function (dt, row) {
				var timestamp = dt.getValue(row, 7);
				return timeConvert(timestamp);
			    }
			}
		    ]);
		    
		    $scope.timeRanges[1].from = $scope.oldestDate;
		    $scope.currSel = $scope.timeRanges[0];
		    // console.log("Google chart data loaded and setup");
		    $scope.changeTimeRange();
		    $scope.chart.options.displayed=false;
		    $scope.chart.data = view;
		    $scope.dataLoaded = true;
		    // $scope.$emit('finishLoadingCtrl', {message: ""});
		    $scope.setProgressMessage("");
		});
	    });
	    
	    NewMealService.searchMyMeals($scope.um.userName, 1).then(function(data){
		$scope.imageNames=[];
		if(data.meals[0] == null)
		    return [];
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
		//		     console.log($scope.myMeals.meals);
		$rootScope.timeSinceLastMeal = $rootScope.updateTimeSinceLastMeal( $scope.myMeals.meals, $scope.um);
		
		for(var i=0;i<$scope.imageNames.length;i++){
                    $scope.myMeals.meals[i].imageName = $scope.imageNames[i]; 
		}	
		// $scope.$emit('finishLoadingCtrl', {message: ""});
		$scope.setProgressMessage("");
	    });
	});
    }

}])
