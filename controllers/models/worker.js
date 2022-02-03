const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  leavesRemaining: {
    type: Number,
    required: true,
    default:30,
  },
  manager:{
    type: Schema.Types.ObjectId,
    ref: 'Manager',
    required: true
  },
  
  requests: [
    {
      requestId: {
        type: Schema.Types.ObjectId,
        ref: 'Request',
        required: true
      }
    }
  ],

  
});


module.exports = mongoose.model("Worker", workerSchema);
