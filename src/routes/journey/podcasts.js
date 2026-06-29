const router = require('express').Router();
const Podcast = require('../../models/Podcast');
const auth = require('../../middleware/auth');
const requireRole = require('../../middleware/requireRole');
const { ROLES } = require('../../constants/roles');
const APIFeatures = require('../../utils/APIFeatures');
const ApiResponse = require('../../utils/ApiResponse');

router.get('/', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const features = new APIFeatures(Podcast.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .localize(req.query.lang);

    const [data, pagination] = await Promise.all([
      features.query,
      features.getPagination(Podcast),
    ]);

    return api.success({ data, pagination, message: 'Podcasts fetched' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) return api.error({ message: 'Podcast not found', statusCode: 404 });
    return api.success({ data: podcast });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.post('/', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const podcast = await Podcast.create(req.body);
    return api.success({ data: podcast, message: 'Podcast created', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.put('/:id', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const podcast = await Podcast.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!podcast) return api.error({ message: 'Podcast not found', statusCode: 404 });
    return api.success({ data: podcast, message: 'Podcast updated' });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.delete('/:id', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const podcast = await Podcast.findByIdAndDelete(req.params.id);
    if (!podcast) return api.error({ message: 'Podcast not found', statusCode: 404 });
    return api.success({ data: null, message: 'Podcast deleted' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

module.exports = router;
