import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import {CompanyProfile} from './pages/CompanyProfile'
import {Dashboard} from './pages/Dashboard'
import {Signup} from './pages/Signup.js'
import {Signin} from './pages/Signin';
function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />}/>
        <Route path="/company" element={<CompanyProfile />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
      </Routes>
    </Router>
  );
}

export default App;
