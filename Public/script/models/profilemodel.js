inditrends.factory('profilefact', ($http, $q, Fetchreq) => {
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
        nameemail: (name, email) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/updatename_email', { 'name': name, 'email': email }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        newaddress: (add) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/addnewadd', { 'add': add }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        updateaddress: (add) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/updateaddress', { 'add': add }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        deleteaddress: (index) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/deleteaddress', { 'index': index }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        setdefaultaddress: (index) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/setdefaultaddress', { 'index': index }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        },
        changepassword: (curr, pwd) => {
            let defer = $q.defer();
            $http.post(Fetchreq + '/user_auth_secure/changeuserpassword', { 'curr': curr, 'newpwd': pwd }).then(data => {
                defer.resolve(data);
            }, (err) => {
                defer.reject(data);
            })
            return defer.promise;
        }
    }
})