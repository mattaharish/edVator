  var FacebookStrategy = require('passport-facebook').Strategy;
  var User = require('../app/models/User');
  var configAuth = require('./auth');

  module.exports = function (passport) {
      passport.serializeUser(function (user, done) {
          done(null, user.id);
      });
      passport.deserializeUser(function (id, done) {
          User.findById(id, function (err, user) {
              done(err, user);
          });
      });

      passport.use(new FacebookStrategy({
              clientID: configAuth.facebookAuth.clientID,
              clientSecret: configAuth.facebookAuth.clientSecret,
              callbackURL: configAuth.facebookAuth.callbackURL,
              profileFields: ['id', 'emails', 'name']
          },
          function (token, refreshToken, profile, done) {
              console.log("Matta---");
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
                      newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
                      newUser.email = profile.emails[0].value;
                      newUser.save(function (err) {
                          if (err)
                              throw err;
                          return done(null, newUser);
                      });
                  }
              });
          }));
  };