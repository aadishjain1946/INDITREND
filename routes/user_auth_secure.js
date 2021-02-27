const express = require('express');
const usersecure = express.Router();
const path = require('path');
const jwt = require(path.join(__dirname, '../utils/jwt'));
const otp = require(path.join(__dirname, '../utils/otp'));
const pidgen = require(path.join(__dirname, '../utils/pidgen'));
var uniqid = require('uniqid');
const fast2sms = require(path.join(__dirname, '../utils/fast2sms'));
const usercrud = require(path.join(__dirname, '../db/helpers/usercrud'));
const ordercrud = require(path.join(__dirname, '../db/helpers/ordercrud'));
const productcrud = require(path.join(__dirname, '../db/helpers/productcrud'));
const productmodel = require(path.join(__dirname, "../db/models/products"));
const usermodel = require(path.join(__dirname, "../db/models/user"));
usersecure.get('/getudata', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    usercrud.getuserdata(userId, res);
})
usersecure.post('/otpsendgoogle', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var opt = otp.generate();
    var phone = req.body.phno;
    fast2sms(phone, opt);
    usercrud.addgoogleotp(phone, opt, res);
})
usersecure.post('/checkphoneno', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var phone = req.body.phno;
    usercrud.checkphonenumber(phone, res);
})
usersecure.post('/otpverifygoogle', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var phone = req.body.phno;
    var opt = req.body.otp;
    console.log(opt, phone)
    usercrud.verifyotp(phone, opt, res);
})
usersecure.get('/phoneverifycheck', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    usercrud.phoneverifycheck(userId, res);
})
usersecure.post('/registergoogleuser', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var phone = req.body.phno;
    usercrud.registergoogleuser_succ(phone, userId, res);
})
usersecure.post('/addtowishlist', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var prds = req.body.prds;
    usercrud.addtowishlist(prds, userId, res);
})
usersecure.post('/removetowishlist', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var prds = req.body.prds;
    usercrud.removetowishlist(prds, userId, res);
})
usersecure.post('/updatename_email', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var name = req.body.name;
    var email = req.body.email;
    usercrud.updatename_email(userId, name, email, res);
})
usersecure.post('/addnewadd', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var add = req.body.add;
    usercrud.addnewadd(userId, add, res);
})
usersecure.post('/updateaddress', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var add = req.body.add;
    // console.log(add)
    index = add.index;
    delete add.update;
    usercrud.updateaddress(userId, add, index, res);
})
usersecure.post('/deleteaddress', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var index = parseInt(req.body.index);
    usercrud.deleteaddress(userId, index, res);
})
usersecure.post('/setdefaultaddress', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var index = parseInt(req.body.index);
    usercrud.setdefaultaddress(userId, index, res);
})
usersecure.post('/changeuserpassword', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var curr = req.body.curr;
    var newpwd = req.body.newpwd;
    usercrud.changeuserpassword(userId, curr, newpwd, res);
})
usersecure.post('/addtocart', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var size = req.body.size;
    var pid = req.body.pid;
    usercrud.addproducttocart(userId, size, pid, res);
})
usersecure.post('/updateaddcart', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var ind = req.body.ind;
    usercrud.updateaddcart(userId, ind, res);
})
usersecure.post('/removecartproduct', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var id = req.body.id;
    var size = req.body.size;
    usercrud.removecartproduct(userId, id, size, res);
})
usersecure.post('/changequantity', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var qty = req.body.qty;
    var index = req.body.index;
    usercrud.changequantity(userId, index, qty, res);
})
usersecure.post('/initpayment', (req, res) => {
    var paymentmode = req.body.paymentmode;
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var orderObj = {};
    var userdata;
    usermodel.findOne({ "userId": userId }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).send({ status: 500, data: {} });
        } else {
            if (!doc.phnumber_verified) {
                // console.log(doc);/
                res.status(200).send({ status: 200, data: {}, phone: false });
            } else {
                userdata = doc;
                var ord1 = uniqid("INDTRND");
                var ord2 = pidgen();
                var orderid = ord1 + ord2;
                var cart = doc.cart;
                orderObj["orderId"] = orderid;
                orderObj["userId"] = userId;
                orderObj["date"] = Date.now();
                orderObj["status"] = "00";
                orderObj["paymentStatus"] = "000";
                orderObj["address"] = cart.address;
                var razorpayobj = {
                    'orderId': 'None',
                    'payment': 'None'
                }
                orderObj["razorpay"] = razorpayobj;
                var idArr = [];
                var productArr = [];
                var totalamount = 0;
                for (let i = 0; i < cart.product.length; i++) {
                    idArr.push(cart.product[i].pid);
                    productArr.push(cart.product[i]);
                }
                productmodel.find({ "prdid": { '$in': idArr } }, { 'prdid': 1, 'salestat': 1, 'retail_price': 1, 'margin_price': 1, 'sale_price': 1, 'shipping_price': 1 }, (err, docs) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({ status: 500, data: {} });
                    }
                    else {
                        for (let i = 0; i < docs.length; i++) {
                            index = productArr.findIndex(item => item.pid === docs[i].prdid);
                            var price = 0;
                            if (docs[i].salestat == true) {
                                price = docs[i].retail_price + docs[i].margin_price + docs[i].shipping_price - docs[i].sale_price;
                            } else {
                                price = docs[i].retail_price + docs[i].margin_price + docs[i].shipping_price;
                            }
                            totalamount += price * productArr[index].qty;
                            productArr[index]["prindexce"] = price;
                            productArr[index]["sale"] = docs[i].salestat;
                        }
                        if (paymentmode == 'online') {
                            orderObj["total"] = totalamount;
                        } else {
                            orderObj["total"] = totalamount + 50;
                            orderObj["cashondelivery"] = true;
                        }
                        orderObj["products"] = productArr;
                        ordercrud.createorder(orderObj, userdata, paymentmode, res);
                    }
                })
            }
        }
    });
})
usersecure.post('/updaterating', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var prid = req.body.prid;
    var rat = req.body.rat;
    productcrud.updaterating(userId, prid, rat, res);
})

module.exports = usersecure;

