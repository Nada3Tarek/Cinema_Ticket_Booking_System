const Seat = require('../models/Seat');

class SeatFactory {
  static generateSeats({ showId, hallId, rows, columns, basePrice }) {
    const seats = [];

    for (let row = 0; row < rows; row++) {
      const rowLetter = String.fromCharCode(65 + row); // A, B, C...

      for (let col = 1; col <= columns; col++) {
        seats.push({
          showId,
          hallId,
          seatNumber: `${rowLetter}${col}`,
          price: basePrice
        });
      }
    }

    return seats;
  }
}

module.exports = SeatFactory;
