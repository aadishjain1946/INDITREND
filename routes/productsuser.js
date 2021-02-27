const express = require('express');
const products_user_route = express.Router();
const path = require('path');
const productcrud = require(path.join(__dirname, "../db/helpers/productcrud"));
const categorycrud = require(path.join(__dirname, "../db/helpers/categorycrud"));
const ordercrud = require(path.join(__dirname, "../db/helpers/ordercrud"));

products_user_route.get('/gettrenpid', (req, res) => {
    categorycrud.get_cat_pid("Trending", res);
})
products_user_route.post('/getprdw_id', (req, res) => {
    var prds = req.body.prds;
    var cat = req.body.cat;
    // console.log(prds)
    if (cat == "NewArrival") {
        productcrud.getuser_Productcatbasis(prds, res);
    }
    else {
        productcrud.getuser_Productwid(prds, cat, res);
    }
})
products_user_route.post('/getproduct', (req, res) => {
    var prds = req.body.pid;
    productcrud.getProductwid(prds, res);

})
products_user_route.get('/getarrprdw_id', (req, res) => {
    productcrud.getuser_Productnewarr(res);
})
products_user_route.get('/gettoppid', (req, res) => {
    categorycrud.get_cat_pid("Top", res);
})
products_user_route.post('/getcatpids', (req, res) => {
    var cat = req.body.cat;
    // console.log(prds)
    if (cat == "NewArrival") {
        productcrud.get_newarrival_pid(res);
    }
    else {
        categorycrud.get_cat_pid(cat, res);
    }
})
products_user_route.get('/updateclick', (req, res) => {
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    var qur = req.query;
    productcrud.findclick(qur.id, date, res);
})
products_user_route.post('/getproductid', (req, res) => {
    id = req.body.id;
    // console.log(id);
    productcrud.getProductwidrestricted(id, res);
})
products_user_route.post('/getorderdata', (req, res) => {
    var obj = req.body;
    var id = obj.id;
    ordercrud.getorderbyid(id, res);
})
products_user_route.post('/cancelorder', (req, res) => {
    var obj = req.body;
    var id = obj.id;
    ordercrud.cancelorder(id, res);
})
products_user_route.post('/returnsize', (req, res) => {
    var obj = req.body;
    var id = obj.id;
    ordercrud.returnsize(id, res);
})
products_user_route.post('/returndefective', (req, res) => {
    var obj = req.body;
    var id = obj.id;
    var link = obj.link;
    ordercrud.returndefective(id,link, res);
})
module.exports = products_user_route;