const path = require('path');
const ordermodel = require(path.join(__dirname, "../models/orders"));
const usermodel = require(path.join(__dirname, "../models/user"));
const productcrud = require(path.join(__dirname, "../helpers/productcrud"));
const paytmpayment = require(path.join(__dirname, "../../utils/payment"));
const razorpaypayment = require(path.join(__dirname, "../../utils/razorpay"));
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
function formatmonth(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return month;
}
const orderoperations = {
    createorder(orderObj, userdata, paymentmode, res) {
        ordermodel.create(orderObj, (err) => {
            if (err) {
                res.status(500).send({ status: 500, data: { ordercreated: true } });
            } else {
                usermodel.updateOne({ "userId": userdata.userId }, { "$push": { "orders": orderObj.orderId } }, (err) => {
                    if (err) {
                        res.status(500).send({ status: 500, data: { ordercreated: true } });
                    } else {
                        if (paymentmode == 'online') {
                            razorpaypayment.initiatetransction(orderObj, userdata, res);
                        } else {
                            ordermodel.findOne({ "orderId": orderObj.orderId }, (err, doc) => {
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
                                            var ind = userdoc.orders.findIndex(obj => obj === orderObj.orderId);
                                            if (ind >= 0) {
                                                usermodel.updateOne({ "userId": doc.userId }, { "cart": {} }, (err) => {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                });
                                                ordermodel.updateOne({ "orderId": orderObj.orderId }, { "$set": { "paymentStatus": '242' } }, (err) => {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        res.status(200).send({ status: 200, data: { ordercreated: true, orderId: orderObj.orderId } });;
                                                    }
                                                })
                                            } else {
                                                usermodel.updateOne({ "userId": doc.userId }, { "$push": { "orders": orderObj.orderId } }, (err) => {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        usermodel.updateOne({ "userId": doc.userId }, { "cart": {} }, (err) => {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                        });
                                                        ordermodel.updateOne({ "orderId": orderObj.orderId }, { "$set": { "paymentStatus": '242' } }, (err) => {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                            else {
                                                                res.status(200).send({ status: 200, data: { ordercreated: true, orderId: orderObj.orderId } });;
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
                    }
                })
            }
        })
    },
    updatepaymentstatus(orderId, status, res) {
        ordermodel.updateOne({ "orderId": orderId }, { "$set": { "paymentStatus": status } }, (err) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    gettodayorders(date, res) {
        ordermodel.find({}, (err, doc) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                var arr = [];
                for (let i = 0; i < doc.length; i++) {
                    if (formatDate(doc[i].date) == formatDate(date)) {
                        // console.log(doc[i]);
                        arr.push(doc[i]);
                    }
                }
                res.status(200).send({ status: 200, doc: arr });
            }
        })
    },
    getmonthorders(date, res) {
        ordermodel.find({}, (err, doc) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                var arr = [];
                for (let i = 0; i < doc.length; i++) {
                    // console.log(formatmonth(doc[i].date));
                    // console.log(formatmonth(date));
                    if (formatmonth(doc[i].date) == formatmonth(date)) {
                        arr.push(doc[i]);
                    }
                }
                res.status(200).send({ status: 200, doc: arr });
            }
        })
    },
    getallorders(date, res) {
        ordermodel.find({}, (err, doc) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                res.status(200).send({ status: 200, doc: doc });
            }
        })
    },
    getorderswihid(orderId, res) {
        ordermodel.findOne({ "orderId": orderId }, (err, doc) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                res.status(200).send({ status: 200, doc: doc });
            }
        })
    },
    updateorderstatus(orderId, ord, trx, ref, not, res) {
        ordermodel.findOne({ "orderId": orderId }, (err, doc) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                // console.log(doc);
                if (!ord) {
                    ord = doc.status;
                }
                if (!trx) {
                    trx = doc.paymentStatus;
                }
                if (!ref) {
                    ref = doc.refund;
                }
                if (!not) {
                    not = doc.note;
                }
                ordermodel.updateOne({ "orderId": orderId }, { "$set": { "status": ord, "paymentStatus": trx, "refund": ref, "note": not, "delivdate": Date.now() } }, (err) => {
                    if (err) {
                        res.status(500).send({ status: 500, data: {} });
                    } else {
                        res.status(200).send({ status: 200, message: 'Record Added' });
                    }
                })
            }
        })
    },
    changetrack(orderId, track, res) {
        ordermodel.updateOne({ "orderId": orderId }, { "$set": { "tracking": track } }, (err) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    deleteorder(orderId, res) {
        ordermodel.find({ "orderId": orderId }, (err, doc) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                usermodel.updateOne({ "userId": doc.userId }, { "$pull": { "orders": orderId } }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                ordermodel.deleteOne({ "orderId": orderId }, (err, doc) => {
                    if (err) {
                        res.status(500).send({ status: 500, data: {} });
                    } else {
                        res.status(200).send({ status: 200, doc: doc });
                    }
                })
            }
        })
    },
    getorderbyid(orderId, res) {
        ordermodel.find({ "orderId": { '$in': orderId } }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                res.status(200).send({ status: 200, data: docs });
            }
        })
    },
    cancelorder(orderId, res) {
        ordermodel.find({ "orderId": orderId }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {}, message: "Something went Wrong" });
            } else {
                // console.log(docs);
                if (docs) {
                    if (docs[0].status == '00') {
                        ordermodel.updateOne({ "orderId": orderId }, { "status": '573' }, (err, doc) => {
                            if (err) {
                                res.status(500).send({ status: 500, data: {}, message: "Something went Wrong" });
                            } else {
                                res.status(200).send({ status: 200, data: {}, message: "Order Cancel request received" });
                            }
                        })
                    } else {
                        res.status(200).send({ status: 200, data: {}, message: "You cannot cancel this order.Because order is processed." });
                    }
                } else {
                    res.status(500).send({ status: 500, data: {}, message: "Something went Wrong" });
                }
            }
        })
    },
    returnsize(orderId, res) {
        ordermodel.find({ "orderId": { '$in': orderId } }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                var curdate = new Date();
                // console.log(new Date(), new Date(docs[0].delivdate), new Date(curdate.setDate(new Date(docs[0].delivdate).getDate() + 7)));
                if (new Date(curdate) >= new Date(docs[0].delivdate) && new Date(curdate) <= new Date(curdate.setDate(new Date(docs[0].delivdate).getDate() + 7))) {
                    ordermodel.updateOne({ "orderId": orderId }, { "status": "574", "returnlink": "size" }, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({ status: 500, data: {} });
                        } else {
                            res.status(200).send({ status: 200, data: {}, message: "Return initiated" });
                        }
                    })
                } else {
                    res.status(200).send({ status: 200, data: {}, message: "Return can initiate within 7 days of delivery" });
                }
            }
        })
    },
    returndefective(orderId, lin, res) {
        ordermodel.find({ "orderId": { '$in': orderId } }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                var curdate = new Date();
                if (new Date(curdate) >= new Date(docs[0].delivdate) && new Date(curdate) <= new Date(curdate.setDate(new Date(docs[0].delivdate).getDate() + 7))) {
                    ordermodel.updateOne({ "orderId": orderId }, { "status": "574", "returnlink": lin }, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({ status: 500, data: {} });
                        } else {
                            res.status(200).send({ status: 200, data: {}, message: "Return initiated" });
                        }
                    })
                } else {
                    res.status(200).send({ status: 200, data: {}, message: "Return can initiate within 7 days of delivery" });
                }
            }
        })
    },
    getallordersadj1(res) {
        ordermodel.find({}, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            } else {
                res.status(200).send({ status: 200, data: docs });
            }

        })
    },
}
module.exports = orderoperations;