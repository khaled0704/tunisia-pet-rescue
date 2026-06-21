const Report = require('../models/Report');

const getReports = async (req, res) => {
  try {
    const { city, status } = req.query;
    const filter = {};

    if (city) filter.city = { $regex: city, $options: 'i' };
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .populate('reportedBy', 'name email phone')
      .populate('handledBy', 'name city phone')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reportedBy', 'name email phone')
      .populate('handledBy', 'name city phone');

    if (!report) return res.status(404).json({ message: 'Report not found' });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReport = async (req, res) => {
  try {
    const { description, photos, location, city, species } = req.body;

    const report = await Report.create({
      description,
      photos,
      location,
      city,
      species,
      reportedBy: req.user.id,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (report.status === 'resolved') {
      return res.status(400).json({ message: 'Report already resolved' });
    }

    report.handledBy = req.body.shelterId;
    report.status = 'in_progress';
    await report.save();

    res.json({ message: 'Report accepted', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resolveReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = 'resolved';
    await report.save();

    res.json({ message: 'Report resolved', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReports, getReportById, createReport, handleReport, resolveReport };