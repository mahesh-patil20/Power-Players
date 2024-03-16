const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        default: null,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
}
);

UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id, email: user.email }, process.env.SECRET_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

module.exports = mongoose.model('User', UserSchema);