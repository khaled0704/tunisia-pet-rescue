const User = require('../models/User');
const jwt = require('jsonwebtoken');
const generateToken = (payload) => {
  return jwt.sign(
    { id: payload._id, role: payload.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req,res) => {
    try{
        const { name , email, password, role } = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({ message: 'Email already in use'});
        }

        const allowedRoles = ['visitor', 'shelter'];
        if (!allowedRoles.includes(role)){
            return res.status(400).json({ message : 'Invalid Role'});
        }
        const user = await User.create({name, email, password, role});
        const token = generateToken(user);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            });
    }catch(error){
        res.status(500).json({ message: error.message});
    }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };