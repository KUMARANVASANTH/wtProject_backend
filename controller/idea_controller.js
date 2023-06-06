const  {Idea} = require('../schemas/ideaSchema')
const  {Student} = require('../schemas/studentSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {promisify} = require('util')


dotenv.config(
    {
        path : '../.env'
    }
);

module.exports.createIdea = async(req,res) => {
        
        console.log(req.body)

        const body = req.body
        let s = body.students[0].slice(2,4)
        let no;

        const team_id_info = await Idea.findById(process.env.team_id_info);
        const data = team_id_info.data;

        if(data[s]<10)
        {
            no = "00" + data[s]
        }
        else if(data[s]<100)
        {
            no = "0" + data[s]
        }
        else
        {
            no = data[s]
        }
        body['teamid'] =  "T" + s + no;
        //console.log("TEAM ID : " + body.teamid);
        data[s] += 1;
        // console.log(data);

        await Idea.findByIdAndUpdate(process.env.team_id_info,{$set:{data:data}})

        const newidea = new Idea(req.body); 

        const list = body.students;
        const st_id = [];
        for(let i=0;i<list.length;i++)
        {
            console.log(list[i]);
            const student = await Student.findOneAndUpdate({rno:list[i]},{$push:{ideas:newidea._id}});
            if(student)
            {
                st_id.push(student._id);
                const st_ideas = student.ideas;
                st_ideas.push(newidea._id)
            }
            
        }

        newidea.students = st_id;
        console.log(newidea);
        newidea.save();
        res.send(newidea);
}

module.exports.get_idea_students = async(req,res) => {
    console.log(req.params);
    const idea = await Idea.findOne({teamid : req.params.teamid});
    console.log(idea);
    const students = [];
    for(let i=0;i < (idea.students).length; i++)
    {
        let student = await Student.findById((idea.students)[i]);
        if(student)
        {
            student = student.toJSON();
            delete student['password'];
            delete student.ideas;
            console.log(student);
            students.push(student);
        }
    }
    res.send(students);
}

