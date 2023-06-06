const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')


const adminSchema = new Schema({
    email:{ 
        type: String, 
        required: true 
    },
    password:{ 
        type: String, 
        required: true 
    },
    name:{ 
        type: String, 
        required: true 
    },
    programme:{
        type: String,
        required: true
    },
    dpt:{
        type: String,
        required: true
    }
});

adminSchema.pre('save',async function (next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next();
})



module.exports.Admin = mongoose.model('Admin', adminSchema);


