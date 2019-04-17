const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) =>{
  res.status(200).json({
    message: 'Handling GET requests to /products'
  });
});

router.get('/:productId', (req, res, next) =>{
  const { productId }  = req.params
  let message = `You passed an Id: ${productId}`

  if (productId == 'special') {
    message = `You discovered the special id: ${productId}`
  }

  res.status(200).json({
    message,
    productId
  });
});

router.patch('/:productId', (req, res, next) =>{
  res.status(200).json({
    message: 'Updated Product'
  });
});

router.delete('/:productId', (req, res, next) =>{
  res.status(200).json({
    message: 'Deleted Product'
  });
});



router.post('/', (req, res, next) =>{
  res.status(200).json({
    message: 'Handling POST requests to /products'
  });
});

module.exports = router;
