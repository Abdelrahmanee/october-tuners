const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name_en: { type: String, required: true },
  name_ar: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
