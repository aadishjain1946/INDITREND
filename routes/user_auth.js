const express = require('express');
const userRoutes = express.Router();
const path = require('path');
const passport = require('../utils/googlelogin');
const passport1 = require('../utils/passport');
var uniqid = require('uniqid');
const otp = require(path.join(__dirname, '../utils/otp'));
const usercrud = require(path.join(__dirname, '../db/helpers/usercrud'));
const encrypt = require(path.join(__dirname, '../utils/encrypt'));


userRoutes.get("/googleauth", passport.authenticate('google', { scope: ['profile', 'email'] }));
userRoutes.get("/authgoogle", passport.authenticate('google'), (req, res) => {
    res.send({ token: req.user });
});
userRoutes.post('/otpsendgoogle', (req, res) => {
    var opt = otp.generate();
    var phone = req.body.phno;
    usercrud.addgoogleotp(phone, opt, res);
})
userRoutes.post('/checkphoneno', (req, res) => {
    var phone = req.body.phno;
    usercrud.checkphonenumber(phone, res);
})
userRoutes.post('/otpverifygoogle', (req, res) => {
    var phone = req.body.phno;
    var opt = req.body.otp;
    // console.log(opt, phone)
    usercrud.verifyotp(phone, opt, res);
})
userRoutes.post("/localauth", passport1.authenticate('local'), (req, res) => {
    if (req.user == "password") {
        res.send({ msg: "Incorrect Password", token: false });
    }
    else if (req.user == "username") {
        res.send({ msg: "Username Not found", token: false });
    }
    else {
        res.send({ token: req.user });
    }
});
userRoutes.post("/localregister", (req, res) => {
    var obj = req.body.userObj;
    var u = obj.name;
    var uno = u.slice(0, 5);
    var userId = uniqid(uno);
    obj.userId = userId;
    obj.password = encrypt.encryptPassword(obj.password);
    // console.log(obj);
    usercrud.localregister(obj, res);
});
userRoutes.post("/resetpwd", (req, res) => {
    var obj = req.body.obj;
    var ph = obj.phnumber;
    // console.log(obj)
    var password = encrypt.encryptPassword(obj.password);
    usercrud.resetpassword(ph, password, res);
});
module.exports = userRoutes;

