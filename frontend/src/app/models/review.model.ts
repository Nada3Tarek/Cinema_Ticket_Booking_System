export interface Review {
  _id: string;
  movieId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string | Date;
  likeCount: number;
  replyCount: number;
  replies: ReviewReply[];
}

export interface ReviewReply {
  userId: string;
  text: string;
  createdAt: string | Date;
}

export interface ReviewCreateRequest {
  movieId: string;
  rating: number;
  comment?: string;
}

export interface ReviewReplyRequest {
  replyText: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

