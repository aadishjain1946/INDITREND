inditrends.factory('categoryfact', ($http, $q, Fetchreq) => {
    return {
        getcatprd(prd, cat) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/getprdw_id', { "prds": prd, "cat": cat }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        product(cat) {
            let defer = $q.defer();
            $http.post(Fetchreq + '/product_user/getcatpids', { "cat": cat }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
    }
})