const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
  key: {
    type: String,
    default: 'about-us',
    unique: true,
    immutable: true,
  },
  pageTitle_en: { type: String, required: true, trim: true },
  pageTitle_ar: { type: String, required: true, trim: true },
  overview_en: { type: String, required: true, trim: true },
  overview_ar: { type: String, required: true, trim: true },
  history: {
    title_en: { type: String, required: true, trim: true },
    title_ar: { type: String, required: true, trim: true },
    description_en: { type: String, required: true, trim: true },
    description_ar: { type: String, required: true, trim: true },
  },
  companyIntroduction: {
    title_en: { type: String, required: true, trim: true },
    title_ar: { type: String, required: true, trim: true },
    mission_en: { type: String, required: true, trim: true },
    mission_ar: { type: String, required: true, trim: true },
    vision_en: { type: String, required: true, trim: true },
    vision_ar: { type: String, required: true, trim: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('AboutUs', aboutUsSchema);
