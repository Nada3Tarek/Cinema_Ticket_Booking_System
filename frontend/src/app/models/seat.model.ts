export type SeatStatus = 'AVAILABLE' | 'LOCKED' | 'BOOKED';

export interface Seat {
  _id: string;
  showId: string;
  hallId: string;
  seatNumber: string; // e.g., 'A1', 'B5'
  status: SeatStatus;
  lockedBy?: string;
  lockedAt?: string | Date;
  price: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SeatLayout {
  rows: number;
  columns: number;
  seats: SeatInfo[][];
}

export interface SeatInfo {
  id: string;
  seatNumber: string;
  status: SeatStatus;
  price: number;
  row: number;
  col: number;
}

