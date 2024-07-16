const mongoose = require('mongoose');
const passportMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportMongoose);

module.exports = mongoose.model('User', userSchema);


