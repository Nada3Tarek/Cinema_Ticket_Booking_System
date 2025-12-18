import { Movie } from './movie.model';
import { Hall } from './hall.model';

export interface Show {
  _id: string;
  movieId: string | Movie;
  hallId: string | Hall;
  startTime: string | Date;
  endTime: string | Date;
  bookedSeats: string[];
  price: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ShowWithDetails extends Show {
  movieId: Movie;
  hallId: Hall;
}

export interface ShowCreateRequest {
  movieId: string;
  hallId: string;
  startTime: string | Date;
  endTime: string | Date;
  price: number;
}

export interface ShowUpdateRequest {
  movieId?: string;
  hallId?: string;
  startTime?: string | Date;
  endTime?: string | Date;
  price?: number;
}

