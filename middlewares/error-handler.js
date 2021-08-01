module.exports = (error, req, res, next) => {
  const { statusCode = 500, message } = error;

  res
    .status(error.statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
};
