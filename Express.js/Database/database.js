require('dotenv').config();
const express = require('express');


const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: 'DILEEP\\SQLEXPRESS', 
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, 
    trustServerCertificate: true
  }
};

module.exports = sqlConfig;
