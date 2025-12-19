import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Review,
  ReviewCreateRequest,
  ReviewReplyRequest,
  ReviewsResponse
} from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly API_BASE = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getReviews(movieId: string, page: number = 1, limit: number = 10, sortBy?: string): Observable<ReviewsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    return this.http.get<ReviewsResponse>(`${this.API_BASE}/reviews/${movieId}`, { params });
  }

  createReview(request: ReviewCreateRequest): Observable<Review> {
    return this.http.post<Review>(`${this.API_BASE}/reviews`, request);
  }

  likeReview(reviewId: string): Observable<Review> {
    return this.http.post<Review>(`${this.API_BASE}/reviews/${reviewId}/like`, {});
  }

  replyToReview(reviewId: string, request: ReviewReplyRequest): Observable<Review> {
    return this.http.post<Review>(`${this.API_BASE}/reviews/${reviewId}/reply`, request);
  }
}

