inditrends_user.controller('verifygooglecltr', ($scope, verifygooglefactory, Fetchreq, $window) => {
    var url = window.location.href;
    var uri = url.split('?')[1];
    // console.log(uri)
    var promise = verifygooglefactory.verifyg(uri);
    promise.then(data => {
        var token = data.data;
        if (localStorage) {
            localStorage.USERINDITREND = JSON.stringify(token.token.token);
        }
        // console.log(token)
        // console.log(token.token.source)
        if (token.token.source == "signup")
            $window.open(Fetchreq + '/userauth/phonenumberverify', "_self");
        else if (token.token.source == "login") {
            $window.open(Fetchreq + '/', "_self");
        }
    }).catch(err => {
        console.log(err);
    })
})