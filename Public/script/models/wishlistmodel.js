inditrends.factory('wishlistfact', ($http, $q, Fetchreq) => {
    return {
        user_data() {
            let defer = $q.defer();
            $http.get(Fetchreq + '/user_auth_secure/getudata').then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        getwishlistprds(id) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/getproductid', { "id": id }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        removetowishlist(prd) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/removetowishlist', { "prds": prd }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
    }
})