inditrends.factory('checkoutfact', ($http, $q, Fetchreq) => {
    return {
        get_user_data: () => {
            let defer = $q.defer();
            $http.get(Fetchreq + '/user_auth_secure/getudata').then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        }, getprd(prd) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/getprdw_id', { "prds": prd, "cat": " " }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        get_updateaddcart: (ind) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/updateaddcart', { "ind": ind }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        removecartproduct: (id, size) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/removecartproduct', { "id": id, "size": size }).then(data => {
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
        changequantity(id, prd) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/changequantity', { "index": id, "qty": prd }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        placeorderwithpayment(mode) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/initpayment', { 'paymentmode': mode }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
    }
})