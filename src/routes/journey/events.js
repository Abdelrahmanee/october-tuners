const router = require('express').Router();
const Event = require('../../models/Event');
const Category = require('../../models/Category');
const auth = require('../../middleware/auth');
const APIFeatures = require('../../utils/APIFeatures');
const ApiResponse = require('../../utils/ApiResponse');

router.get('/', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const features = new APIFeatures(Event.find().populate('category'), req.query)
      .filter()
      .sort()
      .paginate()
      .localize(req.query.lang);

    const [data, pagination] = await Promise.all([
      features.query,
      features.getPagination(Event),
    ]);

    return api.success({ data, pagination, message: 'Events fetched' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const event = await Event.findById(req.params.id).populate('category');
    if (!event) return api.error({ message: 'Event not found', statusCode: 404 });
    return api.success({ data: event });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const api = new ApiResponse(res);
  try {
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) return api.error({ message: 'Invalid category: Category does not exist', statusCode: 400 });
    }
    const event = await Event.create(req.body);
    return api.success({ data: event, message: 'Event created', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.put('/:id', auth, async (req, res) => {
  const api = new ApiResponse(res);
  try {
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) return api.error({ message: 'Invalid category: Category does not exist', statusCode: 400 });
    }
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return api.error({ message: 'Event not found', statusCode: 404 });
    return api.success({ data: event, message: 'Event updated' });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return api.error({ message: 'Event not found', statusCode: 404 });
    return api.success({ data: null, message: 'Event deleted' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

module.exports = router;
