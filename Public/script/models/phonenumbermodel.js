inditrends_user.factory('phonenofactory', ($http, $q, Fetchreq) => {
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
        sendgoogleotp: (phone) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/otpsendgoogle', { "phno": phone }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        checkphoneno: (phone) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/checkphoneno', { "phno": phone }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        verifygoogleotp: (phone, code) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/otpverifygoogle', { "phno": phone, 'otp': code }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        }, phoneverify: () => {
            let defer = $q.defer();
            $http.get(Fetchreq + '/user_auth_secure/phoneverifycheck').then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        register: (phone) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/registergoogleuser', { "phno": phone }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
    };
})