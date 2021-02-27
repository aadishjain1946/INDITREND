const path = require('path');
const connection = require(path.join(__dirname, '../connections/productcnt'));
const schema = connection.Schema;
const orderSchema = new schema({
    "orderId": { type: String, require: true, unique: true },
    "products": { type: Array, require: true },
    "date": { type: Date, required: true },
    "delivdate": { type: Date },
    "total": { type: Number, require: true },
    "status": { type: String, require: true },
    "paymentStatus": { type: String, required: true },
    "address": { type: Object, required: true },
    "userId": { type: String, required: true },
    "note": { type: String },
    "refund": { type: Boolean },
    "returnlink": { type: String, default: "size" },
    "tracking": { type: String, default: "NA" },
    "razorpay": { type: Object },
    "cashondelivery": { type: Boolean, default: false }
})
const orderModel = connection.model('orders', orderSchema);
module.exports = orderModel;
