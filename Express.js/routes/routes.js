require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const sqlConfig = require('../Database/database');  

const router = express.Router();


router.post('/signup', async (req, res) => {
  const { UserName, Password } = req.body;
  try {
    await sql.connect(sqlConfig);
    const hashedPassword = await bcrypt.hash(Password, 10);
    const result = await sql.query`
      EXEC ManageLoginForUsers 
      @UserName = ${UserName}, 
      @Password = ${hashedPassword}, 
      @flag = 'CreateUserLogin'
    `;


    if (result.recordset && result.recordset.length > 0) {
      const { flag, flag_message, StatusCode } = result.recordset[0];
      if (StatusCode === 201) {
        return res.status(StatusCode).json({ success: true, message: flag_message });
      } else if (StatusCode === 400) {
        return res.status(StatusCode).json({ success: false, message: flag_message });
      }
    } else {
      // If recordset is empty, handle the error gracefully
      return res.status(500).json({ success: false, message: 'Unexpected error occurred, no response data.' });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    sql.close();
  }
});





router.post('/login', async (req, res) => {
  const { UserName, Password } = req.body;
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`
      EXEC ManageLoginForUsers 
      @UserName = ${UserName}, 
      @flag = 'checkuserandpassword'
    `;
    if (result.recordset.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(Password, result.recordset[0].Password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: result.recordset[0].ID, UserName: result.recordset[0].UserName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    res.json({ success: true, message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    sql.close();
  }
});

module.exports = router;
