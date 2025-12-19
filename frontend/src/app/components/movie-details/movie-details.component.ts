import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowseService } from '../../services/browse.service';
import { ReviewService } from '../../services/review.service';
import { BookingService } from '../../services/booking.service';
import { Movie } from '../../models/movie.model';
import { Show, ShowWithDetails } from '../../models/show.model';
import { Review, ReviewCreateRequest } from '../../models/review.model';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../services/auth.service';
import { Hall } from '../../models/hall.model';

type SeatBackend = {
  seatNumber: string;
  status: 'AVAILABLE' | 'LOCKED' | 'BOOKED';
  price: number;
  _id: string;
};

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  shows: Show[] = [];
  reviews: Review[] = [];
  loading = false;

  reviewFormVisible = false;
  reviewForm: { rating: number; comment: string } = {
    rating: 5,
    comment: ''
  };
  replyForm: { [reviewId: string]: string } = {};

  likedReviews = new Set<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private browseService: BrowseService,
    private reviewService: ReviewService,
    private bookingService: BookingService,
    private errorHandler: ErrorHandlerService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (!movieId) {
      this.errorHandler.handleError({ message: 'Movie id is missing' });
      this.router.navigate(['/']);
      return;
    }

    this.loadMovieDetails(movieId);
    this.loadReviews(movieId);
  }
  
  getHallName(show: Show): string {
    const hall: any = (show as any)?.hallId;

    if (!hall) return 'N/A';
    if (typeof hall === 'object' && hall?.name) return hall.name;

    return 'N/A';
  }

  loadMovieDetails(movieId: string): void {
    this.loading = true;

    this.browseService.browseMoviesWithShowtimes({}).subscribe({
      next: (response: any) => {
        const foundMovie = response?.data?.find((m: any) => m?._id === movieId);

        if (!foundMovie) {
          this.errorHandler.handleError({ message: 'Movie not found' });
          this.router.navigate(['/']);
          return;
        }

        this.movie = foundMovie as Movie;
        this.shows = (foundMovie?.shows ?? []) as Show[];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });
  }

  loadReviews(movieId: string): void {
    this.reviewService.getReviews(movieId).subscribe({
      next: (response: any) => {
        this.reviews = (response?.reviews ?? []) as Review[];
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

selectShow(show: Show): void {
  if (!show._id) {
    this.errorHandler.handleError({ message: 'Invalid show selected' });
    return;
  }

  const hall: Hall = typeof show.hallId === 'object'
    ? (show.hallId as Hall)
    : {
        _id: 'temp',
        name: 'Hall 1',
        rows: 5,
        columns: 8,
        isActive: true
      };

  const movie: Movie = typeof show.movieId === 'object'
    ? (show.movieId as Movie)
    : this.movie!;

  const bookedSeats: string[] = Array.isArray((show as any).seats)
    ? (show as any).seats
        .filter((seat: { seatNumber: string; status: string }) =>
          seat.status === 'BOOKED' || seat.status === 'LOCKED'
        )
        .map((seat: { seatNumber: string; status: string }) => seat.seatNumber)
    : [];

  const fullShow: ShowWithDetails = {
    ...show,
    hallId: hall,
    movieId: movie,
    bookedSeats
  };

  this.router.navigate(['/booking', show._id], { state: { show: fullShow, movie } });
}








  submitReview(): void {
  if (!this.movie) return;

  const rating = Number(this.reviewForm.rating);
  const comment = (this.reviewForm.comment || '').trim();

  if (!comment) {
    this.errorHandler.handleError({ message: 'Comment is required' });
    return;
  }

  const request: ReviewCreateRequest = {
    movieId: this.movie._id,
    rating,
    comment
  };

  this.reviewService.createReview(request).subscribe({
    next: () => {
      this.errorHandler.showSuccess('Review submitted successfully');
      this.reviewFormVisible = false;
      this.reviewForm = { rating: 5, comment: '' };
      this.loadReviews(this.movie!._id);
    },
    error: (error: any) => {
    if (error?.message?.includes('already reviewed') || error?.status === 400) {
      this.errorHandler.handleError({ message: 'You have already submitted a review for this movie.' });
    } else {
      this.errorHandler.handleError(error);
    }

    }
  });
}


  likeReview(reviewId: string): void {
    if (this.likedReviews.has(reviewId)) return;
    const index = this.reviews.findIndex(r => r._id === reviewId);
    const prev = index !== -1 ? { ...this.reviews[index] } : null;

    if (index !== -1) {
      this.reviews[index] = {
        ...this.reviews[index],
        likeCount: (this.reviews[index].likeCount ?? 0) + 1
      } as Review;
    }
    this.likedReviews.add(reviewId);

    this.reviewService.likeReview(reviewId).subscribe({
      next: (updated: any) => {
        const i = this.reviews.findIndex(r => r._id === reviewId);
        if (i !== -1) this.reviews[i] = updated as Review;
      },
      error: (error) => {
        if (index !== -1 && prev) this.reviews[index] = prev as Review;
        this.likedReviews.delete(reviewId);
        this.errorHandler.handleError(error);
      }
    });
  }

replyToReview(reviewId: string, replyText: string): void {
  const text = (replyText || '').trim();
  if (!text) return;

  this.reviewService.replyToReview(reviewId, { replyText: text }).subscribe({
    next: (updated: any) => {
      const index = this.reviews.findIndex(r => r._id === reviewId);
      if (index !== -1) this.reviews[index] = updated as Review;

      this.replyForm[reviewId] = '';
    },
    error: (error) => {
      this.errorHandler.handleError(error);
    }
  });
}

}
