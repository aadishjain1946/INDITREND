inditrends.factory('verifystatfact', ($http, $q, Fetchreq) => {
    return {
        getorderstat(ord) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/getorderdata', { "id": ord}).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
    }
})