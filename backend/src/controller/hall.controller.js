const HallService = require('../services/hall.service');

// Create hall
exports.createHall = async (req, res) => {
  try {
    const hall = await HallService.createHall(req.body);
    res.status(201).json({ message: 'Hall created successfully', hall });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Edit hall
exports.editHall = async (req, res) => {
  try {
    const hall = await HallService.editHall(req.params.hallId, req.body);
    res.status(200).json({ message: 'Hall updated successfully', hall });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove hall
exports.removeHall = async (req, res) => {
  try {
    const hall = await HallService.removeHall(req.params.hallId);
    res.status(200).json({ message: 'Hall removed successfully', hall });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
