const express = require('express');
const router = express.Router();

//: /api/users/
const userRouter = require('./users');
router.use('/users', userRouter);

//: /api/test/
const testRouter = require('./test');
router.use('/test', testRouter);

module.exports = router;