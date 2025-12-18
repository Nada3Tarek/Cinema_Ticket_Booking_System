import { Show } from './show.model';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

export interface Booking {
  _id: string;
  userId: string;
  showId: string | Show;
  seats: string[]; // seatNumbers like ['A1', 'A2']
  totalPrice: number;
  status: BookingStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface BookingReserveRequest {
  showId: string;
  seats: string[]; // seat IDs (MongoDB ObjectIds)
  totalPrice: number;
}

export interface BookingConfirmRequest {
  bookingId: string;
  method: 'CARD' | 'WALLET' | 'CASH';
  extra?: {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

export interface BookingCancelRequest {
  bookingId: string;
}

export interface BookingListItem {
  bookingId: string;
  movieTitle: string;
  hallName: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string | Date;
}

export interface BookingDetails {
  bookingId: string;
  movieTitle: string;
  hallName: string;
  showStartTime: string | Date;
  showEndTime: string | Date;
  seats: Array<{
    seatNumber: string;
    price: number;
  }>;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string | Date;
}

