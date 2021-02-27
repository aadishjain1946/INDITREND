const path = require('path');
const connection = require(path.join(__dirname, '../connections/productcnt'));
const schema = connection.Schema;
const userSchema = new schema({
    'name': { type: String, required: true },
    'phnumber': { type: Number },
    'userId': { type: String, required: true, unique: true },
    'password': { type: String, default: "abc" },
    'email': { type: String, },
    'profilepic': { type: String, default: "/images/userpic.png" },
    'email_verified': { type: Boolean, default: false },
    'phnumber_verified': { type: Boolean, default: false },
    'googleUser': { type: Boolean, default: false },
    'notifications': { type: Array },
    'address': { type: Array },
    'defaultadd': { type: Number, default: 0 },
    'activeaddress': { type: String },
    'orders': { type: Array },
    'wishlist': { type: Array },
    'cart': { type: Object },
    'coupoun': { type: Array },
    'totalspent': { type: Number, default: 0 },
})
const userModel = connection.model('users', userSchema);
module.exports = userModel;
