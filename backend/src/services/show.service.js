const Show = require('../models/Show');
const Hall = require('../models/Hall');
const Seat = require('../models/Seat');
const SeatFactory = require('../factories/seat.factory');

class ShowService {
  static async createShow(data) {
    const { hallId, startTime, endTime } = data;

    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error('Start time must be before end time');
    }

    // 2️⃣ Check overlapping shows in same hall
    const overlappingShow = await Show.findOne({
      hallId,
      isActive: true,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (overlappingShow) {
      throw new Error('Hall already has a show during this time');
    }

    // 3️⃣ Get hall
    const hall = await Hall.findById(hallId);
    if (!hall) throw new Error('Hall not found');

    // 4️⃣ Create show
    const show = await Show.create({
      movieId: data.movieId,
      hallId,
      startTime,
      endTime,
      price: data.price,
      isActive: true
    });

    // 5️⃣ Generate seats
    const seats = SeatFactory.generateSeats({
      showId: show._id,
      hallId: hall._id,
      rows: hall.rows,
      columns: hall.columns,
      basePrice: data.price
    });

    await Seat.insertMany(seats);

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
    const show = await Show.findByIdAndUpdate(showId, data, { new: true });
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
