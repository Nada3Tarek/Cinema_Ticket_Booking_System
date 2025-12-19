import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  BookingReserveRequest,
  BookingConfirmRequest,
  BookingCancelRequest,
  BookingListItem,
  BookingDetails
} from '../models/booking.model';
import { ShowWithDetails } from '../models/show.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_BASE = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  reserveSeats(request: BookingReserveRequest): Observable<any> {
    return this.http.post(`${this.API_BASE}/bookings/reserve`, request);
  }

  confirmBooking(request: BookingConfirmRequest): Observable<any> {
    return this.http.post(`${this.API_BASE}/bookings/confirm`, request);
  }

  cancelBooking(request: BookingCancelRequest): Observable<any> {
    return this.http.post(`${this.API_BASE}/bookings/cancel`, request);
  }

  getUserBookings(): Observable<BookingListItem[]> {
    return this.http.get<BookingListItem[]>(`${this.API_BASE}/bookings/user`);
  }

  getPendingBookings(): Observable<BookingListItem[]> {
    return this.http.get<BookingListItem[]>(`${this.API_BASE}/bookings/pending`);
  }

  getBookingDetails(bookingId: string): Observable<BookingDetails> {
    return this.http.get<BookingDetails>(`${this.API_BASE}/bookings/${bookingId}`);
  }

  /**
   * Get show by ID, safely typed with ShowWithDetails
   */
  getShowById(showId: string): Observable<ShowWithDetails> {
    return this.http.get<ShowWithDetails>(`${this.API_BASE}/bookings/show/${showId}`).pipe(
      map((show) => {
        // Ensure required properties exist
        if (
          !show.movieId || typeof show.movieId !== 'object' || !('_id' in show.movieId) ||
          !show.hallId || typeof show.hallId !== 'object' || !('name' in show.hallId)
        ) {
          throw new Error('Show data incomplete');
        }
        return show;
      })
    );
  }
}
