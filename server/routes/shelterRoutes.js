const express = require('express');
const router = express.Router();
const { getShelters, getShelterById, createShelter, updateShelter, verifyShelter } = require('../controllers/shelterController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.get('/all', protect, allowRoles('admin'), async (req, res) => {
  try {
    const shelters = await require('../models/Shelter').find()
      .populate('managedBy', 'name email')
      .sort({ createdAt: -1 })
    res.json(shelters)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/', getShelters);
router.get('/:id', getShelterById);
router.post('/', protect, allowRoles('shelter'), createShelter);
router.put('/:id', protect, allowRoles('shelter'), updateShelter);
router.patch('/:id/verify', protect, allowRoles('admin'), verifyShelter);

module.exports = router;