import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrowseService } from '../../services/browse.service';
import { BookingService } from '../../services/booking.service';
import { Show, ShowWithDetails } from '../../models/show.model';
import { Hall } from '../../models/hall.model';
import { SeatInfo, SeatStatus } from '../../models/seat.model';
import { BookingReserveRequest, BookingConfirmRequest } from '../../models/booking.model';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  show: ShowWithDetails | null = null;
  hall: Hall | null = null;
  movie: Movie | null = null;
  seatLayout: SeatInfo[][] = [];
  selectedSeats: Set<string> = new Set();
  unavailableSeats: Set<string> = new Set();
  loading = false;
  step: 'select' | 'payment' = 'select';
  bookingId: string | null = null;
  totalPrice = 0;
  paymentForm: FormGroup;
  seatMap = new Map<string, SeatInfo>(); // Map seatNumber to SeatInfo

  getRowLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getSelectedSeatsList(): string {
    return Array.from(this.selectedSeats).join(', ');
  }

  // getMovieTitle(): string {
  //   if (!this.show) return 'N/A';
  //   const movie = this.show.movieId;
  //   if (typeof movie === 'string') return 'N/A';
  //   return movie.title || 'N/A';
  // }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private browseService: BrowseService,
    private bookingService: BookingService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    public authService: AuthService
  ) {
    this.paymentForm = this.fb.group({
      method: ['CARD', Validators.required],
      cardNumber: [''],
      cardHolder: [''],
      expiryDate: [''],
      cvv: ['']
    });
  }

ngOnInit(): void {
  const showId = this.route.snapshot.paramMap.get('id');
  const state = history.state;

  this.show = state?.show ?? null;
  this.movie = state?.movie ?? null;

  // Case 1️⃣: show passed from navigation AND hall has layout
  if (
    this.show &&
    typeof this.show.hallId === 'object' &&
    (this.show.hallId as Hall).rows &&
    (this.show.hallId as Hall).columns
  ) {
    this.hall = this.show.hallId as Hall;

    if (!Array.isArray(this.show.bookedSeats)) {
      this.show.bookedSeats = [];
    }

    if (!this.movie && typeof this.show.movieId === 'object') {
      this.movie = this.show.movieId as Movie;
    }

    this.generateSeatLayout();
    return;
  }

  // Case 2️⃣: navigation state incomplete → fetch from backend
  if (showId) {
    this.loadShowDetails(showId);
    return;
  }

  // Case 3️⃣: nothing available
  this.errorHandler.handleError({ message: 'Show not found' });
  this.router.navigate(['/']);
}





getMovieTitle(): string {
  return this.movie?.title || 'N/A';
}

  loadShowDetails(showId: string): void {
  this.loading = true;

  this.bookingService.getShowById(showId).subscribe({
    next: (show) => {
      this.show = show;
      if (typeof show.hallId !== 'string') {
        this.hall = show.hallId as Hall;
        this.generateSeatLayout();
      } else {
        this.errorHandler.handleError({ message: 'Hall info missing' });
      }
      this.loading = false;
    },
    error: (err) => {
      this.loading = false;
      this.errorHandler.handleError(err);
      this.router.navigate(['/']);
    }
  });
}


  generateSeatLayout(): void {
  if (!this.hall || !this.show) return;

  const layout: SeatInfo[][] = [];
  const rows = this.hall.rows;
  const cols = this.hall.columns;

  // 🔹 Use backend seat info
  const seatsFromBackend = (this.show as any).seats as {
    seatNumber: string;
    status: SeatStatus;
    price: number;
  }[] || [];

  // Build a map of seatNumber -> status
  const seatStatusMap = new Map<string, SeatStatus>();
  seatsFromBackend.forEach(seat => seatStatusMap.set(seat.seatNumber, seat.status));

  for (let row = 0; row < rows; row++) {
    const rowLetter = String.fromCharCode(65 + row);
    const seatRow: SeatInfo[] = [];

    for (let col = 1; col <= cols; col++) {
      const seatNumber = `${rowLetter}${col}`;
      const status = seatStatusMap.get(seatNumber) || 'AVAILABLE';
      
      const seatInfo: SeatInfo = {
        id: `${this.show._id}-${seatNumber}`,
        seatNumber,
        status,
        price: this.show.price,
        row,
        col
      };

      seatRow.push(seatInfo);
      this.seatMap.set(seatNumber, seatInfo);

      if (status !== 'AVAILABLE') {
        this.unavailableSeats.add(seatNumber);
      }
    }

    layout.push(seatRow);
  }

  this.seatLayout = layout;
  console.log('seatLayout generated:', this.seatLayout);
}


  toggleSeat(seatNumber: string): void {
    if (this.unavailableSeats.has(seatNumber)) {
      return;
    }

    if (this.selectedSeats.has(seatNumber)) {
      this.selectedSeats.delete(seatNumber);
    } else {
      this.selectedSeats.add(seatNumber);
    }

    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalPrice = Array.from(this.selectedSeats).reduce((sum, seatNumber) => {
      const seat = this.seatMap.get(seatNumber);
      return sum + (seat?.price || 0);
    }, 0);
  }

  proceedToPayment(): void {
    if (this.selectedSeats.size === 0) {
      this.errorHandler.handleError({ message: 'Please select at least one seat' });
      return;
    }

    this.loading = true;
    // NOTE: Backend expects seat IDs (MongoDB ObjectIds), but we're sending seatNumbers
    // This is a limitation - ideally backend should accept seatNumbers or provide an endpoint
    // to get seat IDs for a show. For now, sending seatNumbers as strings.
    const request: BookingReserveRequest = {
      showId: this.show!._id,
      seats: Array.from(this.selectedSeats), // Sending seatNumbers (e.g., ['A1', 'A2'])
      totalPrice: this.totalPrice
    };

    this.bookingService.reserveSeats(request).subscribe({
      next: (response: any) => {
        this.bookingId = response._id || response.bookingId;
        this.step = 'payment';
        this.loading = false;
        this.errorHandler.showSuccess('Seats reserved. Please complete payment.');
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });
  }

  confirmBooking(): void {
    if (!this.bookingId) return;

    if (this.paymentForm.get('method')?.value === 'CARD' && !this.paymentForm.get('cardNumber')?.value) {
      this.errorHandler.handleError({ message: 'Please enter card details' });
      return;
    }

    this.loading = true;
    const formValue = this.paymentForm.value;
    const request: BookingConfirmRequest = {
      bookingId: this.bookingId,
      method: formValue.method,
      extra: formValue.method === 'CARD' ? {
        cardNumber: formValue.cardNumber,
        cardHolder: formValue.cardHolder,
        expiryDate: formValue.expiryDate,
        cvv: formValue.cvv
      } : undefined
    };

    this.bookingService.confirmBooking(request).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Booking confirmed successfully!');
        this.router.navigate(['/bookings']);
      },
      error: (error) => {
        this.loading = false;
        if (error.message?.includes('expired')) {
          this.errorHandler.handleError({ message: 'Booking expired. Please select seats again.' });
          this.step = 'select';
          this.bookingId = null;
        } else {
          this.errorHandler.handleError(error);
        }
      }
    });
  }

  cancelBooking(): void {
    if (!this.bookingId) {
      this.router.navigate(['/']);
      return;
    }

    this.loading = true;
    this.bookingService.cancelBooking({ bookingId: this.bookingId }).subscribe({
      next: () => {
        this.errorHandler.showInfo('Booking cancelled');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });
  }
}

