var adSenseTpl = '<ins class="adsbygoogle" style="display:inline-block;width:160px;height:320px" data-ad-client="ca-pub-4370747972986025" data-ad-slot="6995843524"></ins>';
inditrends.controller('singlecltr', ($scope, $location, $window, Fetchreq, singlefact, productfactory) => {
    $scope.bynowclicked = false;
    $scope.addtocartnowclicked = false;
    $scope.errmsg = "Please Select Size to Continue";
    //helper functions
    function filter_array_values(arr) {
        arr = arr.filter(isEligible);
        return arr;
    }
    function callnotifyagain() {
        $(".contentnotfy").show();
        setTimeout(function () {
            $(".contentnotfy").fadeOut(1500);
        }, 3000);
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
    $scope.notifymsg = ""
    var wishlistheart = [];
    $scope.wishlisthrt = wishlistheart;
    var userdata;
    function load_user_data() {
        var userdta_promise = productfactory.user_data();
        userdta_promise.then(data => {
            // console.log(data.data);
            var user = data.data;
            if (user.hasOwnProperty('token_result')) {
                // $scope.notifymsg = "Please Log In to Add this Product.";
                // callnotifyagain();
                // console.log("Login/Register to Continue");
            } else {
                var userdta = data.data.data;
                userdata = userdta;
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
                $scope.notifymsg = "Please Log In to Add this Product to WishList";
                callnotifyagain();
            } else {
                load_user_data();
                $scope.notifymsg = "Product Successfully Added to WishList";
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
                $scope.notifymsg = "Please Log In to Add this Product to WishList";
                callnotifyagain();
            } else {
                load_user_data();
                $scope.notifymsg = "Product Successfully Removed from WishList";
                callnotifyagain();
            }
        }).catch(err => {
            $scope.trend_err = false;
            console.log(err);
        })
    }


    var url = $location.absUrl();
    // console.log(url);
    let params = (new URL(url)).searchParams.get("pid");
    document.title = "Products by Inditrend"
    document.querySelector('meta[property="og:url"]').setAttribute('content', url);
    if (params == null) {
        window.location.href = Fetchreq;
    }
    $scope.categoryname = params;
    var productobj;
    //GET PRODUCT
    var porduct_promise = singlefact.getprd(params);
    porduct_promise.then(data => {
        // console.log(data.data.data);
        productobj = data.data.data[0];
        if (productobj.salestat) {
            productobj["total"] = productobj.retail_price + productobj.margin_price - productobj.sale_price + productobj.shipping_price;
        } else {
            productobj["total"] = productobj.retail_price + productobj.margin_price + productobj.shipping_price;
        }
        if (productobj.colour.length > 0) {
            getcolorprds(productobj.colour);
        }
        var tags = "";
        var avgrat = 0;
        for (i in data.data.data[0].review) {
            for (j in data.data.data[0].review[i]) {
                avgrat += data.data.data[0].review[i][j]
            }
        }
        if (!(avgrat / data.data.data[0].review.length)) {
            $scope.ratingavg = 0;
        } else {
            $scope.ratingavg = (avgrat / data.data.data[0].review.length);
        }
        for (let i = 0; i < data.data.data[0].tags.length; i++) {
            tags += data.data.data[0].tags[i] + ',';
        }
        document.title = data.data.data[0].name + " | IndiTrend"
        document.querySelector('meta[name="keywords"]').setAttribute('content', tags);
        document.querySelector('meta[property="og:title"]').setAttribute('content', data.data.data[0].name);
        document.querySelector('meta[property="og:description"]').setAttribute('content', data.data.data[0].metadescription);
        document.querySelector('meta[name="description"]').setAttribute('content', data.data.data[0].metadescription);
        productobj.review1 = [];
        var sudorevw = [];
        for (let i = 0; i < productobj.review.length; i++) {
            var ind = sudorevw.indexOf(Object.keys(productobj.review[i])[0]);
            if (ind == -1) {
                sudorevw.push(Object.keys(productobj.review[i])[0]);
                productobj.review1.push(productobj.review[i]);
            }

        }
        // console.log(productobj.review1);
        // Object.keys(productobj.review[0])[0]
        testing = (productobj.description).split("\n")
        var filtered = testing.filter(function (el) {
            return el != "";
        });
        productobj.description = filtered
        var sizeDesc = productobj.description.toString().toLowerCase();
        if (sizeDesc.includes("t-shirt")) {
            $scope.size_chart = "./images/size_chart_menfullshirt.JPG";
            console.log("T-Shirt\n\n");
        }
        if (sizeDesc.includes("3/4 sleeve") || sizeDesc.includes("3/4 Sleeves") || sizeDesc.includes("3/4")) {
            $scope.size_chart = "./images/size_chart_women34sleeve.JPG";
            console.log("3/4 Sleeve\n\n");
        }
        if (sizeDesc.includes("cropped hoodie") || sizeDesc.includes("cropped")) {
            $scope.size_chart = "./images/crop_hoodies_size.JPG";
            console.log("Cropped Hoodie\n\n");
        }else if (sizeDesc.includes("hoodie") || sizeDesc.includes("sweatshirt")) {
            $scope.size_chart = "./images/size_chart_sweat.JPG";
            console.log("hoodie\n\n");
        }
        $scope.productdetails = productobj;
        getcat();
        updateclick();
    }).catch(err => {
        // $scope.cat_err = false;
        console.log(err);
    })
    function getcolorprds(id) {
        var colo_promise = singlefact.getprd(id);
        colo_promise.then(data => {
            // console.log(data.data.data);
            let col = data.data.data;
            $scope.coloursprds = col;
        }).catch(err => {
            // $scope.cat_err = false;
            console.log(err);
        })
    }

    //GET RELATED PRODUCTS
    function getcat() {
        let cat = productobj.category;
        for (let i = 0; i < cat.length; i++) {
            if (cat[i] == "Trending") {
                cat.splice(i, 1);
            }
        }
        for (let i = 0; i < cat.length; i++) {
            if (cat[i] == "Top") {
                cat.splice(i, 1);
            }
        }
        cat = filter_array_values(cat);
        cat = removewithfilter(cat);
        let categories = cat[Math.floor(Math.random() * cat.length)];
        get_cta_pid(categories);
        if (!categories) categories = "Trending"
        $scope.selectedcateg = categories;
    }
    function getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }
    function get_cta_pid(cate) {
        var cat_promise = singlefact.getcatprd(cate);
        cat_promise.then(data => {
            // console.log(data.data.data[0]);
            let cat_prd_111 = data.data.data[0];
            if (!cat_prd_111 || !cat_prd_111.hasOwnProperty("products") || cat_prd_111.products.length < 4) {
                get_cta_pid("Trending")
            } else {
                cat_prd_111.products = filter_array_values(cat_prd_111.products);
                cat_prd_111.products = removewithfilter(cat_prd_111.products);
                if (cat_prd_111.products.length < 4) {
                    get_cta_pid("Trending")
                } else {
                    let array = getRandom(cat_prd_111.products, 4)
                    get_cta_prd(array);
                }
                // console.log(array);
            }
        }).catch(err => {
            // $scope.top_err = false;
            console.log(err);
        })
    }
    function get_cta_prd(id) {
        var catprd_promise = singlefact.getprd(id);
        catprd_promise.then(data => {
            let relprds = data.data.data;
            for (let i = 0; i < relprds.length; i++) {
                if ((relprds[i].name).length > 31) {
                    relprds[i].name = relprds[i].name.substring(0, 31).concat("...");
                }
                if (relprds[i].salestat) {
                    relprds[i]["total"] = relprds[i].retail_price + relprds[i].margin_price - relprds[i].sale_price + relprds[i].shipping_price;
                } else {
                    relprds[i]["total"] = relprds[i].retail_price + relprds[i].margin_price + relprds[i].shipping_price;
                }
                relprds[i]["ads"] = false;
            }
            relObjArr = [];
            k = 0;
            for (let i = 0; i < relprds.length; k++) {
                if (k == 2 || k == 3) {
                    relObjArr.push({ "ads": true });
                } else {
                    relObjArr.push(relprds[i]);
                    i++;
                }
            }
            relObjArr.push({ "ads": true });
            relObjArr.push({ "ads": true });
            // console.log(relObjArr);
            $scope.relatedprds = relObjArr;
        }).catch(err => {
            // $scope.cat_err = false;
            console.log(err);
        })
    }
    function updateclick() {
        var click_cnt = singlefact.updatecount(productobj.prdid);
        click_cnt.then(data => {
        }).catch(err => {
            // $scope.cat_err = false;
            console.log(err);
        })
    }
    $scope.addtocart = (size, prid) => {
        if (!size) {
            $scope.notifymsg = "Please Select Size to Continue";
            $scope.sizestat = true;
            $scope.cartaddstat = false;
            callnotifyagain();
        } else {
            $scope.addtocartnowclicked = true;
            var cart_promise = singlefact.addtocart(size, prid);
            cart_promise.then(data => {
                // console.log(data);
                var obj = data.data;
                if ("token_result" in obj) {
                    $scope.notifymsg = "Please Login To Add to Cart";
                    $scope.errmsg = "Please Login To Add to Cart";
                    $scope.sizestat = true;
                    $scope.cartaddstat = false;
                    $scope.addtocartnowclicked = false;
                    callnotifyagain();
                } else {
                    $scope.addtocartnowclicked = false;
                    $scope.notifymsg = obj.message;
                    $scope.cartaddstat = true;
                    $scope.sizestat = false;
                    callnotifyagain();

                }
            }).catch(err => {
                console.log(err);
            })
        }
    }
    $scope.buynow = (size, prid) => {
        if (!size) {
            $scope.notifymsg = "Please Select Size to Continue";
            $scope.sizestat = true;
            $scope.cartaddstat = false;
            callnotifyagain();
        } else {
            $scope.bynowclicked = true;
            var cart_promise = singlefact.addtocart(size, prid);
            cart_promise.then(data => {
                // console.log(data);
                var obj = data.data;
                if ("token_result" in obj) {
                    $scope.notifymsg = "Please Login To Buy this Product";
                    $scope.errmsg = "Please Login To Buy this Product";
                    $scope.sizestat = true;
                    $scope.cartaddstat = false;
                    $scope.bynowclicked = false;
                    callnotifyagain();
                } else {
                    $scope.notifymsg = obj.message;
                    $scope.cartaddstat = true;
                    $scope.sizestat = false;
                    $scope.bynowclicked = false;
                    $window.open(Fetchreq + '/viewcart', "_self");
                    callnotifyagain();
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }

    $scope.getFirstPropertyKey = function (obj) {
        return Object.keys(obj)[0];
    }

    $scope.getFirstPropertyValue = function (obj) {
        return obj[Object.keys(obj)[0]];
    }
    $scope.range = function (min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };
    if (userdata) {
        var text = "Hi,\ninditrend.in\nI need more information about this product with Product Url - " + url + "\n" + userdata.name;
    } else {
        var text = "Hi,\ninditrend.in\nI need more information about this product with Product Url - " + url;
    }
    var res = encodeURI(text);
    $scope.whatsapptext = res;

}).directive('googleAdsense', function ($window, $compile) {
    return {
        restrict: 'A',
        transclude: true,
        template: adSenseTpl,
        replace: false,
        link: function postLink(scope, element, iAttrs) {
            element.html("");
            element.append(angular.element($compile(adSenseTpl)(scope)));
            if (!$window.adsbygoogle) {
                $window.adsbygoogle = [];
            }
            $window.adsbygoogle.push({});
        }
    };
});