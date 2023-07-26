const userDB = require("../models/userModel");
const resumeDB = require("../models/resumeModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Auth routes established');
})

const register = asynchandler(async (req, res) => {
    const { name, phone, email, password, cityPreference, jobPreference, companyPreference, jobRole } = req.body;


    if (!name || !phone || !email || !password || !cityPreference || !jobPreference || !companyPreference || !jobRole) {
        return response.validationError(res, 'Cannot create user without proper information');
    }

    const findByMail = await userDB.findOne({ email: email });
    if (findByMail) {
        return response.errorResponse(res, 'Email already registerd. Please login',400);
    }
    const findByNumber = await userDB.findOne({ phone: phone });
    if (findByNumber) {
        return response.errorResponse(res, 'Phone number assotitated with other account',400);
    }
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const newUser = new userDB({
        name,
        phone,
        email,
        password: hashedPassword,
        cityPreference,
        jobPreference,
        jobRole,
        companyPreference
    })
    const savedUser = await newUser.save();
    if (!savedUser) {
        return response.internalServerError(res, "Cannot save the new user");
    }

    const newResume = new resumeDB({
        userId: savedUser._id,
        name: name,
        phone: phone,
        email: email
    })
    await newResume.save();
    savedUser.resume = newResume._id;
    await savedUser.save();
    const token = jwt(savedUser._id);
    const { createdAt, updatedAt, ...other } = savedUser._doc;
    const final = {
        token: token,
        user: other
    }
    response.successResponse(res, final, 'Saved the user successfully');
})


const login = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        response.validationError(res, "Please fill in the details properly")
    }
    else {
        const findUser = await userDB.findOne({ email: email });
        if (findUser) {
            const comparePassword = await bcrypt.compare(password, findUser.password);
            if (comparePassword) {
                const token = jwt(findUser._id);
                const { password, createdAt, updatedAt, ...other } = findUser._doc;
                const data = {
                    other,
                    token: token
                }
                response.successResponse(res, data, "Login successful");

            }
            else {
                response.validationError(res, "Password incorrect");
            }

        }
        else {
            response.notFoundError(res, "User not found");
        }

    }
})
module.exports = { test, register, login };