import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { BrowseService } from '../../../services/browse.service';
import { Show, ShowCreateRequest, ShowUpdateRequest } from '../../../models/show.model';
import { Movie } from '../../../models/movie.model';
import { Hall } from '../../../models/hall.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-shows-admin',
  templateUrl: './shows-admin.component.html',
  styleUrls: ['./shows-admin.component.scss']
})
export class ShowsAdminComponent implements OnInit {
  shows: Show[] = [];
  movies: Movie[] = [];
  halls: Hall[] = [];
  loading = false;
  displayedColumns: string[] = ['movie', 'hall', 'startTime', 'endTime', 'price', 'isActive', 'actions'];
  createForm: FormGroup;
  editForm: FormGroup;
  editingShow: Show | null = null;
  showCreateForm = false;

  constructor(
    private adminService: AdminService,
    private browseService: BrowseService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService
  ) {
    this.createForm = this.fb.group({
      movieId: ['', Validators.required],
      hallId: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    this.editForm = this.fb.group({
      movieId: [''],
      hallId: [''],
      startTime: [''],
      endTime: [''],
      price: [0]
    });
  }

  ngOnInit(): void {
    this.loadShows();
    this.loadMovies();
    this.loadHalls();
  }

  loadShows(): void {
    // Load shows from browse service
    this.browseService.browseMoviesWithShowtimes({ limit: 100 }).subscribe({
      next: (response: any) => {
        this.shows = [];
        response.data.forEach((movie: any) => {
          if (movie.shows) {
            this.shows.push(...movie.shows);
          }
        });
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  loadMovies(): void {
    this.browseService.browseMovies({ limit: 100 }).subscribe({
      next: (response) => {
        this.movies = response.data;
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  loadHalls(): void {
    // Note: There's no endpoint to get halls, so we'll need to get them from shows
    // For now, we'll leave halls empty and admin can select from shows
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.createForm.reset();
  }

  createShow(): void {
    if (this.createForm.invalid) return;

    const data: ShowCreateRequest = {
      ...this.createForm.value,
      startTime: new Date(this.createForm.value.startTime),
      endTime: new Date(this.createForm.value.endTime)
    };

    this.adminService.createShow(data).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Show created successfully');
        this.showCreateForm = false;
        this.loadShows();
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  openEditForm(show: Show): void {
    this.editingShow = show;
    const movieId = typeof show.movieId === 'string' ? show.movieId : show.movieId._id;
    const hallId = typeof show.hallId === 'string' ? show.hallId : show.hallId._id;
    
    this.editForm.patchValue({
      movieId,
      hallId,
      startTime: new Date(show.startTime).toISOString().slice(0, 16),
      endTime: new Date(show.endTime).toISOString().slice(0, 16),
      price: show.price
    });
  }

  updateShow(): void {
    if (!this.editingShow || this.editForm.invalid) return;

    const data: ShowUpdateRequest = {
      ...this.editForm.value,
      startTime: this.editForm.value.startTime ? new Date(this.editForm.value.startTime) : undefined,
      endTime: this.editForm.value.endTime ? new Date(this.editForm.value.endTime) : undefined
    };

    this.adminService.updateShow(this.editingShow._id, data).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Show updated successfully');
        this.editingShow = null;
        this.loadShows();
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  toggleShowStatus(show: Show): void {
    this.adminService.setShowStatus(show._id, !show.isActive).subscribe({
      next: () => {
        this.errorHandler.showSuccess(`Show ${show.isActive ? 'deactivated' : 'activated'}`);
        this.loadShows();
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  deleteShow(show: Show): void {
    if (confirm(`Are you sure you want to delete this show?`)) {
      this.adminService.deleteShow(show._id).subscribe({
        next: () => {
          this.errorHandler.showSuccess('Show deleted successfully');
          this.loadShows();
        },
        error: (error) => {
          this.errorHandler.handleError(error);
        }
      });
    }
  }

  getMovieTitle(show: Show): string {
    const movie = show.movieId;
    if (typeof movie === 'string') return 'N/A';
    return movie.title || 'N/A';
  }

  getHallName(show: Show): string {
    const hall = show.hallId;
    if (typeof hall === 'string') return hall;
    return hall.name || 'N/A';
  }
}