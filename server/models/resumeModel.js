const mongoose = require("mongoose");


const resumeSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        // required: true
    },
    currentAddress: {
        address: {
            type: String,
            // required: true
        },
        city: {
            type: String,
            // required: true
        },
        pincode: {
            type: String,
            // required: true
        }
    },
    workingStatus: {
        type: String,
        // required: true
    },
    mariatialStatus: {
        type: String,
        // required: true
    },
    academicDetails: [{
        instituteName: {
            type: String,
            // required: true
        },
        degreeType: {
            type: String,
            // required: true
        },
        degreeName: {
            type: String,
            // required: true
        },
        cgpa: {
            type: String,
            // required: true
        },
        startingYear: {
            type: String,
            // required: true
        },
        passingYear: {
            type: String,
            // required: true
        },
        journeyHighlight: {
            type: String,
            // required: true,
            default: ""
        }
    }],
    educationCertificates: [{
        instituteName: {
            type: String,
            // required: true
        },
        certificate: {
            type: String,
            // required: true
        },
        dateIssued: {
            type: String,
            // required: true
        }
    }],
    workExperience: [{
        companyName: {
            type: String,
            // required: true
        },
        companyType: {
            type: String,
            // required: true
        },
        role: {
            type: String,
            // required: true
        },
        designation: {
            type: String
        },
        startYear: {
            type: String
        },
        endYear: {
            type: String
        },
        responsiblities: {
            type: String
        },
        highlights: {
            type: String
        }
    }],
    companyCertificates: [{
        companyName: {
            type: String,
            // required: true
        },
        certificate: {
            type: String,
            // required: true
        },
        dateIssued: {
            type: String,
            // required: true
        }
    }],
    matriculationCetificate: {
        type: String,
        // required: true
    },
    highestQualificationCertificate: {
        type: String,
        // required: true
    },
    certificatCourse: [{
        platform: {
            type: String,
            // required: true
        },
        universityName: {
            type: String,
            // required: true
        },
        courseName: {
            type: String,
            // required: true
        },
        certificate: {
            type: String,
            // required: true,
            default: ""
        },
        certificateWebLink: {
            type: String,
            // required: true,
            default: ""
        },
        recievingDate: {
            type: String,
            // required: true
        }
    }],

    languages: [{
        language: {
            type: String,
            // required: true
        },
        proficiency: {
            type: String,
            // required: true
        }
    }],
    extraCurricularsCertificate: [{
        activity: {
            type: String,
            // required: true
        },
        document: {
            type: String,
            // required: true
        },
        journey: {
            type: String,
            // required: true
        }
    }],

}, { timestamps: true })



const resumeModel = mongoose.model("Resume", resumeSchema);


module.exports = resumeModel;