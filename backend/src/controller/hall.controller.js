const HallService = require('../services/hall.service');

exports.createHall = async (req, res) => {
  try {
    const hall = await HallService.createHall(req.body);
    res.status(201).json({
      success: true,
      message: 'Hall created successfully',
      hall
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.editHall = async (req, res) => {
  try {
    const hall = await HallService.editHall(req.params.hallId, req.body);
    res.status(200).json({
      success: true,
      message: 'Hall updated successfully',
      hall
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
exports.getHalls = async (req, res) => {
  try {
    const includeInactive = req.user?.role === 'admin';

    const halls = await HallService.getHalls({ includeInactive });

    res.status(200).json({
      success: true,
      count: halls.length,
      halls
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeHall = async (req, res) => {
  try {
    const hall = await HallService.removeHall(req.params.hallId);
    res.status(200).json({
      success: true,
      message: 'Hall removed successfully',
      hall
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

