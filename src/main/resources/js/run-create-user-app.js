///////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Defines the javascript files that need to be loaded and their dependencies.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////

require.config({
    paths: {
        angular: 'angular/angular',
        angularMessages: 'angular-messages/angular-messages',
        csrfInterceptor: 'spring-security-csrf-token-interceptor/dist/spring-security-csrf-token-interceptor.min',
        lodash: "lodash/dist/lodash",
        common: 'common',
        createUserApp: 'new-user'
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
        common: {
          deps: ['angular', 'csrfInterceptor', 'angularMessages']
        },
        createUserApp: {
            deps: [ 'common']
        }
    }
});

require(['createUserApp'], function () {

    angular.bootstrap(document.getElementById('createUserApp'), ['newUserApp']);

});