const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const conversationRoutes = require('./conversationRoutes');
const messageRoutes = require('./messageRoutes');

router.use('/user', userRoutes);
router.use('/conversation', conversationRoutes);
router.use('/message', messageRoutes);

module.exports = router;