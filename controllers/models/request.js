const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  workerId:{
        type: Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
      },
  startDate: Date,
  endDate: Date,
  status:{
      type:String,
      default:'Pending',
      required:true
  },
  managerId:{
    type: Schema.Types.ObjectId,
    required: true
  },  
  
},{timestamps:true});


module.exports = mongoose.model("Request", requestSchema);
