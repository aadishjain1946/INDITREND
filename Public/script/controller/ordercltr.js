inditrends.controller('ordercltr', ($scope, Fetchreq, Fetchreq_admin, $location, $window, orderfact) => {
    var orderids = [];
    var userdatause;
    var orderdata;
    var statuscode = {
        "00": "Order Placed",
        "05": "Processing",
        "10": "Order Processed",
        "15": "Order Shipped",
        "20": "Order Dispatched",
        "25": "Order Delivered",
        "573": "Order Cancelled",
        "574": "Return Initiated",
        "575": "Return Completed",
        "576": "Cancel Completed"
    }
    $scope.status = statuscode;
    var url = $location.absUrl();
    let params = (new URL(url))
    var urlpathname = params.pathname;
    if (urlpathname == '/orderdetails') {
        function loadpiddetails(id) {
            var prds_data = orderfact.get_prds_data(id);
            prds_data.then(data => {
                var productsat = data.data.data
                var totalprice = 0;
                var extracrice = 0;
                for (let i = 0; i < orderdata.products.length; i++) {
                    // console.log(orderdata.products);
                    var ind = productsat.findIndex(obj => obj.prdid === orderdata.products[i].pid);
                    orderdata.products[i]["prdimg"] = productsat[ind].images[0];
                    orderdata.products[i]["name"] = productsat[ind].name;
                    totalprice += (orderdata.products[i].prindexce + ((orderdata.products[i].prindexce) * productsat[ind].extraprice) / 100) * orderdata.products[i].qty;
                    extracrice += (((orderdata.products[i].prindexce) * productsat[ind].extraprice) / 100) * orderdata.products[i].qty
                }
                // console.log(orderdata);
                var curdate = new Date();
                // console.log(new Date(curdate));
                // console.log(new Date(orderdata.delivdate));
                // console.log(new Date(curdate.setDate(new Date(orderdata.delivdate).getDate() + 7)));
                if (new Date() >= new Date(orderdata.delivdate) && new Date() <= new Date(curdate.setDate(new Date(orderdata.delivdate).getDate() + 7))) {
                    orderdata["returnpossible"] = true;
                } else {
                    orderdata["returnpossible"] = false;
                }
                $scope.totalp = totalprice;
                $scope.extrapri = extracrice;
                $scope.mainorderdta = orderdata;
            }).catch(err => {
                console.log(err);
            })
        }
        function getordersdetails(ids) {
            var order_data = orderfact.get_order_data(ids);
            order_data.then(data => {
                // console.log(data.data.data);
                var orddata = data.data.data;
                // console.log(orddata[0]);
                orddata = orddata.sort((a, b) => new Date(b.date) - new Date(a.date));
                orderdata = orddata[0];
                var prdsid = [];
                for (let i = 0; i < orderdata.products.length; i++) {
                    prdsid.push(orderdata.products[i].pid);
                }
                if (orddata[0].cashondelivery == true) {
                    // console.log("YEs");
                    $scope.deliverycharges = 50;
                } else {
                    $scope.deliverycharges = 0;
                }
                loadpiddetails(prdsid);
            }).catch(err => {
                console.log(err);
            })
        }
        function load_userdata() {
            var user_data = orderfact.get_user_data();
            user_data.then(data => {
                // console.log(data.data.data);
                obj = data.data;
                // console.log(obj)
                if (obj.token_result == false) {
                    $scope.userlogin = false;
                    $scope.cartstatusmsg = "Please Login to View your Cart.";
                } else {
                    $scope.userlogin = true;
                    userdata = obj.data;
                    userdatause = userdata;
                    $scope.userdta = userdatause;
                    // console.log(userdata);
                    if (userdata.orders.length == 0) {
                        $scope.ordercount = 0;
                    } else {
                        var orderID = params.searchParams.get('orderId');
                        getordersdetails(orderID);
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        }
        load_userdata();

    } else {
        function loadpid(id) {
            var prds_data = orderfact.get_prds_data(id);
            prds_data.then(data => {
                // console.log(data);
                var productsat = data.data.data
                // var curdate = Date.now();
                for (let i = 0; i < orderdata.length; i++) {
                    var ind = productsat.findIndex(obj => obj.prdid === orderdata[i].products[0].pid);
                    orderdata[i]["prdimg"] = productsat[ind].images[0];
                    orderdata[i]["name"] = productsat[ind].name;
                    var currdatesev = new Date();
                    // console.log(new Date(), new Date(orderdata[i].delivdate), new Date(currdatesev.setDate(new Date(orderdata[i].delivdate).getDate() + 7)));
                    if (new Date() >= new Date(orderdata[i].delivdate) && new Date() <= new Date(currdatesev.setDate(new Date(orderdata[i].delivdate).getDate() + 7))) {
                        orderdata[i]["returnpossible"] = true;
                    } else {
                        orderdata[i]["returnpossible"] = false;
                    }
                }
                // console.log("YES", orderdata);
                $scope.mainorderdta = orderdata;
            }).catch(err => {
                console.log(err);
            })
        }
        function getorders(ids) {
            var order_data = orderfact.get_order_data(ids);
            order_data.then(data => {
                // console.log(data.data.data);
                var orddata = data.data.data;
                orddata = orddata.sort((a, b) => new Date(b.date) - new Date(a.date));
                orderdata = orddata;
                var prdsid = [];
                for (let i = 0; i < orddata.length; i++) {
                    prdsid.push(orddata[i].products[0].pid);
                }
                loadpid(prdsid);
            }).catch(err => {
                console.log(err);
            })
        }
        function load_userdata() {
            var user_data = orderfact.get_user_data();
            user_data.then(data => {
                // console.log(data.data.data);
                obj = data.data;
                // console.log(obj)
                if (obj.token_result == false) {
                    $scope.userlogin = false;
                    $scope.orderstatusmsg = "Please Login to View your Orders.";
                } else {
                    $scope.userlogin = true;
                    userdata = obj.data;
                    userdatause = userdata;
                    // console.log(userdata);
                    if (userdata.orders.length == 0) {
                        $scope.ordercount = 0;
                        $scope.orderstatusmsg = "No Orders Available"
                    } else {
                        orderids = userdata.orders;
                        getorders(orderids);
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        }
        load_userdata();
    }
    $scope.cancelorder = (id) => {
        var ans = window.confirm("Are you sure you want to cancel this order. You cannot revert this request.");
        if (ans) {
            var user_data = orderfact.cancelorder(id);
            user_data.then(data => {
                // console.log(data.data);
                var obj = data.data;
                $scope.cancelmsg = obj.message;
            }).catch(err => {
                console.log(err);
            })
        }
    }
    $scope.returnclick = (id) => {
        var ans = window.confirm("Are you sure you want to Initiate Return. You cannot revert this request.");
        if (ans) {
            $window.open(Fetchreq + '/returninit?orderId=' + id, "_self");
        }
    }
    var expression = "(https?: \/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})";
    var regex = new RegExp(expression);
    function Run(url) {
        if (url.match(regex)) {
            return true;
        } else {
            return false;
        }
    }
    $scope.returnorder = (val, s, def) => {
        // console.log(parseInt(val));
        var orderID = params.searchParams.get('orderId');
        // console.log(orderID);
        if (!parseInt(val)) {
            $scope.msgreturn = "Please select Reason for Return.";
        } else {
            $scope.msgreturn = "";
            if (val == 2) {
                var vidret = document.getElementById('vidolink').value;
                if (Run(vidret)) {
                    $scope.msgreturn = "URL-VALID";
                    $scope.linknotfill = false;
                    var returnsize_data = orderfact.returndefective(orderID, vidret);
                    returnsize_data.then(data => {
                        // console.log(data.data);
                        $scope.msgreturn = data.data.message;
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    $scope.msgreturn = "INVALID-URL";
                }
            } else if (val == 1) {
                var returnsize_data = orderfact.returnsize(orderID);
                returnsize_data.then(data => {
                    // console.log(data.data);
                    $scope.msgreturn = data.data.message;
                }).catch(err => {
                    console.log(err);
                })
            }
        }

    }
    $scope.ratingchangeorddetails = (obj, rat) => {
        // console.log(obj);
        var prid = [];
        prid.push(obj.pid);
        var rating_data = orderfact.updaterating(prid, rat);
        rating_data.then(data => {
            // console.log(data.data);
        }).catch(err => {
            console.log(err);
        })
    }
    $scope.ratingchange = (obj, rat) => {
        // console.log(obj);
        var prid = [];
        for (let i = 0; i < obj.products.length; i++) {
            prid.push(obj.products[i].pid);
        }
        var rating_data = orderfact.updaterating(prid, rat);
        rating_data.then(data => {
            // console.log(data.data);
        }).catch(err => {
            console.log(err);
        })
    }
    $scope.needhelp = (id) => {
        var text = "Hi,\ninditrend.in\nI need help regarding my order with order ID :" + id + " .\nWating for your responce.\n" + userdatause.name;
        var res = encodeURI(text);
        $scope.whatsapptext = res;
    }

})