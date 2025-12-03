require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = require('./routes/router');
const cookieParser = require('cookie-parser');

//Connect to database
mongoose.connect(process.env.monCONN).then(() => {
  console.log("Database connection successful")
}).catch((err) => {
  console.log("Error while connecting to database", err);
});

//Middleware
app.use(cookieParser());
app.use(express.json());
app.use('/api/blog', router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is now running at ${PORT}`);
});