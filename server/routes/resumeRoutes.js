const { test, getUserResume, personalUpdate, updateWorkExperience, mandatoryCertificates, extraCurricularUpdate, updateTextFields, uploadFields, deleteUploads } = require("../controllers/resumeController");

const router = require("express").Router();
const upload = require("../utils/multer");


router.get('/test', upload.array("certificate"), test);
router.get('/resume/:id', getUserResume);
router.post('/personal/:userId', upload.fields([{
    name: "certificate"
}]), personalUpdate);
router.post('/work/:userId', upload.fields([{
    name: "certificate"
}]), updateWorkExperience);
router.post('/mandatory/:userId', upload.fields([{
    name: "matriculation"
},
{
    name: "hightestQualification"
},
{
    name: "certificate"
}]), mandatoryCertificates);
router.post('/extracurricular/:userId', upload.fields([{
    name: "certificate"
}]), extraCurricularUpdate);
router.post("/update/textfields/:userId", updateTextFields);
router.post("/update/upload/:userId", upload.fields([
    { name: "academicCertificates" },
    { name: "companyCertificate" },
    { name: "courseCertificate" },
    { name: "extraCurricularsCertificates" },
    { name: "matriculation" },
    { name: "highestQualificationCertificate" },
    { name: "additionalCertificates" }
]),uploadFields);

router.put("/delete/:userId",deleteUploads);

module.exports = router;