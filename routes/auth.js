const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ApiResponse = require('../utils/ApiResponse');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const formatAdmin = (admin, token) => ({
  token,
  admin: { _id: admin._id, name: admin.name, email: admin.email, createdAt: admin.createdAt },
});

// Register
router.post('/register', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const admin = await Admin.create(req.body);
    return api.success({ data: formatAdmin(admin, signToken(admin._id)), message: 'Registered successfully', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

// Login
router.post('/login', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password)))
      return api.error({ message: 'Invalid credentials', statusCode: 401 });
    return api.success({ data: formatAdmin(admin, signToken(admin._id)), message: 'Logged in successfully' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

module.exports = router;
