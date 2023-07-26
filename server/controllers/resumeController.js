const resumeDB = require("../models/resumeModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddleware")
const cloudinary = require('../utils/cloudinary');


const test = asynchandler(async (req, res) => {
    // console.log(req.files);
    // console.log(req.body)
    // console.log(JSON.parse(req.body.certificate1info))
    // console.l        console.log(JSON.parse(req.body.certificateInfo[i]))
    // console.log('-----------------------------------------------------')

    response.successResponse(res, '', 'Resume routes established');
})

const getUserResume = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        return response.validationError(res, 'Cannot find the resume without the user id');
    }
    const findResume = await resumeDB.findOne({ userId: id });
    if (!findResume) {
        return response.internalServerError(res, 'Cannot find the resume ');
    }
    response.successResponse(res, findResume, 'Fetched the resume successfully');
})

const personalUpdate = asynchandler(async (req, res) => {
    const { name, phoneNumber, email, dob, currentAddress, workingStatus, mariatialStatus, academicDetails, certificateDetails } = req.body;
    const { userId } = req.params;
    const educationCertificates = [];
    if (userId == ":userId") {
        return response.validationError(res, 'Cannot find the resume without the userId')
    }
    const details = JSON.parse(certificateDetails);
    const findResume = await resumeDB.findOne({ userId: userId });
    if (!findResume) {
        return response.notFoundError(res, 'Cannot find the resume');
    }
    console.log(req.files)
    for (var i = 0; i < req.files.certificate.length; i++) {
        const uploadedData = await cloudinary.uploader.upload(req.files.certificate[i].path, {
            folder: "Recrutilife"
        })
        const obj = {};
        obj.instituteName = details[i].instituteName;
        obj.certificate = uploadedData.secure_url;
        obj.dateIssued = details[i].dateIssued;
        educationCertificates.push(obj);
    }
    findResume.name = name;
    findResume.phone = phoneNumber
    findResume.email = email,
        findResume.dob = dob;
    findResume.currentAddress = JSON.parse(currentAddress);
    findResume.mariatialStatus = mariatialStatus;
    findResume.workingStatus = workingStatus;
    findResume.academicDetails = JSON.parse(academicDetails);
    findResume.educationCertificates = educationCertificates;
    await findResume.save();
    response.successResponse(res, findResume, 'Successfully updated the resume');
})

const updateWorkExperience = asynchandler(async (req, res) => {
    const { workExperience, certificateDetails } = req.body;
    const { userId } = req.params;
    const workCertificates = [];
    if (userId == ":userId") {
        return response.validationError(res, 'Cannot find the resume without the userId')
    }
    const details = JSON.parse(certificateDetails);
    const findResume = await resumeDB.findOne({ userId: userId });
    if (!findResume) {
        return response.notFoundError(res, 'Cannot find the resume');
    }
    if ((certificateDetails && !req.files) || (!certificateDetails && req.files)) {
        return response.validationError(res, 'cannot update without proper input');
    }
    console.log(req.files)
    for (var i = 0; i < req.files.certificate.length; i++) {
        const uploadedData = await cloudinary.uploader.upload(req.files.certificate[i].path, {
            folder: "Recrutilife"
        })
        const obj = {};
        obj.companyName = details[i].companyName;
        obj.certificate = uploadedData.secure_url;
        obj.dateIssued = details[i].dateIssued;
        workCertificates.push(obj);
    }
    findResume.workExperience = JSON.parse(workExperience);
    findResume.companyCertificates = workCertificates;
    const updatedResume = await findResume.save();
    if (!updatedResume) {
        return response.internalServerError(res, 'Failed to update the resume details');
    }
    response.successResponse(res, updatedResume, 'Successfully updated the resume');
})

const mandatoryCertificates = asynchandler(async (req, res) => {
    const { userId } = req.params;
    if (userId == ":userId") {
        return response.validationError(res, 'Cannot get resume without the userId');
    }
    const findResume = await resumeDB.findOne({ userId: userId });
    if (!findResume) {
        return response.notFoundError(res, 'Cannot find the resume');
    }
    // console.log(findResume)
    console.log(req.files)
    const maticulationData1 = await cloudinary.uploader.upload(req.files.matriculation[0].path, {
        folder: "Recrutilife"
    })
    findResume.matriculationCetificate = maticulationData1.secure_url;
    const highestqualificationData = await cloudinary.uploader.upload(req.files.hightestQualification[0].path, {
        folder: "Recrutilife"
    })
    findResume.highestQualificationCertificate = highestqualificationData.secure_url;
    const { certificateDetails } = req.body;

    await findResume.save();
    if ((req.files.certificate && !certificateDetails) || (!req.files.certificate && certificateDetails)) {
        return response.successResponse(res, findResume, 'Failed to upload the certificates of courses');
    }
    const certificatCourse = [];
    if (certificateDetails) {
        const details = JSON.parse(certificateDetails)

        for (var i = 0; i < req.files.certificate.length; i++) {
            const uploadedData = await cloudinary.uploader.upload(req.files.certificate[i].path, {
                folder: "Recrutilife"
            })
            const obj = {};
            obj.platform = details[i].platform;
            obj.universityName = details[i].universityName;
            obj.courseName = details[i].courseName;
            obj.certificateWebLink = details[i].certificateWebLink;
            obj.receivingData = details[i].receivingData;
            obj.certificate = uploadedData.secure_url;
            obj.dateIssued = details[i].dateIssued;
            certificatCourse.push(obj);
        }
    }
    findResume.certificatCourse = certificatCourse;
    await findResume.save();
    response.successResponse(res, findResume, "Updated the resume successfully")


})

const extraCurricularUpdate = asynchandler(async (req, res) => {
    const { language, certificateDetails } = req.body;
    const { userId } = req.params;
    if (userId == ":userId") {
        return response.validationError(res, 'Cannot get resume without the userId');
    }
    const findResume = await resumeDB.findOne({ userId: userId });
    if (!findResume) {
        return response.notFoundError(res, 'Cannot find the resume');
    }
    console.log("HERE<><><><")
    findResume.languages = JSON.parse(language);
    await findResume.save();
    if ((req.files.certificate && !certificateDetails) || (!req.files.certificate && certificateDetails)) {
        return response.successResponse(res, findResume, 'Not proper details of extracuricular certificates');
    }
    const extraCurricularsCertificate = [];
    if (certificateDetails) {
        const details = JSON.parse(certificateDetails)

        for (var i = 0; i < req.files.certificate.length; i++) {
            const uploadedData = await cloudinary.uploader.upload(req.files.certificate[i].path, {
                folder: "Recrutilife"
            })
            const obj = {};
            obj.activity = details[i].activity;
            obj.journey = details[i].journey;
            obj.document = uploadedData.secure_url;
            extraCurricularsCertificate.push(obj);
        }
    }
    findResume.extraCurricularsCertificate = extraCurricularsCertificate;
    await findResume.save();
    response.successResponse(res, findResume, 'Updated the resume successfully');
})
module.exports = { test, getUserResume, personalUpdate, updateWorkExperience, mandatoryCertificates, extraCurricularUpdate };