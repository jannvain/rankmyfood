///////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Defines the javascript files that need to be loaded and their dependencies.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////

require.config({
	waitSeconds: 200,
    paths: {
        angular: 'angular/angular.min',
        angularMessages: 'angular-messages/angular-messages.min',
        angularRoute: 'angular-route/angular-route.min',
        angularAnimate: 'angular-animate/angular-animate.min',
        angularFancyModal: 'angular-fancy-modal/dist/angular-fancy-modal',
        angularDropdowns: 'angular-dropdowns/dist/angular-dropdowns',
        angularGoogleChart: 'angular-google-chart/ng-google-chart',

        ngFileUpload: 'ng-file-upload/ng-file-upload',
        ngFileUploadShim: 'ng-file-upload/ng-file-upload-shim',
        
        csrfInterceptor: 'spring-security-csrf-token-interceptor/dist/spring-security-csrf-token-interceptor.min',
        lodash: "lodash/lodash.min",
        mealList: 'meal-list',        
        mealCompare: 'meal-compare',        
        mealSummary: 'meal-summary',        
        frontendServices: 'frontend-services',
        angularDatepicker: 'angular-datepicker',
        exif: 'exif-js/exif',
        
        mealRankApp: "meal-rank-app",
        common: 'common',
        auth: 'auth',
        newUserApp: 'new-user',
        loginApp: 'login'
    },
    shim: {
        angular: {
            exports: "angular"
        },
        csrfInterceptor: {
            deps: ['angular']
        },
        angularMessages: {
            deps: ['angular']
        },
        angularRoute: {
            deps: ['angular']
        },
        angularAnimate: {
            deps: ['angular']
        },
        angularFancyModal: {
            deps: ['angular']
        },
        angularDropdowns: {
            deps: ['angular']
        },
        d3:{
        	deps: ['angular']
        },
        nvd3:{
        	deps: ['angular', 'd3']
        },
        angularjsNvd3Directives: {
            deps: ['angular', 'd3', 'nvd3']
        },
        ngFileUpload:{
        	deps: ['angular']
        },
        ngFileUploadShim:{
        	deps: ['angular']
        },        
        frontendServices: {
            deps: ['angular', 'lodash', 'csrfInterceptor']
        },
        angularDatepicker: {
            deps: ['angular', 'lodash']
        },
        angularGoogleChart:{
        	deps: ['angular']
        },

        mealList: {
            deps: [ 'lodash', 'angular', 'angularRoute', 'angularAnimate', 'frontendServices']
        },
        mealCompare: {
            deps: [ 'lodash', 'angular', 'angularRoute', 'angularAnimate', 'frontendServices']
        },
        mealSummary: {
            deps: [ 'lodash', 'angular', 'angularRoute', 'angularAnimate', 'frontendServices']
        },

        common: {
          deps: ['angular', 'angularMessages', 'auth']
        },
        auth: {
          deps: ['angular', 'frontendServices']
        },
        newUserApp: {
          deps: ['common', 'angular']
        },
        loginApp: {
            deps: [ 'angular', 'csrfInterceptor', 'common']
        },        
        mealRankApp: {
            deps: [ 'lodash', 'angular', 'angularGoogleChart', 'exif', 'angularDropdowns', 'ngFileUpload', 'ngFileUploadShim', 'angularRoute', 'angularAnimate', 'angularDatepicker', 'angularFancyModal', 'frontendServices', 'mealList', 'mealCompare', 'mealSummary', 'common', 'newUserApp', 'loginApp', 'auth']
        }
    }
});

require(['mealRankApp'], function () {

    angular.bootstrap(document.getElementById('mealRankApp'), ['ngRoute', 'googlechart', 'ngAnimate', 'vesparny.fancyModal', 'ngDropdowns', 'ngFileUpload', 'mealRankApp', 'angular-datepicker']);

});
