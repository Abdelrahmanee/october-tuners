const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { ROLES } = require('../constants/roles');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const formatUser = (user, token) => ({
  token,
  user: { _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
});

// Register member (public)
router.post('/register', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return api.error({ message: 'Email already in use', statusCode: 409 });
    
    const userData = { ...req.body, role: ROLES.MEMBER };
    const user = await User.create(userData);
    return api.success({ data: formatUser(user, signToken(user._id, user.role)), message: 'Registered successfully', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

// Register admin (protected)
router.post('/register-admin', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return api.error({ message: 'Email already in use', statusCode: 409 });
    
    const userData = { ...req.body, role: ROLES.ADMIN };
    const admin = await User.create(userData);
    return api.success({ data: formatUser(admin, signToken(admin._id, admin.role)), message: 'Admin registered successfully', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

// Login
router.post('/login', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return api.error({ message: 'Invalid credentials', statusCode: 401 });
    return api.success({ data: formatUser(user, signToken(user._id, user.role)), message: 'Logged in successfully' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

module.exports = router;
