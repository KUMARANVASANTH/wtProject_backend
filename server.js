const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const doenv = require('dotenv')
const studentRoutes = require('./routes/student')
const adminRoutes = require('./routes/admin')
const cookieParsar = require('cookie-parser')
const ideaRoutes = require('./routes/idea')

doenv.config(
    {
        path : './.env'
    } 
)

console.log(process.env.db)
const app = express();

app.use(cors())
app.use(express.json())
app.use(cookieParsar())
const port = process.env.port;

app.listen(port,()=>{console.log("Listening at the port "+port)})

mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{console.log("db connected")})
.catch((err)=>{console.log(err)})

app.use('/ideathon/Student',studentRoutes);
app.use('/ideathon/Admin',adminRoutes);
app.use('/ideathon/idea',ideaRoutes);
