const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();

//routes imports
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");


//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors());

//route middlewares
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

//server test route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Gurudwara server is running" })

})
//connection to database
connectDB(process.env.MONGO_URI);

//server listenng 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

