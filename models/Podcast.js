const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  year: { type: Number, index: true },
  title_en: { type: String, required: true },
  title_ar: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  date: { type: Date, required: true },
}, { timestamps: true });

podcastSchema.pre('save', function () {
  if (this.date) this.year = new Date(this.date).getFullYear();
});

podcastSchema.pre('findOneAndUpdate', function () {
  const date = this.getUpdate()?.date;
  if (date) this.getUpdate().year = new Date(date).getFullYear();
});

module.exports = mongoose.model('Podcast', podcastSchema);
