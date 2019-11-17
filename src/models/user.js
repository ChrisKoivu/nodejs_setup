const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim:true
        }, 
        password: {
            type:String,
            required:true,
            trim:true,
            minlength:8,
            validate(value){
                if(value.toLowerCase().includes("password")){
                    throw new Error('Password can not include the word "password"')
                }
            }
        },
        email: {
            type: String,
            unique:true,
            required: true,
            validate(value){
                if(!validator.isEmail(value) ){
                   throw new Error('Provided email address is invalid!') 
                }
            },
            trim:true,
            lowercase:true
        },
        age: {
            type: Number,
            default:0,
            validate(value){
                if(value <  0) {
                    throw new Error('Age must be a positive number!')
                }
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }
)

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    user.tokens = user.tokens.concat({ token })  
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error("Unable to authenticate user")
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
        throw new Error("Unable to authenticate user")
    }
    return user

}

// hash password
userSchema.pre('save' , async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)  
    }
    
    next()
})
const User = mongoose.model ('User', userSchema)

 
module.exports = User