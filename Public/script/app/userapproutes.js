inditrends_user.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
    $routeProvider.when('/userauth', {
        templateUrl: '../../html/registerform.html',
    }).when('/userauth/login', {
        templateUrl: '../../html/loginform.html'
    }).when('/userauth/register', {
        templateUrl: '../../html/registerform.html',
    }).when('/userauth/phonenumberverify', {
        templateUrl: '../../html/phonenumer.html',
    }).when('/edit/:id', {
        templateUrl: 'products/html/edit.html'
    }).when('/category', {
        templateUrl: 'products/html/category.html'
    })
    // $locationProvider.html5Mode(true);
})