//new model created to start passport installation

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');//passport-local-mongoose requires passport-local and passport to work so all three needed to be installed

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//UserSchema.plugin substitues for declaring password and username in UserSchema--pass in that plugin that was installed (passport-local-mongoose) to UserSchema.plugin and it will add on username and password fields to the UserSchema--makes sure those usernames are unique and not duplicated--also gives some additional methods that can be used--passport-local-mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);