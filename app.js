const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');

const { PORT, MONGO_URL } = require('./config');

const app = express();
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ! хардкод пока не реализована авторизация
app.use((req, res, next) => {
  req.user = {
    _id: '6106edb970995c73eaebaf97',
  };

  next();
});

app.use(routes);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
