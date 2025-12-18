import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowseService } from '../../services/browse.service';
import { ReviewService } from '../../services/review.service';
import { BookingService } from '../../services/booking.service';
import { Movie } from '../../models/movie.model';
import { Show } from '../../models/show.model';
import { Review, ReviewCreateRequest } from '../../models/review.model';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../services/auth.service';

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

  // UI-only set to prevent duplicate likes during the session
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

  /**
   * ✅ FIX: Angular templates don't support "as any"
   * So we resolve hall name here in TS.
   */
  getHallName(show: Show): string {
    const hall: any = (show as any)?.hallId;

    if (!hall) return 'N/A';

    // If hallId is populated object
    if (typeof hall === 'object' && hall?.name) return hall.name;

    // If hallId is just an id string
    return 'N/A';
  }

  loadMovieDetails(movieId: string): void {
    this.loading = true;

    // Keep your existing API usage, just typed safely
    this.browseService.browseMoviesWithShowtimes({}).subscribe({
      next: (response: any) => {
        const foundMovie = response?.data?.find((m: any) => m?._id === movieId);

        if (!foundMovie) {
          this.errorHandler.handleError({ message: 'Movie not found' });
          this.router.navigate(['/']);
          return;
        }

        this.movie = foundMovie as Movie;

        // shows may live on movie (as you already assumed)
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
        // keep compatible with your API shape: response.reviews
        this.reviews = (response?.reviews ?? []) as Review[];
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  selectShow(show: Show): void {
    // Booking flow starts from show id (seat layout later loaded from booking/show details screens)
    this.router.navigate(['/booking', (show as any)._id]);
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
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  likeReview(reviewId: string): void {
    // Optimistic UX: disable if already liked locally
    if (this.likedReviews.has(reviewId)) return;

    // optimistic update with rollback
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
        // rollback
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
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }
}
