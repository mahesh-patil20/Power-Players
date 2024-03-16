const express = require('express');
const router = express.Router();

const { signup, signin, verifyToken, setMyRole } = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verifyToken', verifyToken);
router.post('/setMyRole', authenticate, setMyRole);

module.exports = router;