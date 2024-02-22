const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  minCTC: {
    type: Number,
    required: true
  },
  maxCTC: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  requiredRupees: {
    type: Number,
    default: function() {
      // Calculate the required Rupees based on role name, minCTC, maxCTC, and location
      const { role, minCTC, maxCTC, location } = this;
      const rupeesRequired = role.length + minCTC.toString().length + maxCTC.toString().length + location.length;
      return rupeesRequired;
    }
  },
  appliedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming you have a User model
  }]
});

const JobPost = mongoose.model('JobPost', jobPostSchema);

module.exports = JobPost;
