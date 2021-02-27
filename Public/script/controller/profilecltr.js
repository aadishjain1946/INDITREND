inditrends.controller('profilecltr', ($scope, profilefact, $location, Fetchreq, $window) => {

    var url = $location.absUrl();
    document.querySelector('meta[property="og:url"]').setAttribute('content', url);
    $scope.submitcheckadd = false;
    $scope.pwdloadcheck = false;

    var userdata = {};
    $scope.userlogin = false;
    $scope.addressform = false;
    var useraddressdata = {};
    useraddressdata['update'] = false;
    $scope.addressdata = useraddressdata;
    $scope.notificationmsg = "";
    //helper_function
    function callnotifyagain() {
        $(".contentnotfy").show();
        setTimeout(function () {
            $(".contentnotfy").fadeOut(1500);
        }, 3000);
    }
    function init_address() {
        $scope.cadd = useraddressdata.cadd;
        $scope.hno = useraddressdata.hno;
        $scope.city = useraddressdata.city;
        $scope.pcode = useraddressdata.pcode;
        $scope.lmark = useraddressdata.lmark;
        $scope.aname = useraddressdata.aname;
        $scope.aphone = useraddressdata.aphone;
        if (document.getElementById('stateselect')) {
            document.getElementById('stateselect').value = useraddressdata.state;
        }
    }
    function init_address_blank() {
        $scope.cadd = "";
        $scope.hno = "";
        $scope.city = "";
        $scope.pcode = "";
        $scope.lmark = "";
        $scope.aname = "";
        $scope.aphone = "";
    }
    function load_userdata() {
        var user_data = profilefact.get_user_data();
        user_data.then(data => {
            // console.log(data.data.data);
            obj = data.data;
            // console.log(obj)
            if (obj.token_result == false) {
                $scope.userlogin = false;
            } else {
                $scope.userlogin = true;
                userdata = obj.data;
                $scope.userdta = userdata;
                $scope.updatedname = userdata.name;
                $updatedemail = userdata.email;
                document.title = userdata.name + " | IndiTrend | India's Trending Fashion Hub"
                document.querySelector('meta[property="og:title"]').setAttribute('content', userdata.name + " | IndiTrend | India's Trending Fashion Hub");
            }
        }).catch(err => {
            console.log(err);
        })
    }
    load_userdata();
    $scope.submitnameemail = (name, email) => {
        if (!name && !email) {
            // console.log("not valid")
            $scope.nameemailmsg = "Please fill details correctly "
        } else {
            if (userdata.googleUser) {
                email = userdata.email;
            }
            if (!name) {
                name = userdata.name;
            }
            if (!email) {
                if (email in userdata) {
                    email = userdata.email;
                } else {
                    email = undefined;
                }
            }
            // console.log(name, email);
            var nameemail = profilefact.nameemail(name, email);
            nameemail.then(data => {
                // console.log(data.data.data);
                $scope.notificationmsg = "Profile Updated Successfully"
                load_userdata();
                callnotifyagain();
                // obj = data.data;
                // console.log(obj)
            }).catch(err => {
                console.log(err);
            })

        }
    }
    $scope.add_address = () => {
        init_address_blank();
        $scope.addressform = true;
    }
    $scope.back = () => {
        $scope.addressform = false;
    }
    $scope.addaddressuser = (cadd, hno, city, pcode, lmark, aname, aphone) => {
        var selval = document.getElementById('stateselect').value;
        // console.log(selval);
        if (selval == "false") {
            // console.log("OK");
            $scope.formmsg = "Select State"
        } else {
            $scope.submitcheckadd = true;
            $scope.formmsg = ""
            useraddressdata['cadd'] = cadd;
            useraddressdata['hno'] = hno;
            useraddressdata['city'] = city;
            useraddressdata['pcode'] = pcode;
            if (lmark) {
                useraddressdata['lmark'] = lmark;
            }
            useraddressdata['aname'] = aname;
            useraddressdata['aphone'] = aphone;
            useraddressdata['state'] = document.getElementById('stateselect').value;
            // console.log(useraddressdata)
            if (useraddressdata.update == false) {
                var useradd = profilefact.newaddress(useraddressdata);
                useradd.then(data => {
                    // console.log(data.data.data);
                    $scope.submitcheckadd = false;
                    $scope.notificationmsg = "Address Added Successfully"
                    load_userdata();
                    callnotifyagain();
                    $scope.addressform = false;
                    // obj = data.data;
                    // console.log(obj)
                }).catch(err => {
                    $scope.notificationmsg = "Something Went Wrong"
                    console.log(err);
                })
            } else {
                var updateadd = profilefact.updateaddress(useraddressdata);
                updateadd.then(data => {
                    // console.log(data.data.data);
                    $scope.notificationmsg = "Address Updated Successfully"
                    load_userdata();
                    callnotifyagain();
                    $scope.submitcheckadd = false;
                    $scope.addressform = false;
                    // obj = data.data;
                    // console.log(obj)
                }).catch(err => {
                    $scope.notificationmsg = "Something Went Wrong"
                    console.log(err);
                })
            }

        }
    }
    $scope.editadd = (index) => {
        useraddressdata = userdata.address[index];
        useraddressdata['index'] = index;
        useraddressdata['update'] = true;
        $scope.addressform = true;
        init_address();
    }
    $scope.deleteadd = (index) => {
        var ans = window.confirm("Do you want to delete " + userdata.address[index].aname + "'s address.");
        if (ans) {
            var deladd = profilefact.deleteaddress(index);
            deladd.then(data => {
                // console.log(data.data.data);
                $scope.notificationmsg = "Address deleted Successfully"
                load_userdata();
                callnotifyagain();
                // obj = data.data;
                // console.log(obj)
            }).catch(err => {
                $scope.notificationmsg = "Something Went Wrong"
                console.log(err);
            })
        }
    }
    $scope.setasdefault = (index) => {
        var ans = window.confirm("Do you want to set " + userdata.address[index].aname + "'s address as default.");
        if (ans) {
            var setasdefault = profilefact.setdefaultaddress(index);
            setasdefault.then(data => {
                // console.log(data.data.data);
                $scope.notificationmsg = "Address Set as Default"
                load_userdata();
                callnotifyagain();
                // obj = data.data;
                // console.log(obj)
            }).catch(err => {
                $scope.notificationmsg = "Something Went Wrong"
                console.log(err);
            })
        }
    }
    $scope.logout = () => {
        localStorage.USERINDITREND = JSON.stringify("nothing");
        localStorage.USERINDITREND = JSON.stringify("logout");
        localStorage.USERINDITREND = JSON.stringify("hacker fuck you");
        localStorage.USERINDITREND = JSON.stringify("don't sneek peek here");
        localStorage.USERINDITREND = JSON.stringify("shut the fuck up");
        $window.open(Fetchreq + '/', "_self");
    }
    $scope.changepassword = (curr, newpwd) => {
        $scope.pwdloadcheck = true;
        var change_pwd = profilefact.changepassword(curr, newpwd);
        change_pwd.then(data => {
            $scope.pwdloadcheck = false;
            // console.log(data.data);
            if (data.data.pass == false) {
                $scope.currpwdmsg = "Wrong Password";
                document.getElementById('cpwdadj').value = "";
                document.getElementById('newpwdadj').value = "";
                document.getElementById('newrepwdadj').value = "";
            } else {
                $scope.notificationmsg = "Password changed Successfully"
                load_userdata();
                callnotifyagain();
                document.getElementById('cpwdadj').value = "";
                document.getElementById('newpwdadj').value = "";
                document.getElementById('newrepwdadj').value = "";
            }
            // obj = data.data;
            // console.log(obj)
        }).catch(err => {
            $scope.notificationmsg = "Something Went Wrong"
            console.log(err);
        })
    }
})