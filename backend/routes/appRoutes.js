const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');

router.get('/check_db', appController.checkDb);
router.post('/submit', appController.submitApplication);
router.get('/track', appController.trackApplication);
router.post('/track', appController.trackApplication); // Fallback for POST
router.get('/list', appController.listApplications);

module.exports = router;
