const Show = require('../models/Show');
const Hall = require('../models/Hall');
const Seat = require('../models/Seat');
const SeatFactory = require('../factories/seat.factory');

class ShowService {
  static async createShow(data) {
    const { hallName, movieId, startTime, endTime, price } = data;

    if (!hallName) throw new Error('Hall name is required');

    // Find the hall by name
    const hall = await Hall.findOne({ name: hallName });
    if (!hall) throw new Error('Hall not found');

    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error('Start time must be before end time');
    }

    // Check for overlapping shows
    const overlappingShow = await Show.findOne({
      hallId: hall._id,
      isActive: true,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });
    if (overlappingShow) throw new Error('Hall already has a show during this time');

    // Create the show
    const show = await Show.create({
      movieId,
      hallId: hall._id,
      startTime,
      endTime,
      price,
      isActive: true
    });

    // Generate seats
    const seats = SeatFactory.generateSeats({
      showId: show._id,
      hallId: hall._id,
      rows: hall.rows,
      columns: hall.columns,
      basePrice: price
    });

    await Seat.insertMany(seats);

    // Return show with hall populated
    await show.populate('hallId').execPopulate();
    return show;
  }

  static async setActiveStatus(showId, isActive) {
    const show = await Show.findById(showId);
    if (!show) throw new Error('Show not found');
    show.isActive = isActive;
    await show.save();
    return show;
  }

  static async editShow(showId, data) {
    const show = await Show.findByIdAndUpdate(showId, data, { new: true }).populate('hallId');
    if (!show) throw new Error('Show not found');
    return show;
  }

  static async removeShow(showId) {
    const show = await Show.findByIdAndDelete(showId);
    if (!show) throw new Error('Show not found');
    return show;
  }
}

module.exports = ShowService;
