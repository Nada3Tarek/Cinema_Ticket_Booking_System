const Hall = require('../models/Hall');


class HallService {
  static async createHall(data) {
    const hall = await Hall.create({
      ...data,
      totalSeats: data.rows * data.columns
    });
    return hall;
  }

  static async editHall(hallId, data) {
    const hall = await Hall.findByIdAndUpdate(hallId, {
      ...data,
      totalSeats: data.rows * data.columns
    }, { new: true });
    if (!hall) throw new Error('Hall not found');
    return hall;
  }

  static async removeHall(hallId) {
    const hall = await Hall.findByIdAndDelete(hallId);
    if (!hall) throw new Error('Hall not found');
    return hall;
  }
}
module.exports = HallService;

