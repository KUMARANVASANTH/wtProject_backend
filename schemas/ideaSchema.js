const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ideaSchema = new Schema({
    title:{ 
        type: String, 
        required: true
    },
    description:{ 
        type: String, 
        required: true 
    },
    teamid : {
        type: String, 
        required: true
    },
    teamName : {
        type: String, 
        required: true
    },
    students:[{ 
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    mentor : {
        type: String, 
        required: true
    },
    submittedAt:{
        type: Date, 
        default: Date.now() 
    },
    shortlisted:{ 
        type: Boolean,
        default: false 
    },
    data:{
        type : JSON
    }
});



module.exports.Idea = mongoose.model('Idea', ideaSchema);