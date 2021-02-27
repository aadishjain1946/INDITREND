const inditrends_user = angular.module("inditrends_user", ['ngRoute']);
inditrends_user.constant('Fetchreq', 'http://localhost:5520');
// inditrends_user.constant('Fetchreq', 'https://inditrend.in');
inditrends_user.constant('Fetchreq_admin', 'http://localhost:5120');
inditrends_user.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
})
