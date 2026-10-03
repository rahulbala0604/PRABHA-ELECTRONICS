const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries, getEnquiryById, updateEnquiryStatus } = require('../controllers/enquiryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(createEnquiry).get(protect, admin, getEnquiries);
router.route('/:id').get(protect, admin, getEnquiryById).put(protect, admin, updateEnquiryStatus);

module.exports = router;
