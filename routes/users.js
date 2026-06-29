const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const APIFeatures = require('../utils/APIFeatures');
const ApiResponse = require('../utils/ApiResponse');
const { ROLES } = require('../constants/roles');

// GET /api/users — admin only, list all users
router.get('/', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const features = new APIFeatures(User.find().select('-password'), req.query)
      .filter()
      .sort()
      .paginate();

    const [data, pagination] = await Promise.all([
      features.query,
      features.getPagination(User),
    ]);

    return api.success({ data, pagination, message: 'Users fetched' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

// GET /api/users/me — get own profile (any authenticated user)
router.get('/me', auth, async (req, res) => {
  const api = new ApiResponse(res);
  return api.success({ data: req.user });
});

// GET /api/users/:id — admin only
router.get('/:id', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return api.error({ message: 'User not found', statusCode: 404 });
    return api.success({ data: user });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

// PUT /api/users/me — update own profile (any authenticated user)
router.put('/me', auth, async (req, res) => {
  const api = new ApiResponse(res);
  try {
    // Prevent self-role escalation
    const { role, password, ...safeFields } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      safeFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return api.error({ message: 'User not found', statusCode: 404 });
    return api.success({ data: user, message: 'Profile updated' });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

// PUT /api/users/:id — admin only (can change role)
router.put('/:id', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const { password, ...safeFields } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      safeFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return api.error({ message: 'User not found', statusCode: 404 });
    return api.success({ data: user, message: 'User updated' });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

// DELETE /api/users/:id — admin only
router.delete('/:id', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return api.error({ message: 'You cannot delete your own account', statusCode: 400 });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return api.error({ message: 'User not found', statusCode: 404 });
    return api.success({ data: null, message: 'User deleted' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

module.exports = router;
