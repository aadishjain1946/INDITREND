inditrends_user.controller('headercltr', ($scope, headerfact, $window) => {
    var userdata = {};
    $scope.userlogin = false;
    var user_data = headerfact.get_user_data();
    user_data.then(data => {
        // console.log(data);
        obj = data.data;
        // console.log(obj)
        if (obj.token_result == false) {
            $scope.userlogin = false;
        } else {
            $scope.userlogin = true;
            userdata = obj.data;
            $scope.userdta = userdata;
        }
    }).catch(err => {
        console.log(err);
    })
    $scope.logout = () => {
        localStorage.USERINDITREND = JSON.stringify("nothing");
        localStorage.USERINDITREND = JSON.stringify("logout");
        localStorage.USERINDITREND = JSON.stringify("hacker fuck you");
        localStorage.USERINDITREND = JSON.stringify("don't sneek peek here");
        localStorage.USERINDITREND = JSON.stringify("shut the fuck up");
        $window.location.reload();
    }
})