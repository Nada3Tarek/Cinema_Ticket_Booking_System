import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { MatCardHeader } from "@angular/material/card";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    DatePipe
  ],
})
export class BookingDetailsComponent implements OnInit {
  booking: any = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('id');
    if (bookingId) this.loadBookingDetails(bookingId);
  }

  loadBookingDetails(bookingId: string): void {
    this.loading = true;
    this.bookingService.getBookingDetails(bookingId).subscribe({
      next: (booking) => {
        console.log('Booking loaded:', booking); // check console
        this.booking = booking;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.errorHandler.handleError(err);
      }
    });
  }

 confirmBooking(): void {
  const bookingId = this.booking.bookingId; // <-- use bookingId
  console.log('Confirming bookingId:', bookingId);
  this.bookingService.confirmBooking({ bookingId, method: 'CARD' }).subscribe({
    next: (res) => {
      console.log('Booking confirmed', res);
      this.booking.status = 'CONFIRMED';
    },
    error: (err) => console.error('Error confirming booking', err)
  });
}

cancelBooking(): void {
  const bookingId = this.booking.bookingId; // <-- use bookingId
  console.log('Cancelling bookingId:', bookingId);
  this.bookingService.cancelBooking({ bookingId }).subscribe({
    next: () => this.router.navigate(['/bookings']),
    error: (err) => this.errorHandler.handleError(err)
  });
}


}
