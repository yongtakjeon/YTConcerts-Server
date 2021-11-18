const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('API server is working.');
});

module.exports = router;