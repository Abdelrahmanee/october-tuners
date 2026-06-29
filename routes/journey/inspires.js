const router = require('express').Router();
const Inspire = require('../../models/Inspire');
const auth = require('../../middleware/auth');
const requireRole = require('../../middleware/requireRole');
const { ROLES } = require('../../constants/roles');
const APIFeatures = require('../../utils/APIFeatures');
const ApiResponse = require('../../utils/ApiResponse');

router.get('/', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const features = new APIFeatures(Inspire.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .localize(req.query.lang);

    const [data, pagination] = await Promise.all([
      features.query,
      features.getPagination(Inspire),
    ]);

    return api.success({ data, pagination, message: 'Inspires fetched' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const inspire = await Inspire.findById(req.params.id);
    if (!inspire) return api.error({ message: 'Inspire not found', statusCode: 404 });
    return api.success({ data: inspire });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.post('/', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const inspire = await Inspire.create(req.body);
    return api.success({ data: inspire, message: 'Inspire created', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.put('/:id', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const inspire = await Inspire.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!inspire) return api.error({ message: 'Inspire not found', statusCode: 404 });
    return api.success({ data: inspire, message: 'Inspire updated' });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.delete('/:id', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const inspire = await Inspire.findByIdAndDelete(req.params.id);
    if (!inspire) return api.error({ message: 'Inspire not found', statusCode: 404 });
    return api.success({ data: null, message: 'Inspire deleted' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

module.exports = router;
