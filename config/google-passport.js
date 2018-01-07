//var FacebookStrategy = require('passport-facebook').Strategy;  
//var TwitterStrategy = require('passport-twitter').Strategy;  
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../app/models/User');
var configAuth = require('./auth');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        console.log(user);
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
            passReqToCallback: true
        },
        function (request, token, refreshToken, profile, done) {
            console.log("Matta");
            console.log(profile);
            User.findOne({
                'uid': profile.id
            }, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.uid = profile.id;
                    newUser.token = token;
                    newUser.name = profile.displayName;
                    newUser.email = profile.emails[0].value;
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                    console.log(newUser);
                }
            });
        }));
};