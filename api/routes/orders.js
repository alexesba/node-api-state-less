const express = require('express');

const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  Order.find()
    .select('product quantity _id')
    .exec()
    .then(orders => {
      res.status(200).json({
        count: orders.length,
        orders: orders.map(order => {
          const { _id, product, quantity } = order;
          return {
            _id,
            product,
            quantity,
            request: {
              type: 'GET',
              url: `${url}/${_id}`
            }
          };
        })
      });
    }).catch(error => {
      res.status(500).json({ error});
    });
});

router.post('/', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const { productId, quantity } = req.body
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity,
    product: productId
  })
  order.save()
    .then( result => {
      res.status(201).json({
        order: result,
        request: {
          type: 'GET',
          url: `${url}/${order.id}`
        }
      });
    })
    .catch(error => {
      res.status(500).json({ error });
    })

});

router.get('/:orderId', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const { orderId } = req.params;
  Order.findById(orderId)
    .exec()
    .then(order => {
      res.status(200).json({
        order,
        request: {
          type: 'GET',
          url: `${url}/${order.id}`
        }
      });
    })
    .catch(error => {
      res.status(200).json({ error });
    });
});

router.delete('/:orderId', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const { orderId } = req.params;
  Order.remove({ _id: orderId })
    .exec()
    .then( order => {
      if(order.deletedCount === 0) {
        return res.status(404).json({
          message: `Order not found with the id: ${orderId}`
        });
      }
      res.status(200).json({
        message: 'Order deleted',
        orderId,
        request: {
          type: 'POST',
          url: `${url}/orders`,
          body: { productId: 'ID', quantity: 'number' }
        }
      });
    })
    .catch(error => res.status(500).json({ error }));
});

module.exports = router;
