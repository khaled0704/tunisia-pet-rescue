const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: [true,'Name is required'],
            trim :true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'password is required'],
            minlength: 6,
        },
        role:{
            type: String ,
            enum: ['visitor', 'shelter', 'admin'],
            default: 'visitor',
        },
        phone : {type : String, default: ''},
        avatar : {type: String, default: ''},
        isVerified: {type: Boolean, default: false},
    },
    {timestamps: true}
);
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);  
};

module.exports = mongoose.model('User',userSchema);