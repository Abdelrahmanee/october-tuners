const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Logo = require('../models/Logo');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const ApiResponse = require('../utils/ApiResponse');
const APIFeatures = require('../utils/APIFeatures');

const LOGO_SIZE = 2000;
const LOGOS_DIR = path.join(__dirname, '../uploads/logos');

const saveFile = (buffer, originalname) => {
  const ext = path.extname(originalname);
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
  fs.writeFileSync(path.join(LOGOS_DIR, filename), buffer);
  return `/uploads/logos/${filename}`;
};

const deleteFile = (url) => {
  const filePath = path.join(__dirname, '..', url);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

// GET /api/logos
router.get('/', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const features = new APIFeatures(Logo.find(), req.query).filter().sort().paginate();
    const [data, pagination] = await Promise.all([features.query, features.getPagination(Logo)]);
    return api.success({ data, pagination, message: 'Logos fetched' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

// GET /api/logos/:id
router.get('/:id', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) return api.error({ message: 'Logo not found', statusCode: 404 });
    return api.success({ data: logo });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

// POST /api/logos  — multipart: name (text) + logo (file)
router.post('/', auth, upload.single('logo'), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    if (!req.file) return api.error({ message: 'Logo file is required', statusCode: 400 });
    if (!req.body.name) return api.error({ message: 'name is required', statusCode: 400 });

    const meta = await sharp(req.file.buffer).metadata();
    if (meta.width !== LOGO_SIZE || meta.height !== LOGO_SIZE)
      return api.error({
        message: `Logo must be exactly ${LOGO_SIZE}x${LOGO_SIZE}px. Got ${meta.width}x${meta.height}`,
        statusCode: 422,
      });

    const url = saveFile(req.file.buffer, req.file.originalname);
    const logo = await Logo.create({ name: req.body.name, url });
    return api.success({ data: logo, message: 'Logo created', statusCode: 201 });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

// PUT /api/logos/:id — can update name and/or replace file
router.put('/:id', auth, upload.single('logo'), async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) return api.error({ message: 'Logo not found', statusCode: 404 });

    if (req.file) {
      const meta = await sharp(req.file.buffer).metadata();
      if (meta.width !== LOGO_SIZE || meta.height !== LOGO_SIZE)
        return api.error({
          message: `Logo must be exactly ${LOGO_SIZE}x${LOGO_SIZE}px. Got ${meta.width}x${meta.height}`,
          statusCode: 422,
        });
      deleteFile(logo.url);
      logo.url = saveFile(req.file.buffer, req.file.originalname);
    }

    if (req.body.name) logo.name = req.body.name;
    await logo.save();

    return api.success({ data: logo, message: 'Logo updated' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

// DELETE /api/logos/:id
router.delete('/:id', auth, async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const logo = await Logo.findByIdAndDelete(req.params.id);
    if (!logo) return api.error({ message: 'Logo not found', statusCode: 404 });
    deleteFile(logo.url);
    return api.success({ data: null, message: 'Logo deleted' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

module.exports = router;
