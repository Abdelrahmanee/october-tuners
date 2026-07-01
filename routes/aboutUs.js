const router = require('express').Router();
const mongoose = require('mongoose');
const AboutUs = require('../models/AboutUs');
const TeamMember = require('../models/TeamMember');
const Partner = require('../models/Partner');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { ROLES } = require('../constants/roles');
const { deleteFromCloudinary } = require('../config/cloudinary');
const ApiResponse = require('../utils/ApiResponse');

const adminOnly = [auth, requireRole(ROLES.ADMIN)];

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

const getOrder = (value) => {
  if (value === undefined || value === '') return undefined;
  const order = Number(value);
  return Number.isFinite(order) ? order : null;
};

// GET /api/about-us — all data needed to render the page
router.get('/', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const [content, team, partners] = await Promise.all([
      AboutUs.findOne({ key: 'about-us' }),
      TeamMember.find().sort({ order: 1, createdAt: 1 }),
      Partner.find().sort({ order: 1, createdAt: 1 }),
    ]);

    return api.success({
      data: { content, team, partners },
      message: 'About Us page fetched',
    });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

// POST /api/about-us — create the singleton page content
router.post('/', ...adminOnly, async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const exists = await AboutUs.exists({ key: 'about-us' });
    if (exists) {
      return api.error({
        message: 'About Us content already exists. Use PUT to update it.',
        statusCode: 409,
      });
    }

    const content = await AboutUs.create({ ...req.body, key: 'about-us' });
    return api.success({ data: content, message: 'About Us content created', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

// PUT /api/about-us — update the singleton page content
router.put('/', ...adminOnly, async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const content = await AboutUs.findOneAndUpdate(
      { key: 'about-us' },
      req.body,
      { new: true, runValidators: true }
    );
    if (!content) return api.error({ message: 'About Us content not found', statusCode: 404 });
    return api.success({ data: content, message: 'About Us content updated' });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

// DELETE /api/about-us — delete only the page copy; team and partners remain
router.delete('/', ...adminOnly, async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const content = await AboutUs.findOneAndDelete({ key: 'about-us' });
    if (!content) return api.error({ message: 'About Us content not found', statusCode: 404 });
    return api.success({ data: null, message: 'About Us content deleted' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

// Team member CRUD
router.get('/team', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const team = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    return api.success({ data: team, message: 'Team members fetched' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.get('/team/:id', async (req, res) => {
  const api = new ApiResponse(res);
  if (!validId(req.params.id)) return api.error({ message: 'Invalid team member ID', statusCode: 400 });
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return api.error({ message: 'Team member not found', statusCode: 404 });
    return api.success({ data: member });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.post('/team', ...adminOnly, async (req, res) => {
  const api = new ApiResponse(res);
  if (!req.body.name || !req.body.email || !req.body.image) {
    return api.error({ message: 'name, email, and image are required', statusCode: 400 });
  }

  const order = getOrder(req.body.order);
  if (order === null) return api.error({ message: 'order must be a number', statusCode: 400 });

  try {
    const member = await TeamMember.create({
      name: req.body.name,
      email: req.body.email,
      job_title_en: req.body.job_title_en,
      job_title_ar: req.body.job_title_ar,
      image: req.body.image,
      ...(order !== undefined && { order }),
    });
    return api.success({ data: member, message: 'Team member created', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.put('/team/:id', ...adminOnly, async (req, res) => {
  const api = new ApiResponse(res);
  if (!validId(req.params.id)) return api.error({ message: 'Invalid team member ID', statusCode: 400 });

  const order = getOrder(req.body.order);
  if (order === null) return api.error({ message: 'order must be a number', statusCode: 400 });

  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return api.error({ message: 'Team member not found', statusCode: 404 });

    const oldImage = member.image;
    const imageChanged = req.body.image !== undefined && req.body.image !== oldImage;
    if (req.body.image !== undefined) member.image = req.body.image;
    if (req.body.name !== undefined) member.name = req.body.name;
    if (req.body.email !== undefined) member.email = req.body.email;
    if (req.body.job_title_en !== undefined) member.job_title_en = req.body.job_title_en;
    if (req.body.job_title_ar !== undefined) member.job_title_ar = req.body.job_title_ar;
    if (order !== undefined) member.order = order;

    await member.save();
    if (imageChanged) await deleteFromCloudinary(oldImage);
    return api.success({ data: member, message: 'Team member updated' });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.delete('/team/:id', ...adminOnly, async (req, res) => {
  const api = new ApiResponse(res);
  if (!validId(req.params.id)) return api.error({ message: 'Invalid team member ID', statusCode: 400 });
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return api.error({ message: 'Team member not found', statusCode: 404 });
    await deleteFromCloudinary(member.image);
    return api.success({ data: null, message: 'Team member deleted' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

// Partner CRUD
router.get('/partners', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const partners = await Partner.find().sort({ order: 1, createdAt: 1 });
    return api.success({ data: partners, message: 'Partners fetched' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.get('/partners/:id', async (req, res) => {
  const api = new ApiResponse(res);
  if (!validId(req.params.id)) return api.error({ message: 'Invalid partner ID', statusCode: 400 });
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return api.error({ message: 'Partner not found', statusCode: 404 });
    return api.success({ data: partner });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

router.post('/partners', ...adminOnly, async (req, res) => {
  const api = new ApiResponse(res);
  if (!req.body.name || !req.body.logo) {
    return api.error({ message: 'name and logo are required', statusCode: 400 });
  }

  const order = getOrder(req.body.order);
  if (order === null) return api.error({ message: 'order must be a number', statusCode: 400 });

  try {
    const partner = await Partner.create({
      name: req.body.name,
      logo: req.body.logo,
      ...(order !== undefined && { order }),
    });
    return api.success({ data: partner, message: 'Partner created', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.put('/partners/:id', ...adminOnly, async (req, res) => {
  const api = new ApiResponse(res);
  if (!validId(req.params.id)) return api.error({ message: 'Invalid partner ID', statusCode: 400 });

  const order = getOrder(req.body.order);
  if (order === null) return api.error({ message: 'order must be a number', statusCode: 400 });

  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return api.error({ message: 'Partner not found', statusCode: 404 });

    const oldLogo = partner.logo;
    const logoChanged = req.body.logo !== undefined && req.body.logo !== oldLogo;
    if (req.body.logo !== undefined) partner.logo = req.body.logo;
    if (req.body.name !== undefined) partner.name = req.body.name;
    if (order !== undefined) partner.order = order;

    await partner.save();
    if (logoChanged) await deleteFromCloudinary(oldLogo);
    return api.success({ data: partner, message: 'Partner updated' });
  } catch (err) {
    return api.error({ message: err.message, statusCode: 400 });
  }
});

router.delete('/partners/:id', ...adminOnly, async (req, res) => {
  const api = new ApiResponse(res);
  if (!validId(req.params.id)) return api.error({ message: 'Invalid partner ID', statusCode: 400 });
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) return api.error({ message: 'Partner not found', statusCode: 404 });
    await deleteFromCloudinary(partner.logo);
    return api.success({ data: null, message: 'Partner deleted' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

module.exports = router;
