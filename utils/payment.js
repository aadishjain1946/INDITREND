const path = require('path');
const PaytmChecksum = require("../node_modules/paytmchecksum/PaytmChecksum");
const ordermodel = require(path.join(__dirname, "../db/models/orders"));
const usermodel = require(path.join(__dirname, "../db/models/user"));
const productcrud = require(path.join(__dirname, "../db/helpers/productcrud"));
const https = require('https');
require('dotenv').config();
var paymentoperations = {
    initiatetransction(obj, userdata, res) {
        var paytmParams = {};
        paytmParams.body = {
            "requestType": "Payment",
            "mid": process.env.PAYTM_MID,
            "websiteName": process.env.PAYTM_WEBSITE,
            "orderId": obj.orderId,
            "callbackUrl": process.env.PAYTM_CALLBACK,
            "txnAmount": {
                "value": obj.total,
                "currency": "INR",
            },
            "userInfo": {
                "custId": userdata.userId,
                "mobileno": userdata.phnumber,
                "name": userdata.name
            },
        };
        PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANTKEY).then(function (checksum) {

            paytmParams.head = {
                "signature": checksum
            };

            var post_data = JSON.stringify(paytmParams);

            var options = {
                hostname: process.env.PAYTM_HOSTNAME,
                port: 443,
                path: '/theia/api/v1/initiateTransaction?mid=' + process.env.PAYTM_MID + '&orderId=' + obj.orderId,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };

            var response = "";
            var post_req = https.request(options, function (post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });
                post_res.on('end', function () {
                    // console.log('Response: ', JSON.parse(response));
                    var resp = JSON.parse(response);
                    var obj = {
                        ...resp,
                        "orderId": paytmParams.body.orderId,
                        "mid": paytmParams.body.mid,
                        "txnToken": resp.body.txnToken,
                        "WEBSITE": process.env.PAYTM_WEBSITE,
                        "CHECKSUMHASH": resp.head.signature,
                        "TXN_AMOUNT": paytmParams.body.txnAmount.value
                    }
                    res.status(200).send({ "data": obj });
                });
            });

            post_req.write(post_data);
            post_req.end();
        });
    },
    verifytransction(paytmpar, res) {
        var paytmChecksum;
        var paytmparaobj = {};
        for (let key in paytmpar) {
            if (key == "CHECKSUMHASH") {
                paytmChecksum = paytmpar[key];
            } else {
                paytmparaobj[key] = paytmpar[key];
            }
        }
        var isVerifySignature = PaytmChecksum.verifySignature(paytmparaobj, process.env.PAYTM_MERCHANTKEY, paytmChecksum);
        if (isVerifySignature) {
            // console.log("Checksum Matched");
            var paytmParams = {};
            paytmParams.body = {
                "mid": paytmpar.MID,
                "orderId": paytmpar.ORDERID,
            };
            PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANTKEY).then(function (checksum) {
                paytmParams.head = {
                    "signature": checksum
                };
                var post_data = JSON.stringify(paytmParams);

                var options = {
                    hostname: process.env.PAYTM_HOSTNAME,
                    port: 443,
                    path: '/v3/order/status',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };
                var response = "";
                var post_req = https.request(options, function (post_res) {
                    post_res.on('data', function (chunk) {
                        response += chunk;
                    });
                    post_res.on('end', function () {
                        // console.log('Response: ', JSON.parse(response));
                        var texresp = JSON.parse(response);
                        if (texresp.body.resultInfo.resultCode == '01') {
                            ordermodel.findOne({ "orderId": texresp.body.orderId }, (err, doc) => {
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
                                            res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                                        } else {
                                            var ind = userdoc.orders.findIndex(obj => obj === texresp.body.orderId);
                                            if (ind >= 0) {
                                                usermodel.updateOne({ "userId": doc.userId }, { "cart": {} }, (err) => {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                });
                                                ordermodel.updateOne({ "orderId": texresp.body.orderId }, { "$set": { "paymentStatus": '001' } }, (err) => {
                                                    if (err) {
                                                        res.status(500).send({ status: 500, data: {} });
                                                    } else {
                                                        res.sendFile(path.join(__dirname + "/../public/paymentverify.html"));
                                                    }
                                                })
                                            } else {
                                                usermodel.updateOne({ "userId": doc.userId }, { "$push": { "orders": texresp.body.orderId } }, (err) => {
                                                    if (err) {
                                                        res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                                                    }
                                                    else {
                                                        usermodel.updateOne({ "userId": doc.userId }, { "cart": {} }, (err) => {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                        });
                                                        ordermodel.updateOne({ "orderId": texresp.body.orderId }, { "$set": { "paymentStatus": '001' } }, (err) => {
                                                            if (err) {
                                                                res.status(500).send({ status: 500, data: {} });
                                                            } else {
                                                                res.sendFile(path.join(__dirname + "/../public/paymentverify.html"));
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        }

                                    })
                                }
                            })
                        } else if (texresp.body.resultInfo.resultCode == '294') {
                            ordermodel.findOne({ "orderId": texresp.body.orderId }, (err, doc) => {
                                if (err) {
                                    res.status(500).send({ status: 500, data: {} });
                                } else {
                                    usermodel.findOne({ "userId": doc.userId }, (err, userdoc) => {
                                        if (err) {
                                            res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                                        } else {
                                            var ind = userdoc.orders.findIndex(obj => obj === texresp.body.orderId);
                                            if (ind >= 0) {
                                                usermodel.updateOne({ "userId": doc.userId }, { "cart": {} }, (err) => {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                });
                                                ordermodel.updateOne({ "orderId": texresp.body.orderId }, { "$set": { "paymentStatus": '323' } }, (err) => {
                                                    if (err) {
                                                        res.status(500).send({ status: 500, data: {} });
                                                    } else {
                                                        res.sendFile(path.join(__dirname + "/../public/paymentverify.html"));
                                                    }
                                                })
                                            } else {
                                                usermodel.updateOne({ "userId": doc.userId }, { "$push": { "orders": texresp.body.orderId } }, (err) => {
                                                    if (err) {
                                                        res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                                                    }
                                                    else {
                                                        usermodel.updateOne({ "userId": doc.userId }, { "cart": {} }, (err) => {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                        });
                                                        ordermodel.updateOne({ "orderId": texresp.body.orderId }, { "$set": { "paymentStatus": '323' } }, (err) => {
                                                            if (err) {
                                                                res.status(500).send({ status: 500, data: {} });
                                                            } else {
                                                                res.sendFile(path.join(__dirname + "/../public/paymentverify.html"));
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
                            ordermodel.findOne({ "orderId": texresp.body.orderId }, (err, doc) => {
                                if (err) {
                                    res.status(500).send({ status: 500, data: {} });
                                } else {
                                    usermodel.findOne({ "userId": doc.userId }, (err, userdoc) => {
                                        if (err) {
                                            res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                                        } else {
                                            var ind = userdoc.orders.findIndex(obj => obj === texresp.body.orderId);
                                            if (ind >= 0) {
                                                ordermodel.updateOne({ "orderId": texresp.body.orderId }, { "$set": { "paymentStatus": '232' } }, (err) => {
                                                    if (err) {
                                                        res.status(500).send({ status: 500, data: {} });
                                                    } else {
                                                        res.sendFile(path.join(__dirname + "/../public/paymentverify.html"));
                                                    }
                                                })
                                            } else {
                                                usermodel.updateOne({ "userId": doc.userId }, { "$push": { "orders": texresp.body.orderId } }, (err) => {
                                                    if (err) {
                                                        res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                                                    }
                                                    else {
                                                        ordermodel.updateOne({ "orderId": texresp.body.orderId }, { "$set": { "paymentStatus": '232' } }, (err) => {
                                                            if (err) {
                                                                res.status(500).send({ status: 500, data: {} });
                                                            } else {
                                                                res.sendFile(path.join(__dirname + "/../public/paymentverify.html"));
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
                    });
                });
                post_req.write(post_data);
                post_req.end();
            });
        } else {
            console.log("Checksum Mismatched");
            res.status(200).send({ "message": "Stop messing around" });
        }
    }
}
module.exports = paymentoperations;