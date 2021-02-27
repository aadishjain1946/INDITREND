inditrends.factory('singlefact', ($http, $q, Fetchreq) => {
    return {
        getprd(prd) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/getproduct', { "pid": prd }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        getcatprd(prd) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/getcatpids', { "cat": prd }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        updatecount(id) {
            let defer = $q.defer();
            $http.get(Fetchreq + '/product_user/updateclick?id=' + id).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        addtocart(size, prd) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/addtocart', { "size": size, 'pid': prd }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
    }
})