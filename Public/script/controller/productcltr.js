inditrends.controller('productcltr', ($scope, productfactory) => {
    ////ERROR INITILIZERS
    $scope.trend_err = true;
    $scope.newarr_err = true;
    $scope.top_err = true;

    //helper functions
    function callnotifyagain() {
        $(".contentnotfy").show();
        setTimeout(function () {
            $(".contentnotfy").fadeOut(1500);
        }, 3000);
    }
    function filter_array_values(arr) {
        arr = arr.filter(isEligible);
        return arr;
    }

    function isEligible(value) {
        if (value !== false || value !== null || value !== "") {
            return value;
        }
    }
    function removewithfilter(arr) {
        let outputArray = arr.filter(function (v, i, self) {
            return i == self.indexOf(v);
        });
        return outputArray;
    }
    // Wishlist operations
    $scope.notificationmsg = ""
    var wishlistheart = [];
    $scope.wishlisthrt = wishlistheart;
    function load_user_data() {
        var userdta_promise = productfactory.user_data();
        userdta_promise.then(data => {
            // console.log(data.data);
            var user = data.data;
            if (user.hasOwnProperty('token_result')) {
                // $scope.notificationmsg = "Please Log In to Add this Product.";
                // callnotifyagain();
                // console.log("Login/Register to Continue");
            } else {
                var userdta = data.data.data;
                wishlistheart = userdta.wishlist;
                $scope.wishlisthrt = wishlistheart;
            }
        }).catch(err => {
            $scope.trend_err = false;
            console.log(err);
        })
    }
    load_user_data();
    $scope.addprdtowishlis = (prid) => {
        var addtowishlist_promise = productfactory.addtowishlist(prid);
        addtowishlist_promise.then(data => {
            // console.log(data.data.data);
            var userd = data.data;
            if (userd.hasOwnProperty('token_result')) {
                $scope.notificationmsg = "Please Log In to Add this Product to WishList";
                callnotifyagain();
            } else {
                load_user_data();
                $scope.notificationmsg = "Product Successfully Added to WishList";
                callnotifyagain();
            }
        }).catch(err => {
            $scope.trend_err = false;
            console.log(err);
        })
    }
    $scope.removeprdtowishlis = (prid) => {
        var addtowishlist_promise = productfactory.removetowishlist(prid);
        addtowishlist_promise.then(data => {
            // console.log(data.data.data);
            var userd = data.data;
            if (userd.hasOwnProperty('token_result')) {
                $scope.notificationmsg = "Please Log In to Add this Product to WishList";
                callnotifyagain();
            } else {
                load_user_data();
                $scope.notificationmsg = "Product Successfully Removed from WishList";
                callnotifyagain();
            }
        }).catch(err => {
            $scope.trend_err = false;
            console.log(err);
        })
    }

    // TRENDING PRODUCT REQ
    var trendpid = [];
    var trendproducts = [];
    function get_T_pid() {
        var tren_promise = productfactory.trend_product();
        tren_promise.then(data => {
            // console.log(data.data.data);
            let tren_p_id = data.data.data[0];
            tren_p_id.products = filter_array_values(tren_p_id.products);
            tren_p_id.products = removewithfilter(tren_p_id.products);
            trendpid = [];
            trendpid = tren_p_id.products;
            get_T_prds();
        }).catch(err => {
            $scope.trend_err = false;
            console.log(err);
        })
    }
    get_T_pid();
    $scope.reloadtrends = () => {
        $scope.trend_err = true;
        get_T_pid();
    }
    function get_T_prds() {
        var t_prds_promise = productfactory.gettrendcatprd(trendpid);
        t_prds_promise.then(data => {
            // console.log(data.data.data);
            trendproducts = data.data.data;
            for (let i = 0; i < trendproducts.length; i++) {
                trendproducts[i]["fullname"] = trendproducts[i].name;
                if ((trendproducts[i].name).length > 37) {
                    trendproducts[i].name = trendproducts[i].name.substring(0, 37).concat("...");
                }
            }
            $scope.trend_products = trendproducts;
        }).catch(err => {
            $scope.trend_err = false;
            console.log(err);
        })
    }

    // NEW ARRIVALS PRODUCTS REQ
    var newarrproducts = [];
    function get_ARR_prds() {
        var arr_prds_promise = productfactory.getarrcatprd();
        arr_prds_promise.then(data => {
            // console.log(data.data.data);
            newarrproducts = data.data.data;
            for (let i = 0; i < newarrproducts.length; i++) {
                newarrproducts[i]["fullname"] = newarrproducts[i].name;
                if ((newarrproducts[i].name).length > 37) {
                    newarrproducts[i].name = newarrproducts[i].name.substring(0, 37).concat("...");
                }
            }
            $scope.newarrival = newarrproducts;
        }).catch(err => {
            $scope.newarr_err = false;
            console.log(err);
        })
    }
    get_ARR_prds();
    $scope.reloadnewarr = () => {
        $scope.newarr_err = true;
        get_ARR_prds();
    }

    // TOP PRODUCTS REQ
    var toppid = [];
    var topproducts = [];
    function get_Top_pid() {
        var top_promise = productfactory.top_product();
        top_promise.then(data => {
            // console.log(data.data.data);
            let top_p_id = data.data.data[0];
            top_p_id.products = filter_array_values(top_p_id.products);
            top_p_id.products = removewithfilter(top_p_id.products);
            toppid = [];
            toppid = top_p_id.products;
            get_Top_prds();
        }).catch(err => {
            $scope.top_err = false;
            console.log(err);
        })
    }
    get_Top_pid();
    $scope.reloadtop = () => {
        $scope.top_err = true;
        get_Top_pid();
    }
    function get_Top_prds() {
        var top_prds_promise = productfactory.gettopcatprd(toppid);
        top_prds_promise.then(data => {
            // console.log(data.data.data);
            topproducts = data.data.data;
            for (let i = 0; i < topproducts.length; i++) {
                topproducts[i]["fullname"] = topproducts[i].name;
                if ((topproducts[i].name).length > 37) {
                    topproducts[i].name = topproducts[i].name.substring(0, 37).concat("...");
                }
            }
            $scope.top_products = topproducts;
        }).catch(err => {
            $scope.top_err = false;
            console.log(err);
        })
    }

}).directive("owlCarousel", function () {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {
            scope.initCarousel = function (element) {
                $(element).owlCarousel({
                    loop: false,
                    margin: 15,
                    nav: true,
                    dots: false,
                    pagination: false,
                    responsive: {
                        0: {
                            items: 2
                        },
                        600: {
                            items: 3
                        },
                        800: {
                            items: 4
                        },
                        1000: {
                            items: 5
                        }
                    }
                });
            };
        }
    };
}).directive('owlCarouselItem', [function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {
            // wait for the last item in the ng-repeat then call init
            if (scope.$last) {
                scope.initCarousel(element.parent());
            }
        }
    };
}]);