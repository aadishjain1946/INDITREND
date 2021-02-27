inditrends.controller('wishlistcltr', ($scope, wishlistfact) => {
    var wishlistheart = [];
    var wishlistdata = [];
    $scope.wishliststatusmsg = "Empty WishList";
    // HELPER FUNCTIONS
    function callnotifyagain() {
        $(".contentnotfy").show();
        setTimeout(function () {
            $(".contentnotfy").fadeOut(1500);
        }, 3000);
    }

    $scope.wishlisthrt = wishlistheart;
    $scope.notificationmsg = ""
    function load_user_data() {
        var userdta_promise = wishlistfact.user_data();
        userdta_promise.then(data => {
            // console.log(data.data);
            var user = data.data;
            if (user.hasOwnProperty('token_result')) {
                $scope.wishliststatusmsg = "Login to View Your WishList";
                // $scope.notificationmsg = "Please Log In to Add this Product.";
                // callnotifyagain();
                console.log("user not logg In");
            } else {
                var userdta = data.data.data;
                wishlistheart = userdta.wishlist;
                $scope.wishlisthrt = wishlistheart;
                get_wishlist_prds();
                // console.log(wishlistheart)
            }
        }).catch(err => {
            $scope.trend_err = false;
            console.log(err);
        })
    }
    load_user_data();
    function get_wishlist_prds() {
        var wlist_promise = wishlistfact.getwishlistprds(wishlistheart);
        wlist_promise.then(data => {
            // console.log(data.data);
            wishlistdata = data.data.data;
            for (let i = 0; i < wishlistdata.length; i++) {
                if ((wishlistdata[i].name).length > 20) {
                    wishlistdata[i].name = wishlistdata[i].name.substring(0, 20).concat("...");
                }
            }
            $scope.wishlist_data = wishlistdata;
        }).catch(err => {
            $scope.trend_err = false;
            console.log(err);
        })
    }
    $scope.removeprdtowishlis = (prid) => {
        var addtowishlist_promise = wishlistfact.removetowishlist(prid);
        addtowishlist_promise.then(data => {
            // console.log(data.data.data);
            var userd = data.data;
            if (userd.hasOwnProperty('token_result')) {
                $scope.wishliststatusmsg = "Login to View Your WishList";
                $scope.notificationmsg = "Please Log In to remove this Product.";
                callnotifyagain();
            } else {
                load_user_data();
                $scope.notificationmsg = "Product Removed from WishList";
                callnotifyagain();
            }
        }).catch(err => {
            $scope.trend_err = false;
            console.log(err);
        })
    }
})