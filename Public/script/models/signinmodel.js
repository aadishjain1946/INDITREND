inditrends_user.factory('signinmodel', ($q, $http, Fetchreq) => {
    return {
        login: (uname, pwd) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_api/localauth', { "username": uname, "password": pwd }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
    }
})