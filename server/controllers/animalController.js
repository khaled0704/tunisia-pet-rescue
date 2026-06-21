const Animal = require('../models/Animal');

const getAnimals = async (req, res) => {
  try {
    const { species, status, city } = req.query;
    const filter = {};

    if (species) filter.species = species;
    if (status) filter.status = status;
    if (city) filter.location = { $regex: city, $options: 'i' };

    const animals = await Animal.find(filter)
      .populate('shelter', 'name city phone')
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnimalById = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id)
      .populate('shelter', 'name city phone email')
      .populate('postedBy', 'name email');

    if (!animal) return res.status(404).json({ message: 'Animal not found' });

    res.json(animal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAnimal = async (req, res) => {
  try {
    const { name, species, age, gender, description, photos, healthStatus, location, shelter } = req.body;

    const animal = await Animal.create({
      name,
      species,
      age,
      gender,
      description,
      photos,
      healthStatus,
      location,
      shelter,
      postedBy: req.user.id,
    });

    res.status(201).json(animal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Animal not found' });

    if (animal.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Animal not found' });

    if (animal.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await animal.deleteOne();
    res.json({ message: 'Animal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal };