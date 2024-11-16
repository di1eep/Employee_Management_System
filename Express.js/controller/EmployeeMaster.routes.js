import express from 'express';
import authMiddleware from '../Authuntication/auth.js';
import {
  getEmployeeDetails,
  createEmployeeData,
  updateEmployeeData,
  deleteEmployeeData,
} from './EmployeeDetails/controller.js';

const EmployeeDetails = express.Router();

// Define the routes and associate them with the appropriate controller functions
EmployeeDetails.get('/get', authMiddleware, getEmployeeDetails);         // GET employee details
EmployeeDetails.post('/create', authMiddleware, createEmployeeData);    // POST create employee
EmployeeDetails.put('/update', authMiddleware, updateEmployeeData);     // PUT update employee
EmployeeDetails.delete('/delete', authMiddleware, deleteEmployeeData);  // DELETE delete employee

export default EmployeeDetails;
