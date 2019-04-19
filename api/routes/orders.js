const express = require('express');

const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const ordersController = require('../controllers/orders');

router.get('/', ordersController.index);
router.get('/:orderId', ordersController.show);
router.post('/', checkAuth, ordersController.create);
router.delete('/:orderId', checkAuth, ordersController.destroy);

module.exports = router;
