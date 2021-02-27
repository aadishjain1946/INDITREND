inditrends.controller('verifycltr', ($scope,$window, Fetchreq) => {
    var orderid = localStorage.INDITRENDORDERIDCURR
    $window.open(Fetchreq + '/paymentstatus?orderId=' + orderid, "_self");
})