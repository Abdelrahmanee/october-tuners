const router = require('express').Router();
const Category = require('../../models/Category');
const auth = require('../../middleware/auth');
const requireRole = require('../../middleware/requireRole');
const { ROLES } = require('../../constants/roles');
const APIFeatures = require('../../utils/APIFeatures');
const ApiResponse = require('../../utils/ApiResponse');

router.get('/', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const features = new APIFeatures(Category.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .localize(req.query.lang);

    const [data, pagination] = await Promise.all([
      features.query,
      features.getPagination(Category),
    ]);

    return api.success({ data, pagination, message: 'Categories fetched' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return api.error({ message: 'Category not found', statusCode: 404 });
    return api.success({ data: category });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.post('/', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const category = await Category.create(req.body);
    return api.success({ data: category, message: 'Category created', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.put('/:id', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return api.error({ message: 'Category not found', statusCode: 404 });
    return api.success({ data: category, message: 'Category updated' });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.delete('/:id', auth, requireRole(ROLES.ADMIN), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return api.error({ message: 'Category not found', statusCode: 404 });
    return api.success({ data: null, message: 'Category deleted' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

module.exports = router;
