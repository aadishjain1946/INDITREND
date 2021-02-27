const path = require('path');
const connection = require(path.join(__dirname, '../connections/productcnt'));
const schema = connection.Schema;
const productSchema = new schema({
    'prdid': { type: String, require: true, unique: true },
    'name': { type: String, required: true },
    'retail_price': { type: Number, require: true },
    'margin_price': { type: Number, require: true },
    'sale_price': { type: Number, require: true },
    'shipping_price': { type: Number, require: true },
    'images': { type: Array, require: true },
    'size': { type: Array, require: true },
    'category': { type: Array, require: true },
    'tags': { type: Array, require: true },
    'colour': { type: Array },
    'review': { type: Array },
    'clicks': { type: Object },
    'orders': { type: Object },
    'date': { type: Date, required: true },
    'description': { type: String, required: true },
    'ads': { type: Array },
    'metadescription': { type: String, required: true },
    'salestat': { type: Boolean, default: false },
    'stocks': { type: Boolean, default: true },
    'extraprice': { type: Number, require: true },
    'priority': { type: Number, default: 1 }
})
const productModel = connection.model('products', productSchema);
module.exports = productModel;
