const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/', (req, res, next) =>{
  Product.find().exec().then(products => {
    res.status(200).json(products);
    next();
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
    next();
  });
});

router.get('/:productId', (req, res) => {
  const { productId }  = req.params
  Product.findById(productId)
    .exec()
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch(error => {
      res.status(404).json({error})
    });
});

router.patch('/:productId', (req, res) =>{
  const { productId: _id } = req.params;
  const updateOpts = {};
  for (const opts of req.body) {
    updateOpts[opts.propName] = opts.value;
  }

  Product.update({ _id }, { $set: updateOpts })
    .then(product => {
      console.log(product);
      res.status(200).json(product);
  }).catch(error =>{
    console.log(error);
    res.status(500).json({error});
  });

});

router.delete('/:productId', (req, res) =>{
  const { productId: _id } = req.params;
  Product.remove({_id})
    .exec()
    .then(product => {
      res.status(200).json(product);
    }).catch(error => {
      res.status(500).json({error});
    });
});

router.post('/', (req, res) =>{
  const { name, description, price } = req.body;

  const product = Product({
    _id: mongoose.Types.ObjectId(),
    name,
    description,
    price
  });

  product.save().then( result => {
    res.status(200).json({
      product: result
    });
  }).catch(error => {
    res.status(500).json({
      error
    });
  });

});

module.exports = router;
