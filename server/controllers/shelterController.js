const Shelter = require('../models/Shelter');

const getShelters = async (req,res) =>{
    try{   
        const {city} = req.query;
        const filter = { isVerified: true};
        if (city) filter.city = {$regex: city, $options: 'i'};
        const shelters = await Shelter.find(filter)
            .populate('managedBy', 'name email')
            .sort({createdAt: -1});
        res.json(shelters);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}
const getShelterById = async (res,req) =>{
    try{
        const shelter = await Shelter.findById(req.params.id)
         .populate('managedBy','name email');
        if (!shelter) return res.status(404).json({message: 'Shelter not found!'})
        res.json(shelter);
    } catch (error){
        res.status(500).json({message: error.message});
    }
}
const createShelter = async (req,res) =>{
    try{
        const existing = await Shelter.findOne({managedBy: req.user.id});
        if (existing) {
            return res.status(400).json({ message: 'You already have a shelter' });
        }
        const { name, description, address, city, phone, email, logo} = req.body;
        const shelter = await Shelter.create({
            name,
            description,
            address,
            city,
            phone,
            email,
            logo,
            managedBy: req.user.id,
        });
        res.status(201).json(shelter);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}
const updateShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) return res.status(404).json({ message: 'Shelter not found' });

    if (shelter.managedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Shelter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const verifyShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!shelter) return res.status(404).json({ message: 'Shelter not found' });

    res.json({ message: 'Shelter verified', shelter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getShelters, getShelterById, createShelter, updateShelter, verifyShelter };
