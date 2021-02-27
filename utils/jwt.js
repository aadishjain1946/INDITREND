const jwt = require('jsonwebtoken');
require('dotenv').config();
const tokenOperations = {
    SECRETKEY: process.env.JWT_SECRET,
    generateToken(userid) {
        var token = jwt.sign({ userid }, this.SECRETKEY, { expiresIn: '7d' });
        return token;
    },
    verifyToken(clientTokenNumber) {
        var flag = -1;
        var userid = "";
        jwt.verify(clientTokenNumber, this.SECRETKEY, (err, decoded) => {
            if (!err) {
                flag = 10;
                userid = decoded.userid;
            }
            else {
                flag = -1;
            }
        });
        if (flag > 0) {
            return userid
        }
        else {
            return false;
        }
    }

}
module.exports = tokenOperations;
