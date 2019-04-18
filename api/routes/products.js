const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) =>  {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString();
    cb(null, `${timestamp}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
   cb(null, true); //save the file
  } else {
    cb(null, false); // not save the file
  }
};

const upload = multer({
  storage,
  fileFilter
});

router.get('/', (req, res) =>{
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(products => {
      res.status(200).json({
        count: products.length,
        products: products.map(({name, _id, price, productImage}) => {
          return {
            name,
            _id,
            price,
            productImage,
            request: {
              type: 'GET',
              url: `${url}/${_id}`
            }
          }
        })
      });
  }).catch(error => {
    res.status(500).json({ error });
  });
});

router.post('/', upload.single('productImage'), (req, res) =>{
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const { name, description, price } = req.body;
  const { path: productImage } = req.file;
  const product = Product({
    _id: mongoose.Types.ObjectId(),
    name,
    description,
    price,
    productImage
  });

  product.save().then( result => {
    res.status(201).json({
      product: result,
      request: {
        type: 'GET',
        url: `${url}/${result._id}`
      }
    });
  }).catch(error => {
    res.status(500).json({
      error
    });
  });

});

router.get('/:productId', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const { productId }  = req.params
  Product.findById(productId)
    .exec()
    .then(product => {
      res.status(200).json({
        product,
        request: {
          type: 'GET',
          url: `${url}/${product._id}`
        }
      });
    })
    .catch(error => {
      res.status(404).json({error})
    });
});

router.patch('/:productId', (req, res) =>{
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const { productId: _id } = req.params;
  const updateOpts = {};
  for (const opts of req.body) {
    updateOpts[opts.propName] = opts.value;
  }

  Product.update({ _id }, { $set: updateOpts })
    .then(product => {
      res.status(200).json({
        product,
        request: {
          type: 'GET',
          url: `${url}/${product._id}`
        }
      });
  }).catch(error =>{
    res.status(500).json({error});
  });

});

router.delete('/:productId', (req, res) =>{
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const { productId: _id } = req.params;
  Product.remove({_id})
    .exec()
    .then(product => {
      res.status(200).json({
        product,
        request: {
          type: 'POST',
          url,
          body: { name: "String", price: "Number" }
        }
      });
    }).catch(error => {
      res.status(500).json({error});
    });
});

module.exports = router;
