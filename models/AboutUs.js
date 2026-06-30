const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
  key: {
    type: String,
    default: 'about-us',
    unique: true,
    immutable: true,
  },
  pageTitle: { type: String, required: true, trim: true },
  overview: { type: String, required: true, trim: true },
  history: {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  companyIntroduction: {
    title: { type: String, required: true, trim: true },
    mission: { type: String, required: true, trim: true },
    vision: { type: String, required: true, trim: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('AboutUs', aboutUsSchema);
