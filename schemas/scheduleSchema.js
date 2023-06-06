const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const scheduleSchema = new Schema({
  date: { type: Date, required: true },
  ideas: [{ type: Schema.Types.ObjectId, ref: 'Idea' }]
});

module.exports.Schedule = mongoose.model('Schedule', scheduleSchema);
