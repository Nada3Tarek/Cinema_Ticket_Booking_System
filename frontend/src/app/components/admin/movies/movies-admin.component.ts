import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../../services/admin.service';
import { BrowseService } from '../../../services/browse.service';
import { Movie, MovieCreateRequest, MovieUpdateRequest } from '../../../models/movie.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-movies-admin',
  templateUrl: './movies-admin.component.html',
  styleUrls: ['./movies-admin.component.scss']
})
export class MoviesAdminComponent implements OnInit {
  movies: Movie[] = [];
  loading = false;
  displayedColumns: string[] = ['title', 'language', 'duration', 'rating', 'isActive', 'actions'];
  editForm: FormGroup;
  createForm: FormGroup;
  editingMovie: Movie | null = null;
  showCreateForm = false;

  constructor(
    private adminService: AdminService,
    private browseService: BrowseService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private errorHandler: ErrorHandlerService
  ) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      genre: ['', Validators.required],
      language: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      releaseDate: ['', Validators.required],
      posterUrl: ['']
    });

    this.editForm = this.fb.group({
      title: [''],
      description: [''],
      genre: [''],
      language: [''],
      duration: [0],
      releaseDate: [''],
      posterUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.browseService.browseMovies({ limit: 100 }).subscribe({
      next: (response) => {
        this.movies = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.createForm.reset();
  }

  createMovie(): void {
    if (this.createForm.invalid) return;

    const data: MovieCreateRequest = {
      ...this.createForm.value,
      genre: this.createForm.value.genre.split(',').map((g: string) => g.trim())
    };

    this.adminService.createMovie(data).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Movie created successfully');
        this.showCreateForm = false;
        this.loadMovies();
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  openEditForm(movie: Movie): void {
    this.editingMovie = movie;
    this.editForm.patchValue({
      title: movie.title,
      description: movie.description,
      genre: movie.genre.join(', '),
      language: movie.language,
      duration: movie.duration,
      releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0],
      posterUrl: movie.posterUrl || ''
    });
  }

  updateMovie(): void {
    if (!this.editingMovie || this.editForm.invalid) return;

    const data: MovieUpdateRequest = {
      ...this.editForm.value,
      genre: this.editForm.value.genre.split(',').map((g: string) => g.trim())
    };

    this.adminService.updateMovie(this.editingMovie._id, data).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Movie updated successfully');
        this.editingMovie = null;
        this.loadMovies();
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  toggleMovieStatus(movie: Movie): void {
    this.adminService.setMovieStatus(movie._id, !movie.isActive).subscribe({
      next: () => {
        this.errorHandler.showSuccess(`Movie ${movie.isActive ? 'deactivated' : 'activated'}`);
        this.loadMovies();
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  deleteMovie(movie: Movie): void {
    if (confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      this.adminService.deleteMovie(movie._id).subscribe({
        next: () => {
          this.errorHandler.showSuccess('Movie deleted successfully');
          this.loadMovies();
        },
        error: (error) => {
          this.errorHandler.handleError(error);
        }
      });
    }
  }
}

