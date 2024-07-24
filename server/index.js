const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const Student = require("./Schema/Student");
const Company = require("./Schema/Company");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const JobPost = require('./Schema/jobSchema');

const uri =
  "mongodb+srv://panwararun116:just@cluster0.1h4iqzh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");} )

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from frontend running on port 3000
    credentials: true // Allow credentials (cookies, authorization headers, etc.) to be sent
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post("/signup-stud",async(req,res)=>{
    try{
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password,10);
        const stud = new Student({name: name , email:email , password:password, defaultBalance:200});

        const savedCompany = await stud.save();
        
    } catch (error) {
        res.status(500).json({ error: error.message });}
    

    res.redirect('/')
})

app.post('/signup-student', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if the email is already registered
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
  
      // Create a new student instance
      const newStudent = new Student({ name, email, password });
  
      // Save the student to the database
      await newStudent.save();
  
      res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // create a job post
  app.post('/job-posts', async (req, res) => {
    const { role, minCTC, maxCTC, location, company_name } = req.body;
  
    try {
      // Validate the request data (you can add more validation as needed)
      if (!role  || !minCTC || !maxCTC || !location || !company_name) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Create a new job post instance
      const newJobPost = new JobPost({ role, minCTC, maxCTC, location, company_name });
  
      // Save the job post to the database
      await newJobPost.save();
  
      res.status(201).json({ message: 'Job post created successfully', jobPost: newJobPost });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // apply for a job
  app.post('/apply-job/:jobPostId/:studentId', async (req, res) => {
    const { jobPostId, studentId } = req.params;
  
    try {
      // Check if the student exists
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Check if the job post exists
      const jobPost = await JobPost.findById(jobPostId);
      if (!jobPost) {
        return res.status(404).json({ message: 'Job post not found' });
      }
  
      // Find the company based on company name
      const company = await Company.findOne({ name: jobPost.company_name });
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
  
      // Check if the student has enough balance
      if (student.defaultBalance < jobPost.requiredRupees) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      // Calculate 50% of the required fees
      const companyShare = jobPost.requiredRupees * 0.5;
  
      // Subtract requiredRupees from the student's defaultBalance
      student.defaultBalance -= jobPost.requiredRupees;
      await student.save();
  
      // Add 50% of the required fees to the company's defaultBalance
      company.defaultBalance += companyShare;
      await company.save();
  
      // Add the student to the appliedUsers array of the job post
      jobPost.appliedUsers.push(studentId);
      await jobPost.save();
  
      res.status(201).json({ message: 'Applied for job successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // register company 
  app.post('/register-company', async (req, res) => {
    const { name, email, password, logo } = req.body;
  
    try {
      // Check if the email is already registered
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new company instance
      const newCompany = new Company({ name, email, password: hashedPassword, logo });
  
      // Save the company to the database
      await newCompany.save();
  
      res.status(201).json({ message: 'Company registered successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  // get all job posts from a company 
  app.get('/get-job-posts', async (req, res) => {
    try {
      const jobPosts = await JobPost.find();
      res.json(jobPosts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/apply-job/:jobPostId/:studentId', async (req, res) => {
    const { jobPostId, studentId } = req.params;
  
    try {
      // Check if the student exists
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Check if the job post exists
      const jobPost = await JobPost.findById(jobPostId);
      if (!jobPost) {
        return res.status(404).json({ message: 'Job post not found' });
      }
  
      // Check if the student has enough balance
      if (student.defaultBalance < jobPost.requiredRupees) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      // Subtract requiredRupees from the student's defaultBalance
      student.defaultBalance -= jobPost.requiredRupees;
      await student.save();
  
      // Add the student to the appliedUsers array of the job post
      jobPost.appliedUsers.push(studentId);
      await jobPost.save();
  
      res.status(201).json({ message: 'Applied for job successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  app.get('/applied-job-posts/:studentId', async (req, res) => {
    const { studentId } = req.params;
  
    try {
      // Check if the student exists
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Find all job posts where the student has applied
      const jobPosts = await JobPost.find({ appliedUsers: studentId });
      res.json(jobPosts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  // Route to get all students
app.get('/students', async (req, res) => {
    try {
      const students = await Student.find();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //  get all companies
  app.get('/companies', async (req, res) => {
    try {
      // Retrieve all companies from the database
      const companies = await Company.find();
  
      res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/company/:companyId', async (req, res) => {
    const companyId = req.params.companyId;
  
    try {
      // Find the company in the database by ID
      const company = await Company.findById(companyId);
  
      if (!company) {
        // If company not found, return a 404 response
        return res.status(404).json({ message: 'Company not found' });
      }
  
      // If company found, return the company data as a response
      res.status(200).json(company);
    } catch (error) {
      // If an error occurs, return a 500 response with the error message
      res.status(500).json({ message: error.message });
    }
  });


  // sign in  a student
  app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the student with the provided email
      const student = await Student.findOne({ email });
  
      if (!student) {
        // If student not found, return error response
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the provided password with the stored password
      if (password !== student.password) {
        // If passwords don't match, return error response
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // If passwords match, send success response
      res.status(200).json({ message: 'Sign-in successful' });
    } catch (error) {
      // If an error occurs, return error response
      res.status(500).json({ message: error.message });
    }
  });
  
  
  

app.listen(3001,(req,res)=>{
    console.log('server running');
})