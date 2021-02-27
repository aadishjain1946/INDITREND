const path = require('path');
const Razorpay = require('razorpay');
const ordermodel = require(path.join(__dirname, "../db/models/orders"));
const usermodel = require(path.join(__dirname, "../db/models/user"));
const productcrud = require(path.join(__dirname, "../db/helpers/productcrud"));
const crypto = require('crypto')
var request = require('request');
require('dotenv').config();
var razorpayOperations = {
    initiatetransction(obj, userdata, res) {
        var email = "";
        // console.log(userdata);
        if (userdata.email) {
            email = userdata.email;
        }
        const razorpayObject = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const options = {
            amount: obj.total * 100,
            currency: 'INR',
            receipt: obj.orderId,
            payment_capture: 1,
            notes: {
                "custId": userdata.userId,
                "mobileno": userdata.phnumber,
                "name": userdata.name,
                "email": email,
                "orderId": obj.orderId
            }
        }

        try {
            razorpayObject.orders.create(options, (err, responce) => {
                if (err) {
                    console.log(err);
                } else {
                    var dta = {
                        ...responce,
                        key_id: process.env.RAZORPAY_KEY_ID
                    }
                    res.status(200).send({ "data": dta });
                }
            })
        } catch (error) {
            console.log(error)
        }
    },
    verifytransction(obj, head, res) {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const shasum = crypto.createHmac('sha256', secret)
        shasum.update(JSON.stringify(obj))
        const digest = shasum.digest('hex')
        if (digest === head['x-razorpay-signature']) {
            // console.log(obj)
            // console.log(obj.payload)
            var payload = obj.payload;
            var paymentObjPay = payload.payment.entity;
            var razorpay_paymentId = paymentObjPay.id;
            var razorpay_paymentStatus = paymentObjPay.status;
            var orderId = paymentObjPay.notes.orderId;
            // console.log(paymentObjPay);
            if (payload.hasOwnProperty('order')) {
                var orderObjPay = payload.order.entity;
                var razorpay_orderId = orderObjPay.id;
                var razorpay_orderStatus = orderObjPay.status;
                var razorpayobj = {
                    'orderId': razorpay_orderId,
                    'payment': razorpay_paymentId
                }
                if (razorpay_orderStatus == "paid" && razorpay_paymentStatus == "captured") {

                    ordermodel.findOne({ "orderId": orderId }, (err, doc) => {
                        if (err) {
                            res.status(500).send({ status: 500, data: {} });
                        } else {
                            var today = new Date();
                            var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
                            for (let i = 0; i < doc.products.length; i++) {
                                productcrud.findorder(doc.products[i].pid, parseInt(doc.products[i].qty), date);
                            }
                            usermodel.findOne({ "userId": doc.userId }, (err, userdoc) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    var ind = userdoc.orders.findIndex(obj => obj === orderId);
                                    if (ind >= 0) {
                                        usermodel.updateOne({ "userId": doc.userId }, { "cart": {} }, (err) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                        });
                                        ordermodel.updateOne({ "orderId": orderId }, { "$set": { "paymentStatus": '001', 'razorpay': razorpayobj } }, (err) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                        })
                                    } else {
                                        usermodel.updateOne({ "userId": doc.userId }, { "$push": { "orders": orderId } }, (err) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                usermodel.updateOne({ "userId": doc.userId }, { "cart": {} }, (err) => {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                });
                                                ordermodel.updateOne({ "orderId": orderId }, { "$set": { "paymentStatus": '001', 'razorpay': razorpayobj } }, (err) => {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }

                            })
                        }
                    })

                } else {
                    ordermodel.findOne({ "orderId": orderId }, (err, doc) => {
                        if (err) {
                            console.log(err);
                        } else {
                            usermodel.findOne({ "userId": doc.userId }, (err, userdoc) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    var ind = userdoc.orders.findIndex(obj => obj === orderId);
                                    if (ind >= 0) {
                                        ordermodel.updateOne({ "orderId": orderId }, { "$set": { "paymentStatus": '232', 'razorpay': razorpayobj } }, (err) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                        })
                                    } else {
                                        usermodel.updateOne({ "userId": doc.userId }, { "$push": { "orders": orderId } }, (err) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                ordermodel.updateOne({ "orderId": orderId }, { "$set": { "paymentStatus": '232' } }, (err) => {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }

                            })

                        }
                    })
                }
            } else {
                var razorpayobj = {
                    'orderId': paymentObjPay.order_id,
                    'payment': razorpay_paymentId
                }
                ordermodel.findOne({ "orderId": orderId }, (err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        usermodel.findOne({ "userId": doc.userId }, (err, userdoc) => {
                            if (err) {
                                console.log(err);
                            } else {
                                var ind = userdoc.orders.findIndex(obj => obj === orderId);
                                if (ind >= 0) {
                                    ordermodel.updateOne({ "orderId": orderId }, { "$set": { "paymentStatus": '232', 'razorpay': razorpayobj } }, (err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                } else {
                                    usermodel.updateOne({ "userId": doc.userId }, { "$push": { "orders": orderId } }, (err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            ordermodel.updateOne({ "orderId": orderId }, { "$set": { "paymentStatus": '232' } }, (err) => {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            })
                                        }
                                    })
                                }
                            }

                        })

                    }
                })
            }
        } else {
            // pass it
        }
        res.json({ status: 'ok' })
    }, localverify(obj, res) {
        request('https://' + process.env.RAZORPAY_KEY_ID + ':' + process.env.RAZORPAY_KEY_SECRET + '@api.razorpay.com/v1/payments/' + obj.razorpay_payment_id, function (error, response, body) {
            body = JSON.parse(body);
            var orderId = body.notes.orderId;
            var status = body.status;
            var pay_id = body.id;
            var payorder = body.order_id;
            var razorpayobj = {
                'orderId': payorder,
                'payment': pay_id
            }
            if (status == 'captured') {
                ordermodel.updateOne({ "orderId": orderId }, { "$set": { "paymentStatus": '001', 'razorpay': razorpayobj } }, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.sendFile(path.join(__dirname + "/../public/transctionstatus.html"));
                    }
                })
            }
        });

    }
}
module.exports = razorpayOperations;