const express = require('express');
const router = express.Router();
const { submitResponses } = require('../controllers/responseController');

router.post('/', submitResponses);

module.exports = router;