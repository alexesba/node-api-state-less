const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const productRoutes = require('./backend/api/routes/products');
const orderRoutes = require('./backend/api/routes/orders');
const userRoutes = require('./backend/api/routes/users');
const homeRoute = require('./frontend/routes/home');

mongoose.connect(
`mongodb+srv://root:${process.env.MONGO_ATLAS_PW}@restful-api-d5jcu.mongodb.net/test?retryWrites=true`,
  {
    useNewUrlParser: true
  }
);

app.set('view engine', 'jade');
app.set('views', `${__dirname}/frontend/views`);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Authorization');
  if (req.method == 'OPTIONS') {
    res.header('Access-Controll-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/', homeRoute);

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
});

module.exports = app;
