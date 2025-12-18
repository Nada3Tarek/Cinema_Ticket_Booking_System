const Hall = require('../models/Hall');

class HallService {

  // CREATE
  static async createHall(data) {
    const { rows, columns } = data;

    if (!rows || !columns) {
      throw new Error('Rows and columns are required');
    }

    return await Hall.create({
      ...data,
      totalSeats: rows * columns
    });
  }

 static async editHall(hallId, data) {
  // 1. Fetch existing hall
  const existingHall = await Hall.findById(hallId);
  if (!existingHall) throw new Error('Hall not found');

  // 2. Determine final layout values
  const rows = data.rows !== undefined ? data.rows : existingHall.rows;
  const columns = data.columns !== undefined ? data.columns : existingHall.columns;

  // 3. Recalculate total seats
  const totalSeats = rows * columns;

  // 4. Update
  const hall = await Hall.findByIdAndUpdate(
    hallId,
    {
      ...data,
      totalSeats
    },
    { new: true }
  );

  return hall;
}


  // DELETE
  static async removeHall(hallId) {
    const hall = await Hall.findByIdAndDelete(hallId);
    if (!hall) throw new Error('Hall not found');
    return hall;
  }
}

module.exports = HallService;
