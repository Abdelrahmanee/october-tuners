class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const excluded = ['page', 'limit', 'sort', 'fields', 'lang'];
    const filters = Object.fromEntries(
      Object.entries(this.queryString).filter(([k]) => !excluded.includes(k))
    );
    const filterStr = JSON.stringify(filters).replace(/\b(gte|gt|lte|lt)\b/g, (m) => `$${m}`);
    this.query = this.query.find(JSON.parse(filterStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(',').join(' '));
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    this.query = this.query.skip((page - 1) * limit).limit(limit);
    this._page = page;
    this._limit = limit;
    return this;
  }

  async getPagination(Model, filterQuery = {}) {
    const total = await Model.countDocuments(filterQuery);
    return {
      total,
      page: this._page,
      limit: this._limit,
      totalPages: Math.ceil(total / this._limit),
    };
  }

  // Project only the selected language fields
  localize(lang) {
    const supported = ['en', 'ar'];
    if (!supported.includes(lang)) return this;
    const other = lang === 'en' ? 'ar' : 'en';
    // Remove the opposite language fields from projection using select exclusion
    this.query = this.query.select(`-title_${other} -description_${other} -destination_${other} -theme_${other}`);
    return this;
  }
}

module.exports = APIFeatures;
