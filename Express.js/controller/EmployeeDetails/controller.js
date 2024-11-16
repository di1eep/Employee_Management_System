import sql from 'mssql';  
import sqlConfig from "../../Database/database.js";

export const getEmployeeDetails = async (req, res, next) => {
  let pool;
  try {
    pool = await sql.connect(sqlConfig);
    
    const { recordset } = await pool.request()
      .input('Flag', sql.VarChar, 'GetEmployeeDetails')
      .execute('EmployeeManagementMaster');

    if (recordset.length > 0 && recordset[0].JSONDATA) {
      const data = JSON.parse(recordset[0].JSONDATA);
      return res.json({ flag: 1, flag_message: 'Employee data retrieved successfully', data });
    } else {
      return res.status(404).json({ flag: 0, flag_message: 'No employee data found' });
    }
  } catch (err) {
    return res.status(500).json({ flag: 0, flag_message: 'Failed to fetch employee details', error: err.message });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
};


export const createEmployeeData = async (req, res, next) => {
  const { EmployeeName, EmployeeDesignation, EmployeeExperience, EmpMobileNo, EmpEmailId, EmployeeDOB, EmployeeAddress } = req.body;

  let pool;
  try {
    const USERNAME = req.user.UserName;

    pool = await sql.connect(sqlConfig);
    const { recordset } = await pool.request()
      .input('UserName', sql.VarChar, USERNAME)   
      .input('Flag', sql.VarChar, 'CreateEmployee')
      .input('EmployeeName', sql.VarChar, EmployeeName)
      .input('EmployeeDesignation', sql.VarChar, EmployeeDesignation)
      .input('EmployeeExperience', sql.VarChar, EmployeeExperience)
      .input('EmpMobileNo', sql.VarChar, EmpMobileNo)
      .input('EmpEmailId', sql.VarChar, EmpEmailId)
      .input('EmployeeDOB', sql.VarChar, EmployeeDOB)
      .input('EmployeeAddress', sql.VarChar, EmployeeAddress)
      .execute('EmployeeManagementMaster');
   
    return res.json({flag_message: recordset });
  } catch (err) {
    const error = new Error('Failed to create employee');
    error.status = 500;
    return next(error);
  } finally {
    if (pool) {
      await pool.close();  
    }
  }
};


export const updateEmployeeData = async (req, res, next) => {
  const {
    EmployeeID,
    EmployeeName,
    EmployeeDesignation,
    EmployeeExperience,
    EmpMobileNo,
    EmpEmailId,
    EmployeeDOB,
    EmployeeAddress,
  } = req.body;

  let pool;
  try {

    const USERNAME = req.user.UserName;

    pool = await sql.connect(sqlConfig);

    const { recordset } = await pool.request()
      .input('UserName', sql.VarChar, USERNAME) 
      .input('Flag', sql.VarChar, 'UpdateEmployee')
      .input('EmployeeID', sql.VarChar, EmployeeID)
      .input('EmployeeName', sql.VarChar, EmployeeName)
      .input('EmployeeDesignation', sql.VarChar, EmployeeDesignation)
      .input('EmployeeExperience', sql.VarChar, EmployeeExperience)
      .input('EmpMobileNo', sql.VarChar, EmpMobileNo)
      .input('EmpEmailId', sql.VarChar, EmpEmailId)
      .input('EmployeeDOB', sql.VarChar, EmployeeDOB)
      .input('EmployeeAddress', sql.VarChar, EmployeeAddress)
      .execute('EmployeeManagementMaster');

    if (recordset.length > 0) {
      return res.json({flag_message: recordset });
    } else {
      return res.status(404).json({ message: 'Employee update failed: No record updated.' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update employee.', error: err.message });
  } finally {
  
    if (pool) {
      await pool.close();
    }
  }
};


export const deleteEmployeeData = async (req, res, next) => {
  const { EmployeeID } = req.body;
  
  let pool;
  try {
    const USERNAME = req.user.UserName;

    pool = await sql.connect(sqlConfig);
    const { recordset } = await pool.request()
      .input('UserName', sql.VarChar, USERNAME)  
      .input('Flag', sql.VarChar, 'DeleteEmployee')  
      .input('EmployeeID', sql.VarChar, EmployeeID)
      .execute('EmployeeManagementMaster');
   
    return res.json({flag_message: recordset });
  } catch (err) {
    const error = new Error('Failed to delete employee');
    error.status = 500;
    return next(error);  
  } finally {
    if (pool) {
      await pool.close();  
    }
  }
};
