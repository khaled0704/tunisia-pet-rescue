const express = require('express');
const router = express.Router();
const { getReports, getReportById, createReport, handleReport, resolveReport } = require('../controllers/reportController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.get('/', protect, allowRoles('shelter', 'admin'), getReports);
router.get('/:id', protect, allowRoles('shelter', 'admin'), getReportById);
router.post('/', protect, createReport);
router.patch('/:id/handle', protect, allowRoles('shelter'), handleReport);
router.patch('/:id/resolve', protect, allowRoles('shelter', 'admin'), resolveReport);

module.exports = router;