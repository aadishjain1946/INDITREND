inditrends.factory('headerfact', ($http, $q, Fetchreq) => {
    return {
        get_user_data: () => {
            let defer = $q.defer();
            $http.get(Fetchreq + '/user_auth_secure/getudata').then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        }
    }

})