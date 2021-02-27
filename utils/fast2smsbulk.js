const unirest = require('unirest');
require('dotenv').config();
function sendbulksms(phno, msg) {
    unirest.post(process.env.FAST2SMS_LINK)
        .headers({
            "authorization": process.env.FAST2SMS_APIKEY
        })
        .send({
            "sender_id": "SMSIND",
            "message": msg,
            "language": "english",
            "route": "p",
            "numbers": phno.toString(),
        })
        .then((response) => {
            // console.log(response.body)
            // res.status(200).send({ status: 200, data: response.body });
        }).catch((err) => {
            // res.status(500).send({ status: 500, data: err });
        })
}
module.exports = sendbulksms;