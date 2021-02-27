const express = require('express');
const categoryroute = express.Router();
const path = require('path');
const categorycrud = require(path.join(__dirname, "../db/helpers/categorycrud"));
const productcrud = require(path.join(__dirname, "../db/helpers/productcrud"));

categoryroute.get('/getcategory', (req, res) => {
    categorycrud.getcategory(res);
})
categoryroute.post('/getcatprd', (req, res) => {
    var prds = req.body.prds;
    // console.log(prds)
    productcrud.getProductwid(prds, res);
})
categoryroute.post('/addcatprd', (req, res) => {
    var prds = req.body.obj;
    // console.log(prds)
    categorycrud.addcategory(prds, res);
})
module.exports = categoryroute;

