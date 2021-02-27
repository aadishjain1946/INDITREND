const unirest = require('unirest');
require('dotenv').config();
function sendsms(phno, otp) {
    unirest.post(process.env.FAST2SMS_LINK)
        .headers({
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
            "authorization": process.env.FAST2SMS_APIKEY
        })
        .send({
            "sender_id": "SMSIND",
            "language": "english",
            "route": "qt",
            "numbers": phno.toString(),
            "message": process.env.FAST2SMS_MESSAGECODE,
            "variables": "{#AA#}",
            "variables_values": otp.toString()
        })
        .then((response) => {
            // console.log(response.body)
            // res.status(200).send({ status: 200, data: response.body });
        }).catch((err) => {
            // res.status(500).send({ status: 500, data: err });
        })
}
module.exports = sendsms;