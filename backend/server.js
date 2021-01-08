const express  = require('express');
const cors     = require('cors'); 
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.port || 5000 ;

app.use(cors())
app.use(express.json())

const uri = process.env.ATLAS_URI;
mongoose.connect(uri , {useNewUrlParser: true , useCreateIndex: true , useUnifiedTopology: true})

app.listen(port , () => {
    console.log('Server is running on port: ', port);
});

const applicantsRouter = require('./routes/applicants');
const recruitersRouter = require('./routes/recruiters');

app.use('/applicants' , applicantsRouter);
app.use('/recruiters' , recruitersRouter);

const connection = mongoose.connection;
connection.once('open' , () => {
    console.log('Connection with MongoDB has been established successfully');
})

