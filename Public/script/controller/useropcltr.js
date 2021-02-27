inditrends_user.controller('registercltr', ($scope, Fetchreq, $location, $window, registerfact) => {

    // VARIABLES
    $scope.phoneverifycheck = "We'll never share your details with anyone else.";
    $scope.otpverify = "OTP Sent.Please turn off DND(Do Not Disturb) mode incase OTP not received."
    var verified_phonenumber = -1;
    var timeLeft = 120;
    var timerId;
    $scope.passwordreset = true;
    $scope.sendotpcicked = false;
    $scope.verifyotpcicked = false;
    $scope.resendotpcicked = false;
    $scope.registercicked = false;


    document.title = "Register-IndiTrend | India's Trending Fashion Hub";
    var url = $location.absUrl();
    document.querySelector('meta[property="og:url"]').setAttribute('content', url);
    document.querySelector('meta[property="og:title"]').setAttribute('content', "Register-IndiTrend | India's Trending Fashion Hub");

    function countdown() {
        if (timeLeft == -1) {
            clearTimeout(timerId);
            document.getElementById("resendbtn").disabled = false;
        } else {
            document.getElementById("time").innerHTML = parseInt(timeLeft / 60) + ":" + parseInt(timeLeft % 60);
            timeLeft--;
        }
    }

    $scope.loginwithgoogle = () => {
        window.open(Fetchreq + '/user_auth_api/googleauth', "_self");
    }

    $scope.getopt = (pno) => {
        var checkpno_promise = registerfact.checkphoneno(pno);
        $scope.phoneverifycheck = "";
        $scope.sendotpcicked = true;
        checkpno_promise.then(data => {
            // console.log(data.data)
            $scope.sendotpcicked = false;
            let phonever_obj = data.data;
            if (!phonever_obj.verified) {
                document.getElementById('exampleInputPassword1').classList.add('is-invalid');
                document.getElementById('exampleInputPassword1').classList.remove('is-valid');
                $scope.phoneverifycheck = phonever_obj.message;
                $scope.sendotp = false;
            } else {
                $scope.sendotp = true;
                document.getElementById('exampleInputPassword1').classList.add('is-valid');
                document.getElementById('exampleInputPassword1').classList.remove('is-invalid');
                timerId = setInterval(countdown, 1000);
                document.getElementById("sendotpadj").disabled = true;
                var otp_promise = registerfact.sendgoogleotp(pno);
                otp_promise.then(data => {
                    // console.log(data);
                    $scope.sendotp = true;
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch(err => {
            console.log(err);
        })
    }
    $scope.getoptforreset = (pno) => {

        $scope.sendotp = true;
        document.getElementById('exampleInputPassword1').classList.add('is-valid');
        document.getElementById('exampleInputPassword1').classList.remove('is-invalid');
        timerId = setInterval(countdown, 1000);
        document.getElementById("sendotpadj").disabled = true;
        var otp_promise = registerfact.sendgoogleotp(pno);
        otp_promise.then(data => {
            // console.log(data);
            $scope.sendotp = true;
        }).catch(err => {
            console.log(err);
        })
    }
    $scope.verifyotp = (phone) => {
        $scope.verifyotpcicked = true;
        var code = document.getElementById('exampleInput1').value;
        var otp_promise = registerfact.verifygoogleotp(phone, code);
        otp_promise.then(data => {
            // console.log(data);
            $scope.verifyotpcicked = false;
            var obj = data.data;
            if (obj.verified) {
                clearTimeout(timerId);
                document.getElementById("resendbtn").disabled = true;
                document.getElementById("verifyotpbtn").disabled = true;
                document.getElementById('exampleInput1').classList.remove('is-invalid');
                document.getElementById('exampleInput1').classList.add('is-valid');
                document.getElementById("sendotpadj").disabled = true;
                $scope.optstatusverify = "OTP VERIFIED";
                $scope.otpverify = "";
                verified_phonenumber = phone;
                if (localStorage) {
                    localStorage.PHONENUMBERINDITREND = 1234567890;
                    localStorage.PHONENUMBERINDITREND = 0987654321;
                    localStorage.PHONENUMBERINDITREND = phone;
                }
            } else {
                document.getElementById('exampleInput1').classList.remove('is-valid');
                document.getElementById('exampleInput1').classList.add('is-invalid');
                $scope.otpverify = "INVALID OTP";
            }
        }).catch(err => {
            console.log(err);
        })
    }
    function loginlocal(uname, pwd) {
        var login_promise = registerfact.login(uname, pwd);
        login_promise.then(data => {
            var token = data.data.token;
            if (localStorage) {
                localStorage.USERINDITREND = JSON.stringify(token);
                $window.open(Fetchreq + '', "_self");
            }
        }).catch(err => {
            console.log(err);
        })
    }
    $scope.register = (name, valid) => {
        $scope.registercicked = true;
        if (valid && name) {
            if (verified_phonenumber != -1) {
                var obj = {};
                obj.phnumber = verified_phonenumber;
                if (localStorage) {
                    if (localStorage.PHONENUMBERINDITREND != verified_phonenumber) {
                        $scope.finalsubmit = "Please verify you phone number first."
                        return;
                    } else {
                        obj.phnumber = localStorage.PHONENUMBERINDITREND;
                    }
                }
                obj.name = name
                obj.phnumber_verified = true;
                obj.password = $scope.pwd;
                var register_promise = registerfact.register(obj);
                register_promise.then(data => {
                    $scope.registercicked = false;
                    document.getElementById("registerbtnindi").disabled = true;
                    loginlocal(verified_phonenumber, obj.password)
                }).catch(err => {
                    console.log(err);
                })
            } else {
                $scope.registercicked = false;
                $scope.finalsubmit = "Please verify you phone number first."
            }
        } else {
            $scope.registercicked = false;
            $scope.finalsubmit = "Please fill the details correctly."
        }
    }
    $scope.resetpassword = (pwd, valid) => {
        if (valid) {
            if (verified_phonenumber != -1) {
                var obj = {};
                obj.phnumber = verified_phonenumber;
                obj.password = pwd;
                // console.log(obj);
                var resetpwd_promise = registerfact.resetpwd(obj);
                resetpwd_promise.then(data => {
                    // console.log(data)
                    $scope.passwordreset = false;
                    setTimeout(function () { window.close(); }, 5000);
                }).catch(err => {
                    console.log(err);
                })
            } else {
                $scope.finalsubmit = "Please verify you phone number first."
            }
        } else {
            $scope.finalsubmit = "Please fill the details correctly."
        }
    }
})