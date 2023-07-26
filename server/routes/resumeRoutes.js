const { test, getUserResume, personalUpdate, updateWorkExperience, mandatoryCertificates, extraCurricularUpdate } = require("../controllers/resumeController");

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
// router.post('/test', upload.fields([
//     { name: "certificate" }
//     // { name: "image2" }
// ]), test);



module.exports = router;