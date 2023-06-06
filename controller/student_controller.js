const  {Student} = require('../schemas/studentSchema')
const  {Idea} = require('../schemas/ideaSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {promisify} = require('util')

dotenv.config(
    {
        path : '../.env'
    }
)
module.exports.signupStudent = async(req,res) => {
    console.log(req.body)
    console.log(req.body.email)
    const student = new Student(req.body);
    const stud1 = await Student.findOne({email:req.body.email});
    if(stud1)
    {
        res.send({msg:"DATA ALREADY EXISTS"});
    }
    else
    {
        await student.save();
        console.log(student);
        res.send(student);
    }
}



module.exports.signinStudent = async(req,res) => {
    console.log(req.params)
    const stud = await Student.findOne({email:req.params.email});
    console.log(stud)
    if(stud)
    {
        if(await bcrypt.compare(req.params.pass,stud.password))
        {
        
            const token = jwt.sign({id : stud.email },process.env.jwt_secret,
                {expiresIn : process.env.jwt_expires_in})

            const cookieOption = {
                expires : new Date(
                    Date.now() + process.env.jwt_expires_cookie * 24 * 60 * 60 * 1000
                ),
            }
            console.log(cookieOption)
            res.cookie("ideathon",token,cookieOption)
            res.send(stud)
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

module.exports.updateStudent = async(req,res) => {
        console.log(req.body)
        const stud1 = await Student.findOne({email:req.params.id})
        if(stud1)
        {
            if(req.body.password)
            {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password,salt)
            }
            const stud = await Student.findOneAndUpdate({email:req.params.id},{$set:req.body})
            const stud2 = await Student.findOne({email:req.params.id})
            res.send(stud2);
        }
        else
        {
            res.send({msg:"DATA DOESN'T EXISTS"});
        }
    }



module.exports.deleteStudent = async(req,res) => {
    if(req.user)
    {
        console.log(req.params.id);
        const stud = await Student.findOne({email:req.params.id});

        if(stud)
        {
            const stud1 = await Student.findOneAndDelete({email:req.params.id});
            res.send("SUCESSFULLY DELETED");
        }
        else
        {
            res.send("Student not found");
        }
    }
    else
    {
        res.send({msg:"PLEASE LOGIN"})
    }
}

module.exports.isloggedin = async(req,res,next) =>{
    console.log(req.cookies)
    if(req.cookies.ideathon)
    {
        const decode = await promisify(jwt.verify)(req.cookies.ideathon,process.env.jwt_secret)
        console.log(decode)
        const stud = await Student.findOne({email:decode.id});
        req.user = stud
        next();
    }
    else{
        next()
    }
}

module.exports.getname = async(req,res) =>{
    const student = await Student.findOne({rno:req.params.rno})
    if(student)
    {
        res.send(student.name)
    }
    else
    {
        res.send("NOT FOUND")
    }
}


module.exports.getidea = async(req,res) => {
    console.log(req.params);
    const student = await Student.findOne({rno:req.params.rno});
    console.log(student);
    const ideas =[];
    if(student)
    {
        for(let i=0;i<(student.ideas).length;i++)
        {
            let idea = await Idea.findById((student.ideas)[i])
            if(idea)
            {
                idea = idea.toJSON();
                delete idea.students;
                console.log(idea);
                ideas.push(idea);
            }
        }
    }
    console.log(ideas);
    res.send(ideas);

}




// module.exports.updateStudent = async(req,res) => {
//     if(req.user)
//     {
//         console.log("we")
//         console.log(req.body)
//         const stud1 = await Student.findOne({email:req.params.id})
//         if(stud1)
//         {
//             if(req.body.password)
//             {
//                 const salt = await bcrypt.genSalt(10)
//                 req.body.password = await bcrypt.hash(req.body.password,salt)
//             }
//             const stud = await Student.findOneAndUpdate({email:req.params.id},{$set:req.body})
//             const stud2 = await Student.findOne({email:req.params.id})
//             res.send(stud2);
//         }
//         else
//         {
//             res.send({msg:"DATA DOESN'T EXISTS"});
//         }
//     }
//     else
//     {
//         res.send({msg:"PLEASE LOGIN"})
//     }
// }
