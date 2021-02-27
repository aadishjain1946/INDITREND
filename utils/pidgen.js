function genrandomno() {
    var min = 0;
    var max = 100000000000;
    var random = Math.random() * (+max - +min) + +min;
    return parseInt(random);
}
module.exports = genrandomno;