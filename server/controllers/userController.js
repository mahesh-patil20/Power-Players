const express = require('express');
const router = express.Router();
const User = require('../models/user');
const brycpt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = { add };