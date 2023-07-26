const { test, register, login } = require("../controllers/authController");

const router = require("express").Router();




router.get("/test", test);
router.post("/register", register);
router.post('/login', login);


module.exports = router;