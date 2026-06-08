const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const ApiResponse = require('../utils/ApiResponse');

const LOGO_SIZE = 2000;
const LOGOS_DIR = path.join(__dirname, '../uploads/logos');
const PHOTOS_DIR = path.join(__dirname, '../uploads/photos');

const saveFile = (buffer, dir, filename) => {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath.replace(path.join(__dirname, '..'), '').replace(/\\/g, '/');
};

const generateFilename = (originalname) => {
  const ext = path.extname(originalname);
  return `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
};

router.post(
  '/',
  auth,
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

      // process logos — validate 2000x2000
      if (files.logos) {
        const logoUrls = [];
        for (const file of files.logos) {
          const meta = await sharp(file.buffer).metadata();
          if (meta.width !== LOGO_SIZE || meta.height !== LOGO_SIZE)
            return api.error({
              message: `Logo "${file.originalname}" must be exactly ${LOGO_SIZE}x${LOGO_SIZE}px. Got ${meta.width}x${meta.height}`,
              statusCode: 422,
            });
          const filename = generateFilename(file.originalname);
          logoUrls.push(saveFile(file.buffer, LOGOS_DIR, filename));
        }
        result.logos = logoUrls;
      }

      // process photos — no dimension restriction
      if (files.photos) {
        const photoUrls = [];
        for (const file of files.photos) {
          const filename = generateFilename(file.originalname);
          photoUrls.push(saveFile(file.buffer, PHOTOS_DIR, filename));
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
