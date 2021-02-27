inditrends.controller('verifystatcltr', ($scope, $location, Fetchreq, verifystatfact) => {
    var url = $location.absUrl();
    // // console.log(url);
    document.querySelector('meta[property="og:url"]').setAttribute('content', url);
    // let params = (new URL(url)).searchParams.get("orderId");
    // if (params) {
    //     var checkorder_promise = verifystatfact.getorderstat(params);
    //     checkorder_promise.then(data => {
    //         console.log(data.data.data[0]);
    //         var obj = data.data.data[0];
    //         if (obj.paymentStatus == '001') {
    //             document.title = "Order Placed Successfully | IndiTrend | India's Trending Fashion Hub"
    //             document.querySelector('meta[property="og:title"]').setAttribute('content', "Order Placed Successfully | IndiTrend | India's Trending Fashion Hub");
    //         } else if (obj.paymentStatus == '323') {
    //             document.title = "Order Pending | IndiTrend | India's Trending Fashion Hub"
    //             document.querySelector('meta[property="og:title"]').setAttribute('content', "Order Pending | IndiTrend | India's Trending Fashion Hub");
    //         } else {
    //             document.title = "Order Failed | IndiTrend | India's Trending Fashion Hub"
    //             document.querySelector('meta[property="og:title"]').setAttribute('content', "Order Failed | IndiTrend | India's Trending Fashion Hub");
    //         }
    //         $scope.orderdata = obj;
    //     }).catch(err => {
    //         $scope.trend_err = false;
    //         console.log(err);
    //     })
    // }
})