const bcrypt = require('bcryptjs');
require('dotenv').config();
const encryptOperations = {
   salt: parseInt(process.env.BCRYPT_SALT),
   encryptPassword(password) {
      return bcrypt.hashSync(password, this.salt);
   },
   compareHash(password, hashPwd) {
      return bcrypt.compareSync(password, hashPwd);
   }
}
module.exports = encryptOperations;