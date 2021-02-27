const express = require('express');
const productsroute = express.Router();
const path = require('path');
const productcrud = require(path.join(__dirname, "../db/helpers/productcrud"));
const categorycrud = require(path.join(__dirname, "../db/helpers/categorycrud"));
const ordercrud = require(path.join(__dirname, "../db/helpers/ordercrud"));
const usercrud = require(path.join(__dirname, "../db/helpers/usercrud"));
const fast2smsbulk = require(path.join(__dirname, "../utils/fast2smsbulk"))
const msgtemp = require(path.join(__dirname, "../utils/msgtemplate"))
const usermodel = require(path.join(__dirname, "../db/models/user"));

////////////////------------------------Admin-Operations------------------------------///////////////////
productsroute.post('/getpid', (req, res) => {
    var name = req.body.name;
    var rand = require(path.join(__dirname, "../utils/pidgen"));
    var num = rand();
    var p_id = name.slice(0, 4) + num;
    res.status(200).send({ pid: p_id });
})
productsroute.post('/newproduct', (req, res) => {
    var obj = req.body.obj;
    var today = new Date(Date.now());
    obj.date = today;
    // console.log(obj)
    var click = {};
    click[today] = 0;
    var order = {};
    order[today] = 0;
    obj.clicks = click;
    obj.orders = order;
    var cat = obj.category;
    var id = obj.prdid;
    categorycrud.categoryupdate(cat, id);
    productcrud.newProductAdd(obj, res);
})
productsroute.post('/updateproduct', (req, res) => {
    var obj = req.body.obj;
    var cat = obj.category;
    var id = obj.prdid;
    categorycrud.categoryupdate(cat, id);
    productcrud.updatewholeproduct(obj, res);
})
productsroute.get('/getproducts', (req, res) => {
    productcrud.getProduct(res);
})
productsroute.get('/getproductswid', (req, res) => {
    id = req.query;
    // console.log(id);
    productcrud.getProductwid(id.id, res);
})
productsroute.post('/getproductswid', (req, res) => {
    id = req.body;
    // console.log(id);
    productcrud.getProductwid(id.id, res);
})
productsroute.post('/updatesale', (req, res) => {
    var obj = req.body;
    productcrud.updateproduct(obj.id, obj.stat, res);

})
productsroute.post('/updatestock', (req, res) => {
    var obj = req.body;
    productcrud.updatestock(obj.id, obj.stat, res);

})
productsroute.post('/getorders', (req, res) => {
    var obj = req.body;
    if (obj.t == true) {
        var date = Date.now();
        ordercrud.gettodayorders(date, res);
    }
    if (obj.m == true) {
        var date = Date.now();
        ordercrud.getmonthorders(date, res);
    }
    if (obj.a == true) {
        var date = Date.now();
        ordercrud.getallorders(date, res);
    }

})
productsroute.post('/getordersbydate', (req, res) => {
    var obj = req.body;
    ordercrud.gettodayorders(obj.dt, res);
})
productsroute.post('/getorderswihid', (req, res) => {
    var obj = req.body;
    var orderId = obj.orderId;
    ordercrud.getorderswihid(orderId, res);

})
productsroute.post('/getuserwihid', (req, res) => {
    var obj = req.body;
    var userId = obj.userid;
    usercrud.getuserdata(userId, res);

})
productsroute.post('/updateordstatus', (req, res) => {
    var obj = req.body;
    var ord = obj.ord;
    var trx = obj.trx;
    var ref = obj.ref;
    var not = obj.not;
    if (ord) {
        if (ord == "05" || ord == "25") {
            var sendm = true;
            usermodel.findOne({ "userId": obj.order.userId }, { "phnumber": 1, "name": 1 }, (err, docs) => {
                if (err) {
                    console.log(err);
                }
                else {
                    var msg;
                    if (ord == '05') {
                        msg = msgtemp.formmsg(obj.order.orderId, obj.order.total);
                    } else {
                        msg = msgtemp.formmsgdel(obj.order.orderId, docs.name);
                    }
                    if (sendm) {
                        fast2smsbulk(docs.phnumber, msg);
                        sendm = false;
                    }
                }
            })
        }
    }
    ordercrud.updateorderstatus(obj.order.orderId, ord, trx, ref, not, res);

})
productsroute.post('/changetrackid', (req, res) => {
    var obj = req.body;
    var id = obj.id;
    var track = obj.track;
    ordercrud.changetrack(id, track, res);
})
productsroute.post('/deleteorder', (req, res) => {
    var obj = req.body;
    var id = obj.id;
    ordercrud.deleteorder(id, res);
})
productsroute.get('/updatetrendprd', (req, res) => {
    productcrud.updatetrendprd(res);

})
productsroute.post('/deleteprd', (req, res) => {
    var id = req.body.id;
    productcrud.deleteprd(id, res);

})
productsroute.get('/updatetopprd', (req, res) => {
    productcrud.updatetopprd(res);

})
productsroute.post('/allorders', (req, res) => {
    ordercrud.getallordersadj1(res);
})
productsroute.post('/loadtrendprds', (req, res) => {
    var qty = req.body.qty;
    productcrud.loadtrendprds(qty, res);
})
productsroute.post('/loadrecentViewd', (req, res) => {
    var qty = req.body.qty;
    productcrud.loadrecentViewd(qty, res);
})
productsroute.get('/getallcat', (req, res) => {
    categorycrud.getcategoryname(res);
})
productsroute.post('/updatepartcat', (req, res) => {
    var cat = req.body.cat;
    categorycrud.updatepartcat(cat, res);
})
productsroute.post('/updateSizePrds', (req, res) => {
    var size = req.body.size;
    var prIDS = req.body.prIDS;
    var stock = req.body.stock;
    productcrud.updateSizePrds(prIDS, size, stock, res);
})
module.exports = productsroute;

