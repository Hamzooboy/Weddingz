const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Kindly enter your email address'],
        unique: [true, 'This Email is already registered'],
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    role: {
        type: String,
        enum: ['user', 'customer', 'vendor', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be of atleast 8 characters'],
        select: false

    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: [8, 'Password must be of atleast 8 characters'],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: "Passwords do not match"

        }
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    passwordChangedAt: {
        type: Date
    }

})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();

    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined;
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);

}
userSchema.methods.createPasswordResetToken = function() {

    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log(resetToken);

    console.log({ resetToken }, this.passwordResetToken)
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken;
}

userSchema.methods.changedPasswordAfter = function(JWTTimesstamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log(changedTimeStamp, JWTTimesstamp)
        return JWTTimesstamp < changedTimeStamp
    }


    return false;
}


const Signup = mongoose.model('Signup', userSchema);
module.exports = Signup;