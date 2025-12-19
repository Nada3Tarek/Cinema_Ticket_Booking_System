export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number;
  releaseDate: string | Date;
  posterUrl?: string;
  rating: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface MovieCreateRequest {
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number;
  releaseDate: string | Date;
  posterUrl?: string;
}

export interface MovieUpdateRequest {
  title?: string;
  description?: string;
  genre?: string[];
  language?: string;
  duration?: number;
  releaseDate?: string | Date;
  posterUrl?: string;
}

export interface BrowseResponse {
  success: boolean;
  data: Movie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

