const router = require('express').Router();
const Ride = require('../../models/Ride');
const auth = require('../../middleware/auth');
const requireRole = require('../../middleware/requireRole');
const { ROLES } = require('../../constants/roles');
const APIFeatures = require('../../utils/APIFeatures');
const ApiResponse = require('../../utils/ApiResponse');

router.get('/', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const features = new APIFeatures(Ride.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .localize(req.query.lang);

    const [data, pagination] = await Promise.all([
      features.query,
      features.getPagination(Ride),
    ]);

    return api.success({ data, pagination, message: 'Rides fetched' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return api.error({ message: 'Ride not found', statusCode: 404 });
    return api.success({ data: ride });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.post('/', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const ride = await Ride.create(req.body);
    return api.success({ data: ride, message: 'Ride created', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.put('/:id', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ride) return api.error({ message: 'Ride not found', statusCode: 404 });
    return api.success({ data: ride, message: 'Ride updated' });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.delete('/:id', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const ride = await Ride.findByIdAndDelete(req.params.id);
    if (!ride) return api.error({ message: 'Ride not found', statusCode: 404 });
    return api.success({ data: null, message: 'Ride deleted' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

module.exports = router;
