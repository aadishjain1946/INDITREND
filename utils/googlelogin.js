const passport = require('passport');
const path = require('path')
var uniqid = require('uniqid');
const googleoauth = require('passport-google-oauth2');
require('dotenv').config();
passport.use(new googleoauth({
    callbackURL: process.env.GOOGLE_CALLBACKURL,
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    passReqToCallback: true
},
    (request, accesstoken, refreshToken, profile, done) => {
        var u = profile._json.name;
        var uno = u.slice(0, 5);
        var userId = uniqid(uno);
        // console.log(profile);
        var userObj = {
            'userId': userId,
            'name': profile._json.name,
            'profilepic': profile._json.picture,
            'email': profile._json.email,
            'googleUser': true,
            'email_verified': true
        }
        const userModel = require(path.join(__dirname, '../db/models/user'));
        const jwt = require(path.join(__dirname, "./jwt"));
        userModel.findOne({ "email": userObj.email }, (err, doc) => {
            if (err) {
                throw err;
            }
            else {
                if (doc) {
                    var token = jwt.generateToken(doc.userId);
                    done(null, { "token": token, "source": "login" });
                }
                else {
                    userModel.create(userObj, (err) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            var token = jwt.generateToken(userObj.userId);
                            done(null, { "token": token, "source": "signup" });
                            // return true
                        }
                    })
                }
            }
        })
    }
));

passport.serializeUser((user, done) => {
    // console.log("@@@@@", user)
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