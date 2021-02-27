inditrends_user.factory('registerfact', ($http, $q, Fetchreq) => {
    return {
        checkphoneno: (phone) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_api/checkphoneno', { "phno": phone }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        verifygoogleotp: (phone, code) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_api/otpverifygoogle', { "phno": phone, 'otp': code }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        sendgoogleotp: (phone) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_api/otpsendgoogle', { "phno": phone }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        register: (phone) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_api/localregister', { "userObj": phone }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        login: (uname, pwd) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_api/localauth', { "username": uname, "password": pwd }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        resetpwd: (obj) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_api/resetpwd', { "obj": obj }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
    }
})