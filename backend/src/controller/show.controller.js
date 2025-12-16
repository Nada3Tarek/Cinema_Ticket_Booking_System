const ShowService = require('../services/show.service');

exports.createShow = async (req, res) => {
  try {
    const show = await ShowService.createShow(req.body);
    res.status(201).json({
      message: 'Show created and seats generated successfully',
      show
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Edit show
exports.editShow = async (req, res) => {
  try {
    const show = await ShowService.editShow(req.params.showId, req.body);
    res.status(200).json({ message: 'Show updated successfully', show });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove show (soft delete)
exports.removeShow = async (req, res) => {
  try {
    const show = await ShowService.removeShow(req.params.showId);
    res.status(200).json({ message: 'Show removed (soft delete)', show });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.setShowStatus = async (req, res) => {
  try {
    const { showId } = req.params;
    const { isActive } = req.body;

    const show = await ShowService.setActiveStatus(showId, isActive);
    res.status(200).json({
      message: `Show ${isActive ? 'activated' : 'deactivated'} successfully`,
      show
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};