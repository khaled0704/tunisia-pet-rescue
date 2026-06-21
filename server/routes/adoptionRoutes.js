const express = require('express');
const router = express.Router();
const { getMyAdoptions, getShelterAdoptions, createAdoption, reviewAdoption } = require('../controllers/adoptionController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.get('/my', protect, allowRoles('visitor'), getMyAdoptions);
router.get('/shelter/:shelterId', protect, allowRoles('shelter', 'admin'), getShelterAdoptions);
router.post('/', protect, allowRoles('visitor'), createAdoption);
router.patch('/:id/review', protect, allowRoles('shelter'), reviewAdoption);

module.exports = router;