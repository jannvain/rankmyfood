angular.module('mealCompare', []).controller('MealCompareCtrl', ['$rootScope', '$scope' , '$routeParams', '$fancyModal', 'MealService', 'NewUserService',  'NewMealService', 'TimeService', 'googleChartApiPromise', '$timeout', function ($rootScope, $scope, $routeParams, $fancyModal, MealService, NewUserService, NewMealService, TimeService, googleChartApiPromise, $timeout){
    
    console.log("In MealCompareCtrl: ");

    $scope.setProgressMessage("Load rankings");
    $scope.showNewMealButton = false;
    $scope.dataLoaded = false;
    $scope.chart = {};
    $rootScope.showMealClock = true;
    // For storing User model
    $scope.um = {};
    
    TimeService.resetCurrentDate();
    $scope.$emit('headerChanged', {viewTitle:"Rankings", notInRoot: false});

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
	$scope.visibleChart = $scope.chart;	
    }
    
    
    var wd = document.getElementById("listScroller").offsetWidth;
    var hd = document.getElementById("listScroller").clientHeight;
    // console.log("W " + wd + " H " + hd);
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
	$scope.myData.addColumn('number', 'Date');
	$scope.myData.addColumn('number', 'Me');
	$scope.othersData.addColumn('number', 'Date');
	$scope.othersData.addColumn('number', 'Others');
	console.log("Google chart Api loaded");
	dataLoad();
    }	    

    /*********/
    
    function dataLoad(){ 
	NewUserService.updateUserInfoPromise().then(function(data){
	    $scope.um = data;
	    
	    NewMealService.searchMyRanks($scope.um.userName, 1).then(function(data){
	       	$scope.myRanks = data; 
		// console.log(data);
	       	$scope.myData.addRows(data);
	       	
	       	
		NewMealService.searchGroupRanks($scope.um.groupName, 1).then(function(data){
		    $scope.groupRanks = data; 
		    $scope.othersData.addRows(data);
		    var dataTable = new google.visualization.data.join($scope.myData, $scope.othersData,
			       					       'full', [[0,0]], [1], [1]);
		    
		    var oldestStamp = $scope.myRanks[0] ? ( $scope.groupRanks[0] ? Math.min($scope.myRanks[0][0], $scope.groupRanks[0][0]) : $scope.myRanks[0][0] ) : ($scope.groupRanks[0] ? $scope.groupRanks[0][0]: null);
		    
		    $scope.oldestDate = new Date(oldestStamp);
		    $scope.oldestDate.setHours(0);
		    $scope.oldestDate.setMinutes(0);
		    
		    var view = new google.visualization.DataView(dataTable);
		    view.setColumns([{
			type: 'date',
			label: dataTable.getColumnLabel(0),
			calc: function (dt, row) {
			    var timestamp = dt.getValue(row, 0); // convert to milliseconds
			    var date = new Date(timestamp);
			    //console.log("A " + new Date(timestamp).toISOString());
			    // console.log("A " + new Date(timestamp).toISOString());
			    date.setHours(0);
			    date.setMinutes(1);
			    date.setSeconds(0);
			    // console.log("A " + new Date(timestamp).toISOString());
			    return date;
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
		    $scope.chart.options.displayed=false;
		    $scope.chart.data = view;
		    $scope.dataLoaded = true;
		    $scope.setProgressMessage("");
		    
		});
		
	    });
	});
    }	
}]);

