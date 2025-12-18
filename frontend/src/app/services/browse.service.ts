import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrowseResponse, Movie } from '../models/movie.model';
import { Show } from '../models/show.model';

@Injectable({
  providedIn: 'root'
})
export class BrowseService {
  private readonly API_BASE = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  browseMovies(filters?: {
    search?: string;
    genre?: string | string[];
    language?: string;
    date?: string;
    rating?: number;
    showtime?: string;
    hall?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Observable<BrowseResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params = params.append(key, v));
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<BrowseResponse>(`${this.API_BASE}/browse`, { params });
  }

  browseMoviesWithShowtimes(filters?: {
    search?: string;
    genre?: string | string[];
    language?: string;
    date?: string;
    rating?: number;
    showtime?: string;
    hall?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Observable<BrowseResponse & { data: Array<Movie & { shows: Show[] }> }> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params = params.append(key, v));
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<BrowseResponse & { data: Array<Movie & { shows: Show[] }> }>(
      `${this.API_BASE}/browse/showtimes`,
      { params }
    );
  }

  getUpcomingMovies(limit: number = 10): Observable<BrowseResponse> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<BrowseResponse>(`${this.API_BASE}/browse/upcoming`, { params });
  }

  getCurrentlyRunningMovies(limit: number = 10): Observable<BrowseResponse> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<BrowseResponse>(`${this.API_BASE}/browse/running`, { params });
  }
}

