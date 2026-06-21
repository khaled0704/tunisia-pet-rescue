const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.array('photos', 5), (req, res) => {
  try {
    const urls = req.files.map(file => file.path);
    res.json({ urls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;