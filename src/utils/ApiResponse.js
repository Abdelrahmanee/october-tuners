class ApiResponse {
  constructor(res) {
    this.res = res;
  }

  success({ data = null, message = 'Success', statusCode = 200, pagination = null } = {}) {
    const body = { status: 'success', message, data };
    if (pagination) body.pagination = pagination;
    return this.res.status(statusCode).json(body);
  }

  error({ message = 'Something went wrong', statusCode = 500 } = {}) {
    return this.res.status(statusCode).json({ status: 'error', message, data: null });
  }
}

module.exports = ApiResponse;
