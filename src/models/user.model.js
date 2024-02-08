import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    avatar: {
        type: String,//cloudinary URL
        required: true,
    }
    , coverImage: {
        type: String
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    password: {
        type: String,
        required: [true, 'password is required!']
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })


UserSchema.pre('save', async function (next) { //always use normal function for this mongoose middlewares as we often need to have the context to run certain actions
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hash(this.password, 9);
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function () {
    jwt.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName,

    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefereshToken = function () {
    jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = model('User', UserSchema)