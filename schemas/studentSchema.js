const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')


const studentSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    rno:{
        type: String,
        required: true
    },
    dpt:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true
    },
    programme:{
        type: String,
        required: true
    },
    section:{
        type: String,
        required: true
    },
    password:{
        type: String, 
        required: true
    },
    ideas: [{ type: Schema.Types.ObjectId, ref: 'Idea' }]
});

studentSchema.pre('save',async function (next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next();
})


module.exports.Student = mongoose.model('Student', studentSchema);