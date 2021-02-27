const otpts = require('otpts');
require('dotenv').config();
const secret = process.env.OTP_SECRET;
const totp = otpts.buildTotp({
    secret: otpts.base32Decode(secret),
    interval: 300,
    digits: 5
});

// const otp = totp.generate();
// console.log(otp);
// console.log(totp.verify(otp));
module.exports = totp;