import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Movie,
  MovieCreateRequest,
  MovieUpdateRequest
} from '../models/movie.model';
import {
  Show,
  ShowCreateRequest,
  ShowUpdateRequest
} from '../models/show.model';
import {
  Hall,
  HallCreateRequest,
  HallUpdateRequest
} from '../models/hall.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_BASE = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Movie Management
  createMovie(data: MovieCreateRequest): Observable<{ message: string; movie: Movie }> {
    return this.http.post<{ message: string; movie: Movie }>(`${this.API_BASE}/movies`, data);
  }

  updateMovie(movieId: string, data: MovieUpdateRequest): Observable<{ message: string; movie: Movie }> {
    return this.http.patch<{ message: string; movie: Movie }>(`${this.API_BASE}/movies/${movieId}`, data);
  }

  deleteMovie(movieId: string): Observable<{ message: string; movie: Movie }> {
    return this.http.delete<{ message: string; movie: Movie }>(`${this.API_BASE}/movies/${movieId}`);
  }

  setMovieStatus(movieId: string, isActive: boolean): Observable<{ message: string; movie: Movie }> {
    return this.http.patch<{ message: string; movie: Movie }>(
      `${this.API_BASE}/movies/${movieId}/status`,
      { isActive }
    );
  }

createShow(data: ShowCreateRequest): Observable<{ message: string; show: Show }> {
  return this.http.post<{ message: string; show: Show }>(
    `${this.API_BASE}/shows`,
    data
  );
}

  getHalls() {
    return this.http.get<{ data: Hall[] }>(`${this.API_BASE}/halls`, { withCredentials: true });
  }
  

  updateShow(showId: string, data: ShowUpdateRequest): Observable<{ message: string; show: Show }> {
    return this.http.patch<{ message: string; show: Show }>(`${this.API_BASE}/shows/${showId}`, data);
  }

  deleteShow(showId: string): Observable<{ message: string; show: Show }> {
    return this.http.delete<{ message: string; show: Show }>(`${this.API_BASE}/shows/${showId}`);
  }

  setShowStatus(showId: string, isActive: boolean): Observable<{ message: string; show: Show }> {
    return this.http.patch<{ message: string; show: Show }>(
      `${this.API_BASE}/shows/${showId}/status`,
      { isActive }
    );
  }

  // Hall Management
  createHall(data: HallCreateRequest): Observable<{ success: boolean; message: string; hall: Hall }> {
    return this.http.post<{ success: boolean; message: string; hall: Hall }>(`${this.API_BASE}/halls`, data);
  }

  updateHall(hallId: string, data: HallUpdateRequest): Observable<{ success: boolean; message: string; hall: Hall }> {
    return this.http.patch<{ success: boolean; message: string; hall: Hall }>(`${this.API_BASE}/halls/${hallId}`, data);
  }

  deleteHall(hallId: string): Observable<{ success: boolean; message: string; hall: Hall }> {
    return this.http.delete<{ success: boolean; message: string; hall: Hall }>(`${this.API_BASE}/halls/${hallId}`);
  }
}

