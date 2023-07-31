// routes/genreBend.js

const express = require('express');
const router = express.Router();
const GenreBendController = require('../controllers/genre-controller');

// Genre Bend routes
router.get('/genre-bend/:title/:genre', GenreBendController.genreBend);

module.exports = router;
