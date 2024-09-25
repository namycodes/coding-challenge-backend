const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true,'email is required'],
        unique:[true,"email already exists"]
    },
    username:{
        type: String,
        required: [true,'username is required'],
        minLength:[3, "username should be at least 3 characters and above"],
        unique:[true,"username already exists"]
    },
    firstName:{
        type: String,
        required:[true, "firstName is required"],
        minLength: [3,'Firstname should be at least 3 characters long']
    },
    lastName:{
        type: String,
        required:[true, "lastName is required"],
        minLength: [3,'Lastname should be at least 3 characters long']
    },
    password:{
        type: String,
        required:[true,"Password is required"],
        minLength:[8,"Password should be at least 8 characters long"],
        select: false
    },
    confirmPassword:{
        type: String,
        required:[true,"Confirm Password is required"],
        minLength:[8,"Confirm Password should be at least 8 characters long"],
        validate:{
            validator: function(el){
                return el === this.password
            },
            message:"Passwords do not match"
        }
    },
    passwordChangedAt:Date
},{
    timestamps: true
})


UserSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    this.password =  await bcrypt.hash(this.password,12)
    this.confirmPassword = undefined
})

UserSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

UserSchema.methods.changedPasswordAfter=async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedChangedAt = parseInt(this.passwordChangedAt.getTIme()/1000, 10)
        return JWTTimestamp < changedChangedAt
    }
    return false
}

const User = mongoose.model('user', UserSchema)
module.exports = User