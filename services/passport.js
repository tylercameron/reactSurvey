const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            // const user = await User.findOne({ googleId: profile.id });

            // if (!user) {
            //     const newUser = await new User({ googleId: profile.id }).save();
            //     done(null, newUser);
            // };

            // done(null, user);

            User.findOne({ googleId: profile.id }) // same as async await above
                .then(existingUser => {
                    if (existingUser) {
                        // don't save to db
                        done(null, existingUser); 
                    } else {
                        // save user to db
                        new User({ googleId: profile.id })
                            .save()
                            .then(user => done(null, user));
                    }
                });
        }
    )
);