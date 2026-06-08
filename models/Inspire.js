const mongoose = require('mongoose');

const inspireSchema = new mongoose.Schema({
  year: { type: Number, index: true },
  date: { type: Date, required: true },
  title_en: { type: String, required: true },
  title_ar: { type: String, required: true },
  carsJoined: { type: Number, default: 0 },
  exhibitors: { type: Number, default: 0 },
  sponsors: [{ logo: String, name: String }],
  sponsorsDisplayStyle: { type: String, enum: ['marquee', 'carousel'], default: 'marquee' },
  youtubeMain: { type: String },
  reels: [{ type: String }],
  gallery: [{ type: String }],
}, { timestamps: true });

inspireSchema.pre('save', function () {
  if (this.date) this.year = new Date(this.date).getFullYear();
});

inspireSchema.pre('findOneAndUpdate', function () {
  const date = this.getUpdate()?.date;
  if (date) this.getUpdate().year = new Date(date).getFullYear();
});

module.exports = mongoose.model('Inspire', inspireSchema);
