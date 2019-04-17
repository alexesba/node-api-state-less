const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Orders were fetched'
  });
});

router.post('/', (req, res, next) => {
  res.status(200).json({
    message: 'Order was created'
  });
});

router.post('/:orderId', (req, res, next) => {
  const { orderId } = req.params;

  res.status(200).json({
    message: 'Order details',
    orderId,
  });
});

router.delete('/:orderId', (req, res, next) => {
  const { orderId } = req.params;

  res.status(200).json({
    message: 'Order deleted',
    orderId,
  });
});

module.exports = router;
