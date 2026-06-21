const express = require('express');
const router = express.Router();
const { getAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal } = require('../controllers/animalController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.get('/', getAnimals);
router.get('/:id', getAnimalById);
router.post('/', protect, allowRoles('shelter', 'admin'), createAnimal);
router.put('/:id', protect, allowRoles('shelter', 'admin'), updateAnimal);
router.delete('/:id', protect, allowRoles('shelter', 'admin', 'visitor'), deleteAnimal);

module.exports = router;