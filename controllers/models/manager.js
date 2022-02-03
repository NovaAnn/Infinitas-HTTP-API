const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const managerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth:Date,
  
});


module.exports = mongoose.model("Manager", managerSchema);
