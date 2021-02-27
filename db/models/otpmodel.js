const path = require('path');
const connection = require(path.join(__dirname, '../connections/productcnt'));
const schema = connection.Schema;
const opt = new schema({
    'phnumber': { type: Number, required: true },
    'otp': { type: String, require: true },
    'createdAt': { type: Date, expires: 300, default: Date.now }
})
const optModel = connection.model('otps', opt);
module.exports = optModel;
