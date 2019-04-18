const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Orders were fetched'
  });
  next();
});

router.post('/', (req, res, next) => {
  const { productId, quantity } = req.body
  const order  = { productId, quantity };
  res.status(200).json({
    message: 'Order was created',
    order,
  });
  next();
});

router.get('/:orderId', (req, res, next) => {
  const { orderId } = req.params;

  res.status(200).json({
    message: 'Order details',
    orderId,
  });
  next();
});

router.delete('/:orderId', (req, res, next) => {
  const { orderId } = req.params;

  res.status(200).json({
    message: 'Order deleted',
    orderId,
  });
  next();
});

module.exports = router;
