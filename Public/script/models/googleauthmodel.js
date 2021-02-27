inditrends_user.factory('verifygooglefactory', ($http, $q, Fetchreq) => {
    return {
        verifyg: (uri) => {
            let defer = $q.defer();
            $http.get(Fetchreq + '/user_auth_api/authgoogle?' + uri).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        }
    };
})