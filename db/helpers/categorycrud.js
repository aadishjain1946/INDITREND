const path = require('path');
const categorymodel = require(path.join(__dirname, "../models/category"));
const productmodel = require(path.join(__dirname, "../models/products"));
const categoryoperations = {
    categoryupdate(obj, id) {
        categorymodel.updateMany({ 'name': obj }, { $push: { 'products': id }, upsert: true }, (err) => {
            if (err) {
                console.log(err);
            }
        })
    },
    getcategory(res) {
        categorymodel.find((err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                res.status(200).send({ status: 200, data: docs });
            }
        })
    },
    getcategoryname(res) {
        categorymodel.find({}, { "name": 1 }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                res.status(200).send({ status: 200, data: docs });
            }
        })
    },
    addcategory(obj, res) {
        categorymodel.create(obj, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    get_cat_pid(name, res) {
        categorymodel.find({ "name": name }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                res.status(200).send({ status: 200, data: docs });
            }
        })
    },
    updatepartcat(name, res) {
        categorymodel.find({ "name": name }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                productmodel.find({ "prdid": docs[0].products }, (err, doc) => {
                    if (err) {
                        res.status(500).send({ status: 500, data: {} });
                    } else {
                        var arr = [];
                        for (let i = 0; i < doc.length; i++) {
                            var sudo = {};
                            sudo['prdid'] = doc[i].prdid;
                            let order = 0;
                            for (let j in doc[i].orders) {
                                order += doc[i].orders[j];
                            }
                            let click = 0;
                            for (let j in doc[i].clicks) {
                                click += doc[i].clicks[j];
                            }
                            sudo["score"] = (((35) * order) + ((35) * click) + (30) * doc[i].priority);
                            if (doc[i]["stocks"] == false) {
                                sudo["score"] = sudo["score"] - (75 * sudo["score"]);
                            }
                            console.log(doc[i]["stocks"]);
                            arr.push(sudo);
                        }
                        arr = arr.sort((a, b) => b.score - a.score);
                        var catproducts = [];
                        for (let i = 0; i < arr.length; i++) {
                            catproducts.push(arr[i].prdid);
                        }
                        categorymodel.updateOne({ 'name': name }, { $set: { 'products': catproducts } }, (err) => {
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
}
module.exports = categoryoperations;