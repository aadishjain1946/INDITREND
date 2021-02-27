const path = require('path');
const connection = require(path.join(__dirname, '../connections/productcnt'));
const schema = connection.Schema;
const categorySchema = new schema({
    'name': { type: String, unique: true },
    'meta_name': { type: String },
    'meta_desc': { type: String },
    'tags': { type: Array },
    'products': { type: Array, unique: true},
    'clicks': { type: Object }
})
const categoryModel = connection.model('categories', categorySchema);
module.exports = categoryModel;
