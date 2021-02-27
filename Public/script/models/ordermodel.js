inditrends.factory('orderfact', ($http, $q, Fetchreq) => {
    return {
        get_user_data: () => {
            let defer = $q.defer();
            $http.get(Fetchreq + '/user_auth_secure/getudata').then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        get_order_data: (ids) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/getorderdata', { "id": ids }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        get_prds_data: (ids) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/getproduct', { "pid": ids }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        cancelorder: (ids) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/cancelorder', { "id": ids }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        returnsize: (ids) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/returnsize', { "id": ids }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        returndefective: (ids, lin) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/returndefective', { "id": ids, "link": lin }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        updaterating: (prid, rat) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/updaterating', { "prid": prid, "rat": rat }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },

    }
})