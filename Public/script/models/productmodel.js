inditrends.factory('productfactory', ($http, $q, Fetchreq) => {
    return {
        trend_product() {
            let defer = $q.defer();
            $http.get(Fetchreq + '/product_user/gettrenpid').then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        }, top_product() {
            let defer = $q.defer();
            $http.get(Fetchreq + '/product_user/gettoppid').then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        }, gettrendcatprd(prd) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/getprdw_id', { "prds": prd, "cat": "Trending" }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        gettopcatprd(prd) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/getprdw_id', { "prds": prd, "cat": "Top" }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        getarrcatprd() {
            let defer = $q.defer();
            $http.get(Fetchreq + '/product_user/getarrprdw_id',).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        }, user_data() {
            let defer = $q.defer();
            $http.get(Fetchreq + '/user_auth_secure/getudata').then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        addtowishlist(prd) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/addtowishlist', { "prds": prd }).then(data => {
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