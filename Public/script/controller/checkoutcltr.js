inditrends.controller('checkoutcltr', ($scope, Fetchreq, $window, checkoutfact) => {
    var userdata = {};
    $scope.userlogin = false;
    $scope.coupoun = false;
    $scope.cartempty = false;
    $scope.paymentloading = false;
    $scope.cashclickloading = false;
    $scope.cashprice = 0;
    var current_captcha = "";
    $scope.paymtoptionselected = -1;
    $scope.cash = "alert-secondary";
    $scope.online = "alert-secondary";
    var productsid = [];
    var products = [];
    var productprice = 0;
    var discountprice = 0;
    var totalprice = 0;
    var cartaddressindex = 0;
    $scope.cartstatusmsg = "";


    function Captcha() {
        var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0');
        var i;
        for (i = 0; i < 6; i++) {
            var a = alpha[Math.floor(Math.random() * alpha.length)];
            var b = alpha[Math.floor(Math.random() * alpha.length)];
            var c = alpha[Math.floor(Math.random() * alpha.length)];
            var d = alpha[Math.floor(Math.random() * alpha.length)];
            var e = alpha[Math.floor(Math.random() * alpha.length)];
            var f = alpha[Math.floor(Math.random() * alpha.length)];
            var g = alpha[Math.floor(Math.random() * alpha.length)];
        }
        var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
        return code;
    }
    function removeSpaces(string) {
        return string.split(' ').join('');
    }
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }
    function callnotifyagain() {
        $(".contentnotfy").show();
        setTimeout(function () {
            $(".contentnotfy").fadeOut(1500);
        }, 3000);
    }
    function get_products(pids) {
        var prds_promise = checkoutfact.getprd(pids);
        prds_promise.then(data => {
            // console.log(data.data.data);
            products = [];
            var promiseres = data.data.data;;
            for (let i = 0; i < productsid.length; i++) {
                var po = promiseres.find(o => o.prdid == productsid[i])
                products.push(po);
            }
            $scope.cartproduct = products;
            productprice = 0;
            discountprice = 0;
            for (let i = 0; i < products.length; i++) {
                var pop = 0;
                if (!products[i].salestat) {
                    var l = products[i];
                    var ep = ((l.total) * (100)) / (100 - l.extraprice);
                    pop = ep * userdata.cart.product[i].qty;
                } else {
                    var l = products[i];
                    var ep = ((l.total + l.sale_price) * 100) / (100 - l.extraprice);
                    pop = ep * userdata.cart.product[i].qty;
                }
                productprice += pop;
                discountprice += pop - (products[i].total * userdata.cart.product[i].qty);
            }
            totalprice = productprice - discountprice;
            $scope.pprice = productprice;
            $scope.dprice = discountprice;
            $scope.tprice = totalprice;
        }).catch(err => {
            console.log(err);
        })
    }

    function load_userdata() {
        var user_data = checkoutfact.get_user_data();
        user_data.then(data => {
            // console.log(data.data.data);
            productsid = []
            obj = data.data;
            // console.log(obj)
            if (obj.token_result == false) {
                $scope.userlogin = false;
                $scope.cartstatusmsg = "Please Login to View your Cart.";
            } else {
                $scope.userlogin = true;
                userdata = obj.data;
                // console.log(userdata);
                if (!userdata.hasOwnProperty("cart") || userdata.cart.product.length == 0) {
                    $scope.cartempty = true;
                    $scope.cartstatusmsg = "Your cart is Empty.";
                } else {
                    cartaddressindex = userdata.cart.address;
                    for (let i = 0; i < userdata.cart.product.length; i++) {
                        productsid.push(userdata.cart.product[i].pid);
                    }
                    // console.log(productsid)
                    get_products(productsid);
                    $scope.userdta = userdata;

                }
            }
        }).catch(err => {
            console.log(err);
        })
    }
    load_userdata();
    $scope.changecartaddress = (index) => {
        // console.log(index);
        cartaddressindex = index;
    }
    $scope.setcartaddress = () => {
        if (userdata.cart.address == cartaddressindex) {
            $scope.notifymsg = "Address already Selected";
            callnotifyagain();
        } else {
            var updateaddcart_data = checkoutfact.get_updateaddcart(cartaddressindex);
            updateaddcart_data.then(data => {
                // console.log(data.data.data);
                $scope.notifymsg = "Address Changed Successfully";
                callnotifyagain();
                load_userdata();
            }).catch(err => {
                console.log(err);
            })

        }
    }
    $scope.removeproductcart = (id, size) => {
        var ans = window.confirm("Are You sure you want to remove this product,\nIt's a Limited Period Offer at this Price");
        if (ans) {
            // console.log(id, size);
            var removecart_data = checkoutfact.removecartproduct(id, size);
            removecart_data.then(data => {
                // console.log(data.data);
                $scope.notifymsg = "Product Removed from Cart successfully";
                callnotifyagain();
                // load_userdata();
                $window.location.reload();
            }).catch(err => {
                console.log(err);
            })
        }
    }
    $scope.addproducttowishlist = (prid) => {
        // console.log(prid);
        var addtowishlist_promise = checkoutfact.addtowishlist(prid);
        addtowishlist_promise.then(data => {
            // console.log(data.data);
            var userd = data.data;
            $scope.notifymsg = userd.message;
            callnotifyagain();
        }).catch(err => {
            // $scope.trend_err = false;
            console.log(err);
        })
    }
    $scope.changeqty = (id, val) => {
        var changeqty_promise = checkoutfact.changequantity(id, val);
        changeqty_promise.then(data => {
            // console.log(data.data);
            // var userd = data.data;
            $scope.notifymsg = "Quantity for this product updated";
            callnotifyagain();
            load_userdata();
        }).catch(err => {
            // $scope.trend_err = false;
            console.log(err);
        })
    }
    $scope.placeorder = () => {
        $window.open(Fetchreq + '/ordersummary', "_self");
    }
    $scope.placeorderwithpayment = async () => {
        if ($scope.paymtoptionselected == -1) {
            $scope.errpaymsg = "Please Select One Option to Continue";
        }
        else if ($scope.paymtoptionselected == 0) {
            console.log("Paying with cash");
            return;
        } else {
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?')
                return
            }
            $scope.paymentloading = true;
            var payment_promise = checkoutfact.placeorderwithpayment("online");
            payment_promise.then(data => {
                // console.log(data.data);
                if (data.data.hasOwnProperty('phone') && !data.data.phone) {
                    $window.open(Fetchreq + '/userauth/phonenumberverify', '_self');
                    $scope.paymentloading = false;
                } else {
                    $scope.paymentloading = false;
                    var obj = data.data.data;
                    // console.log(obj);
                    var options = {
                        "key": obj.key_id,
                        "amount": (obj.amount).toString(),
                        "currency": obj.currency,
                        "name": "IndiTrend",
                        "description": "Thank You For Choosing Us.",
                        "order_id": obj.id,
                        "callback_url": Fetchreq + "/paymentstatuscheck",
                        "prefill": {
                            "name": obj.notes.name,
                            "email": obj.notes.email,
                            "contact": obj.notes.mobileno
                        },
                        "notes": {
                            "UserID": obj.notes.custId,
                            "mobileno": obj.notes.mobileno,
                            "name": obj.notes.name,
                            "orderId": obj.notes.orderId
                        },
                        "readonly": {
                            "email": true,
                            "contact": true
                        }
                    };
                    var rzp1 = new Razorpay(options);
                    rzp1.open();
                }
            }).catch(err => {
                // $scope.trend_err = false;
                console.log(err);
            })
        }
    }
    $scope.cashclick = () => {
        $scope.paymtoptionselected = 0;
        $scope.cashprice = 50;
        $scope.errpaymsg = "";
        $scope.cash = "alert-success";
        $scope.online = "alert-light";
    }
    $scope.onlineclick = () => {
        $scope.cashprice = 0;
        $scope.errpaymsg = "";
        $scope.paymtoptionselected = 1;
        $scope.online = "alert-success";
        $scope.cash = "alert-light";
    }
    $scope.loadcaptcha = () => {
        $scope.capterrmsg = "";
        current_captcha = Captcha();
        $scope.captchavalue = current_captcha;
        current_captcha = removeSpaces(current_captcha);
    }
    $scope.placecashorder = (capval) => {
        // console.log(current_captcha,capval);
        $scope.cashclickloading = true;
        if (current_captcha == capval) {
            var payment_promise = checkoutfact.placeorderwithpayment("cash");
            payment_promise.then(data => {
                $scope.cashclickloading = false;
                // console.log(data.data);
                if (data.data.hasOwnProperty('phone') && !data.data.phone) {
                    $window.open(Fetchreq + '/userauth/phonenumberverify', '_self');
                } else {
                    var obj = data.data.data;
                    if (obj.ordercreated == true) {
                        $window.open(Fetchreq + '/paymentstatus?orderId=' + obj.orderId, '_self');
                    }
                }
            }).catch(err => {
                // $scope.trend_err = false;
                console.log(err);
            })
        } else {
            $scope.captchaerr = true;
            $scope.cashclickloading = false;
            $scope.capterrmsg = "Entered Captcha InValid";
        }
    }
    $scope.applycoupoun = (cpndta) => {
        // console.log(cpndta);
        if (cpndta) {
            $scope.coupounmsg = "Coupoun Code Invalid";

        } else {
            $scope.coupounmsg = "Please Enter a Coupoun Code";
        }
    }
})