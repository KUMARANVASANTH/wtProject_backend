const  {Student,Idea,Admin,Schedule} = require('../schemas/adminSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {promisify} = require('util')

dotenv.config(
    {
        path : '../.env'
    }
)

module.exports.signinAdmin = async(req,res) => {
    console.log(req.params)
    console.log(req.params.email)
    const admin1 = await Admin.findOne({email:req.params.email});
    if(admin1)
    {
        console.log(admin1.password)
        if(await bcrypt.compare(req.params.pass,admin1.password))
        {
            const token = jwt.sign({id : admin1.email },process.env.jwt_secret,
                {expiresIn : process.env.jwt_expires_in})

            const cookieOption = {
                expires : new Date(
                    Date.now() + process.env.jwt_expires_cookie * 24 * 60 * 60 * 1000
                ),
            }
            console.log(cookieOption)
            res.cookie("ideathon",token,cookieOption)
            res.send(admin1)
        }
        else
        {
            res.send({msg:"PASSWORD IS INCORRECT"})
        }
    }
    else
    {
        res.send({msg:"DATA DOESN'T EXISTS. PLEASE SIGNUP"});
    }
}

module.exports.signupAdmin = async(req,res) => {
    console.log(req.body)
    console.log(req.body.email)
    const admin = new Admin(req.body)
    const admin1 = await Admin.findOne({email:req.body.email});
    if(admin1)
    {
        res.send({msg:"DATA ALREADY EXISTS"});
    }
    else
    {
        await admin.save();
        console.log(admin);
        res.send(admin);
    }
}

module.exports.updateAdmin = async(req,res) => {
    if(req.user)
    {
        console.log(req.body)
        const admin1 = await Admin.findOne({email:req.params.id})
        if(admin1)
        {
            if(req.body.password)
            {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password,salt)
            }
            const admin = await Admin.findOneAndUpdate({email:req.params.id},{$set:req.body})
            const admin2 = await Admin.findOne({email:req.params.id})
            res.send(admin2);
        }
        else
        {
            res.send({msg:"DATA DOESN'T EXISTS"});
        }
    }
    else{
        res.send({msg : "PLEASE LOGIN"})
    }
}

module.exports.deleteAdmin = async(req,res) => {
    if(req.user)
    {
        console.log(req.params.id);
        const admin = await Admin.findOne({email:req.params.id});

        if(admin)
        {
            const admin1 = await Admin.findOneAndDelete({email:req.params.id});
            res.send("SUCESSFULLY DELETED");
        }
        else
        {
            res.send("Stident not found");
        }
    }
    else{
        res.send({msg : "PLEASE LOGIN"})
    }
}

module.exports.isloggedin = async(req,res,next) =>{
    console.log(req.cookies)
    if(req.cookies.ideathon)
    {
        const decode = await promisify(jwt.verify)(req.cookies.ideathon,process.env.jwt_secret)
        console.log(decode)
        const admin = await Admin.findOne({email:decode.id});
        req.user = admin
        next();
    }
    else{
        next()
    }
}