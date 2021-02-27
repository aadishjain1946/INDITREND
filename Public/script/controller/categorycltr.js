var adSenseTpl = '<ins class="adsbygoogle" style="display:inline-block;width:135px;height:300px" data-ad-client="ca-pub-4370747972986025" data-ad-slot="6630337431"></ins> ';
inditrends.controller('categorycltr', ($scope, $location, Fetchreq, $window, productfactory, categoryfact) => {
    ////ERROR INITILIZERS
    $scope.cat_err = true;
    $scope.noproductfount = true;

    var url = $location.absUrl();
    var sortby = 1;
    if ((new URL(url)).searchParams.get("sortby")) {
        sortby = (new URL(url)).searchParams.get("sortby");
    }
    let params = (new URL(url)).searchParams.get("id");
    if (params == null) {
        window.location.href = Fetchreq;
    }
    $scope.categoryname = params;
    document.title = params + " | Category by Inditrend"
    document.querySelector('meta[property="og:url"]').setAttribute('content', url);

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

    // PRODUCT PRINT 1) GETTING ID 2) GETTING PRODUCTS 
    var pid = [];
    var products = [];
    var indexed = 0;
    var categories = [];
    var firstinit = true;

    function getpid() {
        var porduct_promise = categoryfact.product(params);
        porduct_promise.then(data => {
            // console.log(data.data.data);
            if (data.data.data.length == 0 || data.data.data[0].products.length == 0) {
                $scope.cat_err = true;
                $scope.noproductfount = false;
            }
            document.title = data.data.data[0].meta_name
            document.querySelector('meta[property="og:title"]').setAttribute('content', data.data.data[0].meta_name);
            document.querySelector('meta[property="og:description"]').setAttribute('content', data.data.data[0].meta_desc);
            document.querySelector('meta[name="description"]').setAttribute('content', data.data.data[0].meta_desc);
            var tags = "";
            for (let i = 0; i < data.data.data[0].tags.length; i++) {
                tags += data.data.data[0].tags[i] + ',';
            }
            document.querySelector('meta[name="keywords"]').setAttribute('content', tags);
            let tren_p_id = data.data.data[0];
            tren_p_id.products = filter_array_values(tren_p_id.products);
            tren_p_id.products = removewithfilter(tren_p_id.products);
            pid = [];
            pid = tren_p_id.products;
            // console.log(pid)
            get_prds();
        }).catch(err => {
            // $scope.cat_err = false;
            console.log(err);
        })
    }

    getpid();

    function get_prds() {
        var pid_array = pid.slice(indexed, indexed + 6);
        indexed = indexed + 6;
        // console.log(pid_array);
        if (pid_array.length == 0) {
            ele = document.querySelector(".loadercatadj")
            ele.classList.add('dis-deactive');
        }
        var prds_promise = categoryfact.getcatprd(pid_array, params);
        prds_promise.then(data => {
            // console.log(data.data.data);
            particular_cat_products = data.data.data;
            for (let i = 0; i < particular_cat_products.length; i++) {
                particular_cat_products[i]["fullname"] = particular_cat_products[i].name;
                particular_cat_products[i]["desc"] = particular_cat_products[i].description;
                if ((particular_cat_products[i].name).length > 20) {
                    particular_cat_products[i].name = particular_cat_products[i].name.substring(0, 20).concat("...");
                }
                if ((particular_cat_products[i].description).length > 20) {
                    particular_cat_products[i].description = particular_cat_products[i].metadescription.substring(0, 20).concat("...");
                }
                categories = categories.concat(particular_cat_products[i].category);
                categories = filter_array_values(categories);
                categories = removewithfilter(categories);
                $scope.expcategories = categories;
            }
            var orderedproducts = [];
            for (let i = 0; i < pid_array.length; i++) {
                var indx = particular_cat_products.findIndex(item => item.prdid === pid_array[i]);
                orderedproducts.push(particular_cat_products[indx]);
            }
            orderedproducts = sorting(orderedproducts, sortby);
            products = products.concat(orderedproducts);
            var prdswithads = [];
            let k = 0, i = 1;
            while (k < products.length) {
                if (i == 6) {
                    var ggg = { "ads": true };
                    prdswithads.push(ggg);
                    // prdswithads.push(ggg);
                    i = 0;
                } else {
                    var ghghg = products[k];
                    ghghg["ads"] = false;
                    prdswithads.push(products[k]);
                    k++;
                }
                i++;
            }
            if (products.length < 6) {
                var ggg = { "ads": true };
                prdswithads.push(ggg);
            }
            $scope.main_products = prdswithads;
            // console.log(prdswithads);
            if (firstinit == true) {
                ele = document.querySelector(".loadercatadj")
                ele.classList.remove('dis-deactive');
                firstinit = false;
            }
        }).catch(err => {
            $scope.cat_err = false;
            console.log(err);
        })
    }
    $scope.reloadcat = () => {
        getpid();
    }
    $scope.sortdata = {
        singleSelect: null,
        multipleSelect: [],
        option1: 'Popularity'
    };
    function sorting(arr, op) {
        if (op == "1") {
            return arr;
        } else if (op == "2") {
            arr.sort(function (a, b) {
                var aa = a.date.split('/').reverse().join(),
                    bb = b.date.split('/').reverse().join();
                return aa > bb ? -1 : (aa < bb ? 1 : 0);
            });
            return arr;
        } else if (op == "3") {
            arr.sort(function (a, b) {
                return a.total - b.total;
            });
            return arr;
        } else if (op == "4") {
            arr.sort(function (a, b) {
                return b.total - a.total;
            });
            return arr;
        }
    }
    $scope.updatesort = (op) => {
        let cur_op = op.singleSelect;
        $window.open(Fetchreq + '/categories?id=' + params + '&sortby=' + cur_op, "_self");
    }
    let options = {
        root: null,
        rootMargins: "0px",
        threshold: 0.5
    };
    const observer = new IntersectionObserver(handelIntersect, options);
    observer.observe(document.querySelector(".loadercatadj"));
    function handelIntersect(entries) {
        if (entries[0].isIntersecting) {
            console.warn("Loading Products");
            get_prds();
        }
    }
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