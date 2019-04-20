const express = require('express');

const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const productsController = require('../controllers/products');
const imageUploader = require('../uploaders/image');


router.get('/', productsController.index);
router.get('/:productId', productsController.show);
router.patch('/:productId', checkAuth, productsController.update);
router.post('/', checkAuth, imageUploader.single('productImage'), productsController.create);
router.delete('/:productId', checkAuth, productsController.destroy);

module.exports = router;
