import { Movie } from './movie.model';
import { Hall } from './hall.model';

export interface Show {
  _id: string;
  movieId: string | Movie;
  hallId?: Hall;       // hall object instead of id
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
  hallName: string;     // now send hallName instead of hallId
  startTime: string | Date;
  endTime: string | Date;
  price: number;
}

export interface ShowUpdateRequest {
  movieId?: string;
  hallName?: string;
  startTime?: string | Date;
  endTime?: string | Date;
  price?: number;
}
export interface BrowseShowsFilters {
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
  includeInactive?: boolean; // ← add this here
}
