import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BrowseService } from '../../services/browse.service';
import { Movie } from '../../models/movie.model';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  loading = false;
  pagination: any = null;
  filters = {
    search: '',
    genre: '',
    language: '',
    sortBy: 'releaseDate',
    sortOrder: 'desc' as 'asc' | 'desc',
    page: 1,
    limit: 12
  };

  constructor(
    private browseService: BrowseService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.browseService.browseMovies(this.filters).subscribe({
      next: (response) => {
        this.movies = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });
  }

  onSearch(): void {
    this.filters.page = 1;
    this.loadMovies();
  }

  onPageChange(event: PageEvent): void {
    this.filters.page = event.pageIndex + 1;
    this.filters.limit = event.pageSize;
    this.loadMovies();
  }

  onSortChange(): void {
    this.filters.page = 1;
    this.loadMovies();
  }
}

