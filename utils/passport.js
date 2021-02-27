const passport = require('passport');
const path = require('path')
const encrypt = require(path.join(__dirname, 'encrypt'));
const userModel = require(path.join(__dirname, '../db/models/user'));
const jwt = require("./jwt");
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy((username, password, done) => {
    userModel.findOne({ "phnumber": username }, (err, doc) => {
        if (err) {
            console.log(err);
            // throw err;
        }
        else {
            if (doc) {
                if (encrypt.compareHash(password, doc.password)) {
                    var token = jwt.generateToken(doc.userId);
                    done(null, token);
                }
                else {
                    done(null, "password")
                }
            }
            else {
                done(null, "username")
            }
        }
    })
}
));

passport.serializeUser((user, done) => {
    // console.log("####1", user)
    done(null, user);
})
passport.deserializeUser((user, done) => {
    const jwt = require("./jwt");
    // console.log("####", user)
    if (jwt.verifyToken(user.token)) {
        done(null, user);
    }
})
module.exports = passport;