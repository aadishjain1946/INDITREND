inditrends_user.controller('signincltr', ($scope, Fetchreq, $location, $window, signinmodel) => {

    document.title = "LogIn-IndiTrend | India's Trending Fashion Hub";
    var url = $location.absUrl();
    document.querySelector('meta[property="og:url"]').setAttribute('content', url);
    document.querySelector('meta[property="og:title"]').setAttribute('content', "LogIn-IndiTrend | India's Trending Fashion Hub");

    $scope.loginwithgoogle = () => {
        window.open(Fetchreq + '/user_auth_api/googleauth', "_self");
    }
    $scope.login = (uname, pwd) => {
        if (uname && pwd) {
            $scope.loading = true;
            var login_promise = signinmodel.login(uname, pwd);
            login_promise.then(data => {
                $scope.loading = false;
                // console.log(data);
                var obj = data.data;
                if (obj.token == false) {
                    // console.log()
                    $scope.loginmsg = obj.msg;
                } else {
                    if (localStorage) {
                        localStorage.USERINDITREND = JSON.stringify(obj.token);
                        $window.open(Fetchreq + '', "_self");
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        } else {
            $scope.loginmsg = "Please fill the details.";
        }
    }
})