const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the student schema
const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,

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
    default: 200,
  },
});

// Create a model from the schema
const Company = mongoose.model("Company", companySchema);

// Export the model
module.exports = Company;
