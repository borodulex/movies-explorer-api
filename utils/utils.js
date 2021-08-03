module.exports = {
  parseValidationErrors(error) {
    return Object.values(error.errors).map((e) => e.message).join('; ');
  },
};
