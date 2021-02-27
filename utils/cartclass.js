class cart {
    constructor(prod, address, coupoun = "") {
        this.product = prod;
        this.address = address;
        this.coupoun = coupoun;
    }
}
function buildcart(prd, add, cp = '') {
    var prds = [];
    prds.push(prd);
    var c1 = new cart(prds, add, cp);
    return c1;
}
module.exports = buildcart;