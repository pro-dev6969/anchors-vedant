const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the student schema
const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  defaultBalance: {
    type: Number,
    default: 300,
  },
});





// Create a model from the schema
const Student = mongoose.model("Student", studentSchema);

// Export the model
module.exports = Student;
