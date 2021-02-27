const inditrends = angular.module("inditrends", ['ngRoute']);
inditrends.constant('Fetchreq', 'http://localhost:5520');
// inditrends.constant('Fetchreq', 'https://inditrend.in');
inditrends.constant('Fetchreq_admin', 'http://localhost:5120');
inditrends.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
})