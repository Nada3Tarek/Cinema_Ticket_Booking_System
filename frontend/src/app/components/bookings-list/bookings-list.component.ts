import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingListItem } from '../../models/booking.model';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.scss']
})
export class BookingsListComponent implements OnInit {
  bookings: BookingListItem[] = [];
  loading = false;

  constructor(
    private bookingService: BookingService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getUserBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'primary';
      case 'PENDING':
        return 'accent';
      case 'CANCELLED':
        return 'warn';
      case 'EXPIRED':
        return 'warn';
      default:
        return '';
    }
  }
  // BookingsListComponent
viewBooking(booking: BookingListItem): void {
  if (booking.status === 'PENDING') {
    this.router.navigate(['/bookings', booking.bookingId]); // matches the route
  }
}

}

