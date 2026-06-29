const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  year: { type: Number, index: true },
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
}, { timestamps: true });

rideSchema.pre('save', function () {
  if (this.date) this.year = new Date(this.date).getFullYear();
});

rideSchema.pre('findOneAndUpdate', function () {
  const date = this.getUpdate()?.date;
  if (date) this.getUpdate().year = new Date(date).getFullYear();
});

module.exports = mongoose.model('Ride', rideSchema);
