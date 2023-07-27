const resumeDB = require("../models/resumeModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddleware")
const cloudinary = require('../utils/cloudinary');
const { default: mongoose } = require("mongoose");


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

const updateTextFields = asynchandler(async (req, res) => {
    const { name, phone, email, dob, currentAddress, workingStatus, mariatialStatus, academicDetails, workExperience, language } = req.body;
    const { userId } = req.params;
    if (userId == ":userId") {
        return response.validationError(res, 'Cannot update the resume without the userId');
    }
    const findResume = await resumeDB.findOne({ userId: userId });
    if (!findResume) {
        return response.notFoundError(res, 'Unable to find the resume');
    }
    if (name) {
        findResume.name = name;
    }
    if (phone) {
        findResume.phone = phone;
    }
    if (email) {
        findResume.email = email;
    }
    if (dob) {
        findResume.dob = dob;
    }
    if (currentAddress) {
        findResume.currentAddress = currentAddress;
    }
    if (workingStatus) {
        findResume.workingStatus = workingStatus;
    }
    if (mariatialStatus) {
        findResume.mariatialStatus = mariatialStatus;
    }
    if (language) {
        const newArray = [...findResume.languages, ...language];
        findResume.languages = newArray;
    }
    if (academicDetails) {
        const newArray = [...findResume.academicDetails, ...academicDetails];
        findResume.academicDetails = newArray;
    }
    if (workExperience) {
        const newArray = [...findResume.workExperience, ...workExperience];
        findResume.workExperience = newArray;
    }
    const savedResume = await findResume.save();
    if (!savedResume) {
        return response.internalServerError(res, 'Failed to save the resume');
    }
    response.successResponse(res, savedResume, 'Updated the resume');
})

const uploadFields = asynchandler(async (req, res) => {
    const { academicCertificateDetails, companyCertificateDetails, courseCertificateDetails, extraCurricularsCertificateDetails, additionalCertificateDetails } = req.body;
    const { userId } = req.params;
    if (userId == ":userId") {
        return response.validationError(res, 'Cannot update the resume without the userId');
    }
    const findResume = await resumeDB.findOne({ userId: userId });
    if (!findResume) {
        return response.notFoundError(res, 'Unable to find the resume');
    }
    const { academicCertificates, companyCertificate, courseCertificate, extraCurricularsCertificates, matriculation, highestQualificationCertificate, additionalCertificates } = req.files;
    if (matriculation) {
        const deleteCloudinaryData = await cloudinary.uploader.destroy(findResume.matriculationCetificate);
        const uploadedData = await cloudinary.uploader.upload(matriculation[0].path, {
            folder: "Recrutilife"
        })
        findResume.matriculationCetificate = uploadedData.secure_url;
    }
    if (highestQualificationCertificate) {
        const deleteCloudinaryData = await cloudinary.uploader.destroy(findResume.highestQualificationCertificate);
        const uploadedData = await cloudinary.uploader.upload(highestQualificationCertificate[0].path, {
            folder: "Recrutilife"
        })
        findResume.highestQualificationCertificate = uploadedData.secure_url;
    }
    const educationCertificates = [];
    if (academicCertificates) {
        const details = JSON.parse(academicCertificateDetails);
        for (var i = 0; i < academicCertificates.length; i++) {
            const uploadedData = await cloudinary.uploader.upload(academicCertificates[i].path, {
                folder: "Recrutilife"
            })
            const obj = {};
            obj.instituteName = details[i].instituteName;
            obj.certificate = uploadedData.secure_url;
            obj.dateIssued = details[i].dateIssued;
            educationCertificates.push(obj);
        }
        const newArray = [...findResume.educationCertificates, ...educationCertificates];
        findResume.educationCertificates = newArray;
    }
    const companyCertificates = [];
    if (companyCertificate) {
        const details = JSON.parse(companyCertificateDetails);
        for (var i = 0; i < companyCertificate.length; i++) {
            const uploadedData = await cloudinary.uploader.upload(companyCertificate[i].path, {
                folder: "Recrutilife"
            })
            const obj = {};
            obj.companyName = details[i].companyName;
            obj.certificate = uploadedData.secure_url;
            obj.dateIssued = details[i].dateIssued;
            companyCertificates.push(obj);
        }
        const newArray = [...findResume.companyCertificates, ...companyCertificates];
        findResume.companyCertificates = newArray;
    }
    const certificatCourse = [];
    if (courseCertificate) {
        const details = JSON.parse(courseCertificateDetails);
        for (var i = 0; i < courseCertificate.length; i++) {
            const uploadedData = await cloudinary.uploader.upload(courseCertificate[i].path, {
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
        const newArray = [...findResume.certificatCourse, ...certificatCourse];
        findResume.certificatCourse = newArray;
    }
    const extraCurricularsCertificate = [];
    if (extraCurricularsCertificates) {
        const details = JSON.parse(extraCurricularsCertificateDetails);
        for (var i = 0; i < extraCurricularsCertificates.length; i++) {
            const uploadedData = await cloudinary.uploader.upload(extraCurricularsCertificates[i].path, {
                folder: "Recrutilife"
            })
            const obj = {};
            obj.activity = details[i].activity;
            obj.journey = details[i].journey;
            obj.document = uploadedData.secure_url;
            extraCurricularsCertificate.push(obj);
        }
        const newArray = [...findResume.extraCurricularsCertificate, ...extraCurricularsCertificate];
        findResume.extraCurricularsCertificate = newArray;
    }
    const additionalCertificate = [];
    if (additionalCertificates) {
        const details = JSON.parse(additionalCertificateDetails);
        for (var i = 0; i < additionalCertificate.length; i++) {
            const uploadedData = await cloudinary.uploader.upload(additionalCertificate[i].path, {
                folder: "Recrutilife"
            })
            const obj = {};
            obj.certificateName = details[i].certificateName;
            obj.recievedDate = details[i].recievedDate;
            obj.journeyHighlight = details[i].journeyHighlight;
            obj.certificate = uploadedData.secure_url;
            additionalCertificate.push(obj);
        }
        const newArray = [...findResume.additionalCertificate, ...additionalCertificate];
        findResume.additionalCertificate = newArray;
    }
    const savedResume = await findResume.save();
    if (!savedResume) {
        return response.internalServerError(res, 'Failed to update the resume');
    }
    response.successResponse(res, findResume, "Updated the resume successfully");
})

const deleteUploads = asynchandler(async (req, res) => {
    const { id, field } = req.body;
    const { userId } = req.params;
    const findResume = await resumeDB.findOne({ userId: userId });
    if (!findResume) {
        return response.notFoundError(res, 'Unable to find the resume');
    }
    // console.log(findResume[field])
    const findIndex = findResume[field].findIndex((obj) => obj._id == id);
    // console.log(findIndex);
    if (findIndex > -1) {
        findResume[field].splice(findIndex, 1);
    }

    const saved = await findResume.save();
    if (!saved) {
        return response.internalServerError(res, 'Failed to update the resume');
    }

    response.successResponse(res, findResume, 'Updated the resume ');

})

module.exports = { test, getUserResume, personalUpdate, updateWorkExperience, mandatoryCertificates, extraCurricularUpdate, updateTextFields, uploadFields, deleteUploads };