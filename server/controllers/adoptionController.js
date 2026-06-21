const Adoption = require('../models/Adoption');
const Animal = require('../models/Animal');

const getMyAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find({ applicant: req.user.id })
      .populate('animal', 'name species photos status')
      .populate('shelter', 'name city phone')
      .sort({ createdAt: -1 });

    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShelterAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find({ shelter: req.params.shelterId })
      .populate('animal', 'name species photos')
      .populate('applicant', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAdoption = async (req, res) => {
  try {
    const { animalId, note } = req.body;

    const animal = await Animal.findById(animalId);
    if (!animal) return res.status(404).json({ message: 'Animal not found' });

    if (animal.status !== 'available') {
      return res.status(400).json({ message: 'Animal is not available for adoption' });
    }

    const adoption = await Adoption.create({
      animal: animalId,
      applicant: req.user.id,
      shelter: animal.shelter,
      note,
    });
    animal.status = 'pending';
    await animal.save();

    res.status(201).json(adoption);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You already applied for this animal' });
    }
    res.status(500).json({ message: error.message });
  }
};

const reviewAdoption = async (req, res) => {
  try {
    const { status } = req.body; 

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const adoption = await Adoption.findById(req.params.id);
    if (!adoption) return res.status(404).json({ message: 'Adoption not found' });

    adoption.status = status;
    adoption.reviewedAt = Date.now();
    await adoption.save();
    const animal = await Animal.findById(adoption.animal);
    if (animal) {
      animal.status = status === 'approved' ? 'adopted' : 'available';
      await animal.save();
    }

    res.json({ message: `Adoption ${status}`, adoption });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyAdoptions, getShelterAdoptions, createAdoption, reviewAdoption };