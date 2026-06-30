const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

const deleteFromCloudinary = async (url) => {
  try {
    // extract public_id from url: .../folder/filename.ext → folder/filename
    const parts = new URL(url).pathname.split('/').filter(Boolean);
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return;

    const assetParts = parts.slice(uploadIndex + 1);
    if (/^v\d+$/.test(assetParts[0])) assetParts.shift();
    if (!assetParts.length) return;

    const last = assetParts.length - 1;
    assetParts[last] = assetParts[last].replace(/\.[^.]+$/, '');
    await cloudinary.uploader.destroy(decodeURIComponent(assetParts.join('/')));
  } catch {
    // non-blocking
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
