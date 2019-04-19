const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');


router.get('/', usersController.index);
router.post('/signup', usersController.create)
router.post('/login', usersController.signin);
router.delete('/:userId', usersController.destroy);

module.exports = router;
