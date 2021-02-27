const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
const passport = require("./utils/googlelogin");
const passport1 = require("./utils/passport");
const session = require('express-session');
const paytmpayment = require(path.join(__dirname, "./utils/payment"));
const razorPay = require(path.join(__dirname, "./utils/razorpay"));
require('dotenv').config();
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header('Access-Control-Allow-Headers', 'application/json');
    next();
});
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
// STATIC RULES
app.use('/categories', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/products.html'));
})
app.use('/productpage', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/single.html'));
})
app.use('/userauth', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/register.html'));
})
app.use('/wishlist', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/wishlist.html'));
})
app.use('/userprofile', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/profile.html'));
})
app.use('/resetpassword', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/changepassword.html'));
})
app.use('/viewcart', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/checkout.html'));
})
app.use('/ordersummary', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/billing.html'));
})
app.use('/myorders', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/order.html'));
})
app.use('/orderdetails', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/orderprogress.html'));
})
app.use('/returninit', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/returnprd.html'));
})
app.use('/refundpolicy', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/refundpolicy.html'));
})
app.use('/shippingpolicy', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/shippingpolicy.html'));
})
app.use('/contactUs', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/contactus.html'));
})
app.use('/privacypolicy', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/privacypolicy.html'));
})
app.use('/termsofservices', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/termofservices.html'));
})
app.use('/paymentstatus', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/transctionstatus.html'));
})
app.use('/sitemap', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/sitemap.html'));
})
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: process.env.APP_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'None',
    }
}))
// ADMIN AND PRODUCT DISPLAY WHICH DOES'NT NEED AUTH TOKEN
app.use('/product', require(path.join(__dirname, "routes/products")));
app.use('/category', require(path.join(__dirname, "routes/category")));
app.use('/product_user', require(path.join(__dirname, "routes/productsuser")));
app.post('/paymentredirect', (request, res) => {
    var obj = request.body;
    var head = request.headers;
    razorPay.verifytransction(obj, head, res);

});
app.post('/paymentstatuscheck', (req, res) => {
    var obj = req.body;
    razorPay.localverify(obj, res);
});
app.use(passport.initialize());
app.use(passport.session());
app.use(passport1.initialize());
app.use(passport1.session());
app.use('/user_auth_api', require(path.join(__dirname, "routes/user_auth")));

// REQUIRED AUTH TOKEN
app.use(require(path.join(__dirname, 'utils/tokenmiddleware')));
app.use('/user_auth_secure', require(path.join(__dirname, "routes/user_auth_secure")));

app.listen(process.env.PORT || 5520, (err) => {
    if (err) {
        throw err;
    }
    else {
        console.log("IndiTrends online : )");
    }
})