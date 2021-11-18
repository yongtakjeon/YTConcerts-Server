const express = require('express');
const router = express.Router();

const userRouter = require('./users');
router.use('/users', userRouter);

const testRouter = require('./test');
router.use('/test', testRouter);

module.exports = router;