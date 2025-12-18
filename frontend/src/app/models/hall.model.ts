export interface Hall {
  _id: string;
  name: string;
  rows: number;
  columns: number;
  totalSeats?: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface HallCreateRequest {
  name: string;
  rows: number;
  columns: number;
}

export interface HallUpdateRequest {
  name?: string;
  rows?: number;
  columns?: number;
}

