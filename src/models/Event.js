const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  year: { type: Number, index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  destination_en: { type: String, required: true },
  destination_ar: { type: String, required: true },
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
  theme_en: { type: String },
  theme_ar: { type: String },
  colorPalette: [{ type: String }],
}, { timestamps: true });

eventSchema.pre('save', function () {
  if (this.date) this.year = new Date(this.date).getFullYear();
});

eventSchema.pre('findOneAndUpdate', function () {
  const date = this.getUpdate()?.date;
  if (date) this.getUpdate().year = new Date(date).getFullYear();
});

module.exports = mongoose.model('Event', eventSchema);
