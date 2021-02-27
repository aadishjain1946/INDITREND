const path = require('path');
const usermodel = require(path.join(__dirname, "../models/user"));
const otpmodel = require(path.join(__dirname, "../models/otpmodel"));
const otp = require(path.join(__dirname, '../../utils/otp'));
const cartclass = require(path.join(__dirname, '../../utils/cartclass'));
const fast2sms = require(path.join(__dirname, '../../utils/fast2sms'));
const encrypt = require(path.join(__dirname, '../../utils/encrypt'));
const useroperations = {
    getuserdata(uid, res) {
        usermodel.findOne({ "userId": uid }, { "password": 0, "totalspent": 0, "email_verified": 0 }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, data: {} });
            }
            else {
                res.status(200).send({ status: 200, data: docs });
            }
        })
    },
    registergoogleuser_succ(phone, userId, res) {
        usermodel.updateOne({ "userId": userId }, { "phnumber": phone, "phnumber_verified": true }, (err) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    addgoogleotp(phone, opt, res) {
        otpmodel.updateOne({ "phnumber": phone }, { "phnumber": phone, "otp": opt, "createdAt": new Date() }, { 'upsert': true }, (err) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Something Went Wrong' });
            }
            else {
                fast2sms(phone, opt);
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    verifyotp(phone, opt, res) {
        otpmodel.findOne({ "phnumber": phone }, { "otp": 1 }, (err, doc) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                if (doc && otp.verify(doc.otp) && doc.otp == opt) {
                    res.status(200).send({ status: 200, message: 'Record Added', verified: true });
                } else {
                    res.status(200).send({ status: 200, message: 'Record Added', verified: false });
                }
            }
        })
    }, phoneverifycheck(userId, res) {
        usermodel.updateOne({ "userId": userId }, { "phnumber_verified": true }, (err) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    checkphonenumber(phone, res) {
        usermodel.findOne({ "phnumber": phone }, (err, doc) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                if (!doc) {
                    res.status(200).send({ status: 200, message: 'OK', verified: true });
                } else {
                    res.status(200).send({ status: 200, message: 'Phone Number Already taken.', verified: false });
                }
            }
        })
    },
    localregister(obj, res) {
        usermodel.create(obj, (err) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    addtowishlist(prds, userId, res) {
        usermodel.findOne({ "userId": userId }, (err, doc) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                if (doc) {
                    var index = doc.wishlist.find(o => o == prds);
                    if (!index) {
                        usermodel.updateOne({ "userId": userId }, { "$push": { "wishlist": prds } }, (err) => {
                            if (err) {
                                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                            }
                            else {
                                res.status(200).send({ status: 200, message: 'Product Added to WishList' });
                            }
                        })

                    } else {
                        res.status(200).send({ status: 200, message: 'Product Already in WishList' });
                    }
                }
            }
        })
    },
    removetowishlist(prds, userId, res) {
        usermodel.updateOne({ "userId": userId }, { "$pull": { "wishlist": prds } }, (err) => {
            if (err) {
                // console.log(err)
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    updatename_email(userId, name, email, res) {
        usermodel.updateOne({ "userId": userId }, { 'email': email, 'name': name }, (err) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    addnewadd(userId, add, res) {
        usermodel.updateOne({ "userId": userId }, { "$push": { "address": add } }, (err) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    updateaddress(userId, add, index, res) {
        // var prop = "address.$[" + index + "]";
        usermodel.updateOne({ "userId": userId }, { "$set": { ['address.' + index]: add } }, (err) => {
            if (err) {
                console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    deleteaddress(userId, index, res) {
        usermodel.updateOne({ "userId": userId }, { "$unset": { ["address." + index]: 1 } }, (err) => {
            if (err) {
                console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                usermodel.updateOne({ "userId": userId }, { "$pull": { "address": null } }, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                    }
                    else {
                        res.status(200).send({ status: 200, message: 'Record Added' });
                    }
                })
            }
        })
    },
    setdefaultaddress(userId, index, res) {
        usermodel.updateOne({ "userId": userId }, { "$set": { 'defaultadd': index } }, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    changepassworddefault(userId, storepwd, res) {
        usermodel.updateOne({ "userId": userId }, { "$set": { 'password': storepwd } }, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    changeuserpassword(userId, curr, newpwd, res) {
        usermodel.findOne({ "userId": userId }, (err, doc) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                if (doc && !doc.googleUser) {
                    if (encrypt.compareHash(curr, doc.password)) {
                        var storepwd = encrypt.encryptPassword(newpwd);
                        this.changepassworddefault(userId, storepwd, res);
                    }
                    else {
                        res.status(200).send({ status: 500, message: 'Enter Password is Wrong.', pass: false });
                    }
                }
            }
        })
    },
    resetpassword(ph, pwd, res) {
        usermodel.updateOne({ "phnumber": ph }, { "$set": { 'password': pwd } }, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    addproducttocart(userId, size, pid, res) {
        usermodel.findOne({ "userId": userId }, (err, doc) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                // console.log(userId, size, pid);
                // console.log(doc.cart);
                // console.log('cart' in doc);
                if (doc && (doc.cart) && doc.cart.product) {
                    if (doc.cart.product.find(o => o.pid == pid && o.size == size)) {
                        res.status(200).send({ status: 200, message: 'Product Already in Cart' });
                    }
                    else {
                        var prdcart = {};
                        prdcart['pid'] = pid;
                        prdcart['size'] = size;
                        prdcart['qty'] = 1;
                        var cart = doc.cart;
                        cart.product.push(prdcart);
                        usermodel.updateOne({ "userId": userId }, { "$set": { 'cart': cart } }, (err) => {
                            if (err) {
                                // console.log(err);
                                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                            }
                            else {
                                res.status(200).send({ status: 200, message: 'Product Added to Cart.' });
                            }
                        })
                    }
                } else {
                    // console.log(userId, size, pid, doc.cart);
                    var prdcart = {};
                    prdcart['pid'] = pid;
                    prdcart['size'] = size;
                    prdcart['qty'] = 1;
                    var c1 = cartclass(prdcart, doc.address[doc.defaultadd]);
                    usermodel.updateOne({ "userId": userId }, { "$set": { 'cart': c1 } }, (err) => {
                        if (err) {
                            // console.log(err);
                            res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                        }
                        else {
                            res.status(200).send({ status: 200, message: 'Product Added to Cart.' });
                        }
                    })
                }
            }
        })
    },
    updateaddcart(userId, ind, res) {
        usermodel.findOne({ "userId": userId }, (err, doc) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            } else {
                usermodel.updateOne({ "userId": userId }, { "$set": { 'cart.address': doc.address[ind] } }, (err) => {
                    if (err) {
                        // console.log(err);
                        res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                    }
                    else {
                        res.status(200).send({ status: 200, message: 'Record Added' });
                    }
                })
            }
        })
    },
    removecartproduct(userId, id, size, res) {
        usermodel.findOne({ "userId": userId }, (err, doc) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                if (doc) {
                    var cart = doc.cart;
                    var index = cart.product.findIndex(o => o.pid == id && o.size == size);
                    cart.product.splice(index, 1);
                    usermodel.updateOne({ "userId": userId }, { "$set": { 'cart': cart } }, (err) => {
                        if (err) {
                            // console.log(err);
                            res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                        }
                        else {
                            res.status(200).send({ status: 200, message: 'Record Added' });
                        }
                    })
                } else {
                    res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
                }
            }
        })
    },
    changequantity(userId, index, qty, res) {
        usermodel.updateOne({ "userId": userId }, { "$set": { ['cart.product.' + index + ".qty"]: qty } }, (err) => {
            if (err) {
                // console.log(err);
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
}
module.exports = useroperations;