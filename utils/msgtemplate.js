var obj = {
    formmsg(id, price) {
        var msg = "Order Placed : Your Order With Order ID: " + id + " \n amounting to Rs." + price + " has been received.\nWe will send you an update when your order is packed/shipped.\nManage your order at MyOrder page \ninditrend.in";
        return msg;
    },
    formmsgdel(name,user) {
        var msg = "Delivered : " + name + " was Delivered to " + user + "\n Don't forget to fill feedback form.";
        return msg;
    }
}
module.exports = obj;