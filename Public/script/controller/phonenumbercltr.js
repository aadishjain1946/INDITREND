inditrends_user.controller('phonenocltr', ($scope, phonenofactory, $location, Fetchreq, $window) => {
    // VARIABLES
    $scope.otprequired = true;
    $scope.phoneverifymsg = "We'll never share your details with anyone else.";
    var verified_phonenumber = -1;
    $scope.sendotpcicked = false;
    $scope.verifyotpcicked = false;


    document.title = "Phone Number Verify-IndiTrend | India's Trending Fashion Hub";
    var url = $location.absUrl();
    document.querySelector('meta[property="og:url"]').setAttribute('content', url);
    document.querySelector('meta[property="og:title"]').setAttribute('content', "Phone Number Verify-IndiTrend | India's Trending Fashion Hub");

    var user_data = phonenofactory.get_user_data();
    user_data.then(data => {
        // console.log(data.data.data);
        obj = data.data.data;
        $scope.username = obj.name;
        if (obj.hasOwnProperty('phnumber')) {
            if (obj.phnumber_verified) {
                document.getElementById("exampleInputPassword1").disabled = true;
                $scope.otprequired = false;
                $scope.phonenumber = obj.phnumber;
            } else {
                $scope.phonenumber = obj.phnumber;
            }
        }
    }).catch(err => {
        console.log(err);
    })

    var timeLeft = 120;
    var timerId;
    function countdown() {
        if (timeLeft == -1) {
            clearTimeout(timerId);
            document.getElementById("resendbtn").disabled = false;
        } else {
            document.getElementById("time").innerHTML = parseInt(timeLeft / 60) + ":" + parseInt(timeLeft % 60);
            timeLeft--;
        }
    }
    $scope.getopt = (pno) => {
        $scope.sendotpcicked = true;
        var checkpno_promise = phonenofactory.checkphoneno(pno);
        checkpno_promise.then(data => {
            // console.log(data.data)
            $scope.sendotpcicked = false;
            let phonever_obj = data.data;
            if (phonever_obj.verified == false) {
                document.getElementById('exampleInputPassword1').classList.add('is-invalid');
                $scope.phoneverifymsg = phonever_obj.message;
                $scope.sendotp = false;
            } else {
                document.getElementById('exampleInputPassword1').classList.add('is-valid');
                timerId = setInterval(countdown, 1000);
                document.getElementById("sendotpadj").disabled = true;
                var otp_promise = phonenofactory.sendgoogleotp(pno);
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
    // function phoneverify() {
    //     var phn_promise = phonenofactory.phoneverify();
    // }
    $scope.verifyotp = (phone) => {
        $scope.verifyotpcicked = true;
        var code = document.getElementById('exampleInputPassword12').value;
        var otp_promise = phonenofactory.verifygoogleotp(phone, code);
        otp_promise.then(data => {
            // console.log(data);
            $scope.verifyotpcicked = false;
            var obj = data.data;
            if (obj.verified) {
                clearTimeout(timerId);
                document.getElementById("resendbtn").disabled = true;
                document.getElementById("verifyotpbtn").disabled = true;
                document.getElementById('exampleInputPassword12').classList.remove('is-invalid');
                document.getElementById('exampleInputPassword12').classList.add('is-valid');
                document.getElementById("sendotpadj").disabled = true;
                $scope.optstatusverify = "OTP VERIFIED";
                verified_phonenumber = phone;
            } else {
                document.getElementById('exampleInputPassword12').classList.remove('is-valid');
                document.getElementById('exampleInputPassword12').classList.add('is-invalid');
                $scope.optstatusverify = "INVALID OTP";
            }
        }).catch(err => {
            console.log(err);
        })
    }
    $scope.register = (valid) => {
        if (valid) {
            if (verified_phonenumber != -1) {
                var register_promise = phonenofactory.register(verified_phonenumber);
                register_promise.then(data => {
                    // console.log(data.data)
                    $window.open(Fetchreq, "_self");
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