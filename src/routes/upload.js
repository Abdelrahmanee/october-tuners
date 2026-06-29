const router = require('express').Router();
const sharp = require('sharp');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { ROLES } = require('../constants/roles');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../config/cloudinary');
const ApiResponse = require('../utils/ApiResponse');

const LOGO_SIZE = 2000;

router.post(
  '/',
  auth,
  requireRole(ROLES.ADMIN),
  upload.fields([
    { name: 'logos', maxCount: 20 },
    { name: 'photos', maxCount: 50 },
  ]),
  async (req, res) => {
    const api = new ApiResponse(res);
    const files = req.files || {};

    if (!files.logos && !files.photos)
      return api.error({ message: 'No files uploaded. Send logos and/or photos', statusCode: 400 });

    try {
      const result = {};

      if (files.logos) {
        const logoUrls = [];
        for (const file of files.logos) {
          const meta = await sharp(file.buffer).metadata();
          if (meta.width !== LOGO_SIZE || meta.height !== LOGO_SIZE)
            return api.error({
              message: `Logo "${file.originalname}" must be exactly ${LOGO_SIZE}x${LOGO_SIZE}px. Got ${meta.width}x${meta.height}`,
              statusCode: 422,
            });
          const url = await uploadToCloudinary(file.buffer, 'october-tuners/logos');
          logoUrls.push(url);
        }
        result.logos = logoUrls;
      }

      if (files.photos) {
        const photoUrls = [];
        for (const file of files.photos) {
          const url = await uploadToCloudinary(file.buffer, 'october-tuners/photos');
          photoUrls.push(url);
        }
        result.photos = photoUrls;
      }

      return api.success({ data: result, message: 'Files uploaded successfully', statusCode: 201 });
    } catch (err) {
      return api.error({ message: err.message });
    }
  }
);

module.exports = router;
