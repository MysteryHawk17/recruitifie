const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    cityPreference: [String],
    jobPreference: [String],
    companyPreference: [String],
    jobRole: {
        type: String,
    },
    aadharDetails: {
        number: {
            type: String,
            // required: true,
            default: ""
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    }
},{timestamps:true})



const userModel = mongoose.model("User", userSchema);


module.exports = userModel;