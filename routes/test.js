const express = require('express');
const router = express.Router();

//: /api/test/
router.get('/', (req, res) => {
    res.send('API server is working.');
});

module.exports = router;