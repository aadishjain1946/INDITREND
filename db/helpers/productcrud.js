const path = require('path');
const productmodel = require(path.join(__dirname, "../models/products"));
const categorymodel = require(path.join(__dirname, "../models/category"));
function compare(a, b) {
    if (a.priority < b.priority) {
        return 1;
    }
    if (a.priority > b.priority) {
        return -1;
    }
    return 0;
}
const productoperations = {
    newProductAdd(Obj, res) {
        productmodel.create(Obj, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    getProduct(res) {
        productmodel.find((err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                res.status(200).send({ status: 200, data: docs });
            }
        })
    },
    getProductwid(id, res) {
        productmodel.find({ "prdid": { '$in': id } }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                res.status(200).send({ status: 200, data: docs });
            }
        })
    },
    getProductwidrestricted(id, res) {
        productmodel.find({ "prdid": { '$in': id } }, { 'colour': 0, 'ads': 0, 'metadescription': 0, 'review': 0, 'size': 0, 'tags': 0, 'clicks': 0, 'orders': 0 }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                var obj = [];
                for (let i = 0; i < docs.length; i++) {
                    var sudo = {};
                    if (docs[i].salestat == false)
                        sudo['total'] = docs[i].margin_price + docs[i].retail_price + docs[i].shipping_price;
                    else
                        sudo['total'] = docs[i].margin_price + docs[i].retail_price + docs[i].shipping_price - docs[i].sale_price;
                    sudo['category'] = docs[i]['category'];
                    sudo['date'] = docs[i]['date'];
                    sudo['description'] = docs[i]['description'];
                    sudo['extraprice'] = docs[i]['extraprice'];
                    sudo['images'] = docs[i]['images'];
                    sudo['margin_price'] = docs[i]['margin_price'];
                    sudo['name'] = docs[i]['name'];
                    sudo['prdid'] = docs[i]['prdid'];
                    sudo['retail_price'] = docs[i]['retail_price'];
                    sudo['sale_price'] = docs[i]['sale_price'];
                    sudo['salestat'] = docs[i]['salestat'];
                    sudo['shipping_price'] = docs[i]['shipping_price'];
                    sudo['stocks'] = docs[i]['stocks'];
                    obj.push(sudo);
                }
                res.status(200).send({ status: 200, data: obj });
            }
        })
    },
    getuser_Productwid(id, cat, res) {
        productmodel.find({ "prdid": { '$in': id } }, { 'colour': 0, 'ads': 0, 'review': 0, 'size': 0, 'tags': 0 }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                var obj = [];
                for (let i = 0; i < id.length; i++) {
                    var data = docs[docs.findIndex(item => item.prdid === id[i])];
                    var sudo = {};
                    if (data.salestat == false)
                        sudo['total'] = data.margin_price + data.retail_price + data.shipping_price;
                    else
                        sudo['total'] = data.margin_price + data.retail_price + data.shipping_price - data.sale_price;
                    sudo['category'] = data['category'];
                    sudo['date'] = data['date'];
                    sudo['description'] = data['description'];
                    sudo['extraprice'] = data['extraprice'];
                    sudo['images'] = data['images'];
                    sudo['margin_price'] = data['margin_price'];
                    sudo['name'] = data['name'];
                    sudo['prdid'] = data['prdid'];
                    sudo['retail_price'] = data['retail_price'];
                    sudo['sale_price'] = data['sale_price'];
                    sudo['salestat'] = data['salestat'];
                    sudo['shipping_price'] = data['shipping_price'];
                    sudo['stocks'] = data['stocks'];
                    sudo['metadescription'] = data['metadescription']
                    obj.push(sudo);
                }
                obj = obj.slice(0, 6);
                res.status(200).send({ status: 200, data: obj });
            }
        })
    },
    getuser_Productnewarr(res) {
        productmodel.find({}, { 'colour': 0, 'ads': 0, 'review': 0, 'size': 0, 'tags': 0 }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                var obj = [];
                for (let i = 0; i < docs.length; i++) {
                    var sudo = {};
                    if (docs[i].salestat == false)
                        sudo['total'] = docs[i].margin_price + docs[i].retail_price + docs[i].shipping_price;
                    else
                        sudo['total'] = docs[i].margin_price + docs[i].retail_price + docs[i].shipping_price - docs[i].sale_price;
                    sudo['category'] = docs[i]['category'];
                    sudo['date'] = docs[i]['date'];
                    sudo['description'] = docs[i]['description'];
                    sudo['extraprice'] = docs[i]['extraprice'];
                    sudo['images'] = docs[i]['images'];
                    sudo['margin_price'] = docs[i]['margin_price'];
                    sudo['name'] = docs[i]['name'];
                    sudo['prdid'] = docs[i]['prdid'];
                    sudo['retail_price'] = docs[i]['retail_price'];
                    sudo['sale_price'] = docs[i]['sale_price'];
                    sudo['salestat'] = docs[i]['salestat'];
                    sudo['shipping_price'] = docs[i]['shipping_price'];
                    sudo['stocks'] = docs[i]['stocks'];
                    sudo['metadescription'] = docs[i]['metadescription']
                    sudo['priority'] = docs[i]['priority'];
                    obj.push(sudo);
                }
                obj.sort((a, b) => (a.priority < b.priority) ? 1 : -1);
                obj = obj.slice(0, 6);
                res.status(200).send({ status: 200, data: obj });
            }
        }).sort({ date: -1 });
    },
    getuser_Productcatbasis(id, res) {
        productmodel.find({ "prdid": { '$in': id } }, { 'colour': 0, 'ads': 0, 'review': 0, 'size': 0, 'tags': 0 }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                var arr = [];
                for (let i = 0; i < id.length; i++) {
                    var ind = docs.findIndex(obj => obj.prdid === id[i]);
                    var sudo = {};
                    if (docs[ind].salestat == false)
                        sudo['total'] = docs[ind].margin_price + docs[ind].retail_price + docs[ind].shipping_price;
                    else
                        sudo['total'] = docs[ind].margin_price + docs[ind].retail_price + docs[ind].shipping_price - docs[ind].sale_price;
                    sudo['category'] = docs[ind]['category'];
                    sudo['date'] = docs[ind]['date'];
                    sudo['description'] = docs[ind]['description'];
                    sudo['extraprice'] = docs[ind]['extraprice'];
                    sudo['images'] = docs[ind]['images'];
                    sudo['margin_price'] = docs[ind]['margin_price'];
                    sudo['name'] = docs[ind]['name'];
                    sudo['prdid'] = docs[ind]['prdid'];
                    sudo['retail_price'] = docs[ind]['retail_price'];
                    sudo['sale_price'] = docs[ind]['sale_price'];
                    sudo['salestat'] = docs[ind]['salestat'];
                    sudo['shipping_price'] = docs[ind]['shipping_price'];
                    sudo['stocks'] = docs[ind]['stocks'];
                    sudo['metadescription'] = docs[ind]['metadescription']
                    arr.push(sudo);
                }
                res.status(200).send({ status: 200, data: arr });
            }
        }).limit(6);
    },
    get_newarrival_pid(res) {
        productmodel.find({}, { 'prdid': 1, 'priority': 1 }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                docs.sort(compare);
                var newarrival = {};
                newarrival["name"] = "New Arrival";
                newarrival["tags"] = ["kurti", "plazo", "sharara", "new arrivals", "kurtis", "kurtas", "dresses", "shoponline", "new design", "new kurti design"];
                newarrival["meta_desc"] = "New arrivals for women - Buy latest Indian wear for women at IndiTrends. Explore our wide range of new dresses, suits & kurtis for women & Get FREE Shipping";
                newarrival["meta_name"] = "New Arrival Collection - Women wear Kurtis, Palazzo set, kurti and sharara set";
                newarrival["products"] = [];
                for (let i = 0; i < docs.length; i++) {
                    newarrival["products"].push(docs[i].prdid);
                }
                newarrdata = [];
                newarrdata.push(newarrival);
                res.status(200).send({ status: 200, data: newarrdata });
            }
        }).sort({ date: -1 });
    },
    updatewholeproduct(Obj, res) {
        productmodel.updateOne({ "prdid": Obj.prdid }, Obj, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    updaterating(userId, prid, rat, res) {
        var obj = {};
        obj[userId] = rat;
        if (rat < 3) {
            res.status(200).send({ status: 200, message: 'Record Added' });
        } else {

            productmodel.updateMany({ "prdid": { '$in': prid } }, { "$push": { "review": obj } }, (err) => {
                if (err) {
                    // console.log(err);
                    res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                }
                else {
                    res.status(200).send({ status: 200, message: 'Record Added' });
                }
            })
        }
    },
    updateproduct(id, stat, res) {
        productmodel.updateOne({ "prdid": id }, { "$set": { "salestat": stat } }, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record updated' });
            }
        })
    },
    updatestock(id, stat, res) {
        productmodel.updateOne({ "prdid": id }, { "$set": { "stocks": stat } }, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record updated' });
            }
        })
    },
    updateclick(id, date, res) {
        productmodel.updateOne({ "prdid": id }, { "$inc": { ["clicks." + date]: 1 } }, (err) => {
            if (err) {
                console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
            }
            else {
                // console.log("Record updated")
                res.status(200).send({ status: 200, message: 'Record updated' });
            }
        })
    }, setclick(id, date, res) {
        productmodel.updateOne({ "prdid": id }, { "$set": { ["clicks." + date]: 1 } }, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
            }
            else {
                // console.log("Record set")
                res.status(200).send({ status: 200, message: 'Record set' });
            }
        })
    }, findclick(id, date, res) {
        productmodel.find({ "prdid": id }, { ["clicks." + date]: 1 }, (err, doc) => {
            if (err) {
                console.log(err);
            }
            else {
                // console.log(doc[0].clicks);
                if (doc[0].clicks) {
                    productoperations.updateclick(id, date, res);
                } else {
                    productoperations.setclick(id, date, res);
                }
            }
        })
    },
    updateSizePrds(IDs, size, stock, res) {
        productmodel.updateMany({ "prdid": IDs }, { "$set": { "size": size, "stocks": stock } }, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    updateorder(id, qty, date) {
        //ONLY USED WITH PAYMENTS
        productmodel.updateOne({ "prdid": id }, { "$inc": { ["orders." + date]: qty } }, (err) => {
            if (err) {
                console.log(err);
                // res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
            }
            // else {
            //     // console.log("Record updated")
            //     res.status(200).send({ status: 200, message: 'Record updated' });
            // }
        })
    }, setorder(id, qty, date) {
        //ONLY USED WITH PAYMENTS
        productmodel.updateOne({ "prdid": id }, { "$set": { ["orders." + date]: qty } }, (err) => {
            if (err) {
                console.log(err);
                // res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
            }
            // else {
            //     res.status(200).send({ status: 200, message: 'Record set' });
            // }
        })
    },
    findorder(id, date, res) {
        productmodel.find({ "prdid": id }, { ["orders." + date]: 1 }, (err, doc) => {
            if (err) {
                console.log(err);
            }
            else {
                // console.log(doc[0].orders);
                if (doc[0].orders) {
                    productoperations.updateorder(id, date, res);
                } else {
                    productoperations.setorder(id, date, res);
                }
            }
        })
    },
    updatetrendprd(res) {
        categorymodel.updateOne({ 'name': 'Trending' }, { $set: { 'products': [] } }, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
            }
            else {
                productmodel.find({}, { 'prdid': 1, 'clicks': 1, 'priority': 1 }, (err, doc) => {
                    if (err) {
                        // console.log(err);
                        res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
                    } else {
                        var arr = [];
                        for (let i = 0; i < doc.length; i++) {
                            var sudo = {};
                            sudo['prdid'] = doc[i].prdid;
                            let click = 0;
                            for (let j in doc[i].clicks) {
                                click += doc[i].clicks[j];
                            }
                            sudo["score"] = ((0.7) * click + (0.3) * doc[i].priority);
                            arr.push(sudo);
                        }
                        arr = arr.sort((a, b) => b.score - a.score);
                        // console.log(arr);
                        arr = arr.slice(0, 20)
                        var trending = [];
                        for (let i = 0; i < arr.length; i++) {
                            trending.push(arr[i].prdid);
                        }
                        categorymodel.updateOne({ 'name': 'Trending' }, { $set: { 'products': trending } }, (err) => {
                            if (err) {
                                res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
                            } else {
                                res.status(200).send({ status: 200, message: 'Record Added' });
                            }

                        })

                    }
                })
            }
        })
    },
    updatetopprd(res) {
        categorymodel.updateOne({ 'name': 'Top' }, { $set: { 'products': [] } }, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
            }
            else {
                productmodel.find({}, { 'prdid': 1, 'orders': 1, 'priority': 1 }, (err, doc) => {
                    if (err) {
                        // console.log(err);
                        res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
                    } else {
                        var arr = [];
                        for (let i = 0; i < doc.length; i++) {
                            var sudo = {};
                            sudo['prdid'] = doc[i].prdid;
                            let order = 0;
                            for (let j in doc[i].orders) {
                                order += doc[i].orders[j];
                            }
                            sudo["score"] = ((0.7) * order + (0.3) * doc[i].priority);
                            arr.push(sudo);
                        }
                        arr = arr.sort((a, b) => b.score - a.score);
                        arr = arr.slice(0, 20)
                        var top = [];
                        for (let i = 0; i < arr.length; i++) {
                            top.push(arr[i].prdid);
                        }
                        categorymodel.updateOne({ 'name': 'Top' }, { $set: { 'products': top } }, (err) => {
                            if (err) {
                                res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
                            } else {
                                res.status(200).send({ status: 200, message: 'Record Added' });
                            }

                        })

                    }
                })
            }
        })
    },
    deleteprd(id, res) {
        productmodel.deleteOne({ "prdid": id }, (err) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not updated Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    loadtrendprds(qty, res) {
        productmodel.find({}, { 'colour': 0, 'ads': 0, 'review': 0, 'size': 0, 'tags': 0 }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                // console.log(docs.length);
                var arr = [];
                for (let i = 0; i < docs.length; i++) {
                    var sudo = {};
                    if (docs[i].salestat == false)
                        sudo['total'] = docs[i].margin_price + docs[i].retail_price + docs[i].shipping_price;
                    else
                        sudo['total'] = docs[i].margin_price + docs[i].retail_price + docs[i].shipping_price - docs[i].sale_price;
                    sudo['category'] = docs[i]['category'];
                    sudo['date'] = docs[i]['date'];
                    sudo['description'] = docs[i]['description'];
                    sudo['extraprice'] = docs[i]['extraprice'];
                    sudo['images'] = docs[i]['images'];
                    sudo['margin_price'] = docs[i]['margin_price'];
                    sudo['name'] = docs[i]['name'];
                    sudo['prdid'] = docs[i]['prdid'];
                    sudo['retail_price'] = docs[i]['retail_price'];
                    sudo['sale_price'] = docs[i]['sale_price'];
                    sudo['salestat'] = docs[i]['salestat'];
                    sudo['shipping_price'] = docs[i]['shipping_price'];
                    sudo['stocks'] = docs[i]['stocks'];
                    sudo['metadescription'] = docs[i]['metadescription']
                    sudo['clicks'] = docs[i]['clicks'];
                    sudo['orders'] = docs[i]['orders'];
                    var ordert = 0, clickt = 0;
                    for (j in docs[i]['orders']) {
                        ordert += docs[i]['orders'][j];
                    }
                    for (j in docs[i]['clicks']) {
                        clickt += docs[i]['clicks'][j];
                    }
                    sudo['score'] = (((0.4) * clickt) + ((0.6) * ordert)) / 100;
                    arr.push(sudo);
                }
                arr.sort(function (a, b) {
                    return b.score - a.score;
                });
                // console.log(arr.length);
                arr = arr.slice(0, qty);
                res.status(200).send({ status: 200, data: arr });
            }
        });
    }, loadrecentViewd(qty, res) {
        productmodel.find({}, { 'colour': 0, 'ads': 0, 'review': 0, 'size': 0, 'tags': 0 }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                // console.log(docs.length);
                var arr = [];
                for (let i = 0; i < docs.length; i++) {
                    var sudo = {};
                    if (docs[i].salestat == false)
                        sudo['total'] = docs[i].margin_price + docs[i].retail_price + docs[i].shipping_price;
                    else
                        sudo['total'] = docs[i].margin_price + docs[i].retail_price + docs[i].shipping_price - docs[i].sale_price;
                    sudo['category'] = docs[i]['category'];
                    sudo['date'] = docs[i]['date'];
                    sudo['description'] = docs[i]['description'];
                    sudo['extraprice'] = docs[i]['extraprice'];
                    sudo['images'] = docs[i]['images'];
                    sudo['margin_price'] = docs[i]['margin_price'];
                    sudo['name'] = docs[i]['name'];
                    sudo['prdid'] = docs[i]['prdid'];
                    sudo['retail_price'] = docs[i]['retail_price'];
                    sudo['sale_price'] = docs[i]['sale_price'];
                    sudo['salestat'] = docs[i]['salestat'];
                    sudo['shipping_price'] = docs[i]['shipping_price'];
                    sudo['stocks'] = docs[i]['stocks'];
                    sudo['metadescription'] = docs[i]['metadescription']
                    sudo['clicks'] = docs[i]['clicks'];
                    sudo['orders'] = docs[i]['orders'];
                    var ordert = 0, clickt = 0;
                    for (j in docs[i]['orders']) {
                        ordert += docs[i]['orders'][j];
                    }
                    for (j in docs[i]['clicks']) {
                        clickt += docs[i]['clicks'][j];
                    }
                    sudo['score'] = (((0.4) * clickt) + ((0.6) * ordert)) / 100;
                    maxDatearr = []
                    k = 0
                    for (j in sudo['clicks']) {
                        if (new Date(Date(j)) != "Invalid Date") {
                            dt = j.split('/')
                            str = dt[2] + '-' + dt[1] + '-' + dt[0]
                            // console.log(str,k++);
                            maxDatearr.push(new Date(str))
                        }
                    }
                    var maxIdx = new Date(Math.max.apply(null, maxDatearr))
                    sudo['maxDate'] = maxIdx;
                    // console.log(sudo['prdid'], maxDatearr,maxDatearr.length);
                    // console.log(maxIdx);
                    maxDatearr = []
                    arr.push(sudo);
                }
                arr.sort(function (a, b) {
                    return b.maxDate - a.maxDate;
                });
                arr = arr.slice(0, qty);
                res.status(200).send({ status: 200, data: arr });
            }
        });
    },
}
module.exports = productoperations;