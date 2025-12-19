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
  displayedColumns: string[] = ['movie', 'hall', 'startTime', 'endTime', 'price', 'isActive', 'actions'];

  createForm: FormGroup;
  editForm: FormGroup;
  editingShow: Show | null = null;
  showCreateForm = false;

  hours = Array.from({ length: 12 }, (_, i) => i + 1);
  minutes = Array.from({ length: 60 }, (_, i) => i);
  amPm = ['AM', 'PM'];

  constructor(
    private adminService: AdminService,
    private browseService: BrowseService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService
  ) {
    // CREATE FORM with split time inputs
    this.createForm = this.fb.group({
      movieId: ['', Validators.required],
      hallName: ['', Validators.required],

      startDate: ['', Validators.required],
      startHour: ['', Validators.required],
      startMinute: ['', Validators.required],
      startAmPm: ['AM', Validators.required],

      endDate: ['', Validators.required],
      endHour: ['', Validators.required],
      endMinute: ['', Validators.required],
      endAmPm: ['AM', Validators.required],

      price: [0, [Validators.required, Validators.min(0)]]
    });

    // EDIT FORM (will keep it as datetime-local for simplicity, can be updated similarly later)
this.editForm = this.fb.group({
  movieId: ['', Validators.required],
  hallName: ['', Validators.required],

  startDate: [null, Validators.required],
  startHour: [null, Validators.required],
  startMinute: [null, Validators.required],
  startAmPm: ['AM', Validators.required],

  endDate: [null, Validators.required],
  endHour: [null, Validators.required],
  endMinute: [null, Validators.required],
  endAmPm: ['AM', Validators.required],

  price: [0, [Validators.required, Validators.min(0)]]
});

  }

  ngOnInit(): void {
    this.loadShows();
    this.loadMovies();
    this.loadHalls();
  }

  // ================= LOAD DATA =================
  loadShows(): void {
    this.browseService.browseMoviesWithShowtimes({ limit: 100 }).subscribe({
      next: (res: any) => {
        this.shows = [];
        res.data.forEach((movie: any) => {
          if (movie.shows) this.shows.push(...movie.shows);
        });
      },
      error: err => this.errorHandler.handleError(err)
    });
  }

  loadMovies(): void {
    this.browseService.browseMovies({ limit: 100 }).subscribe({
      next: res => this.movies = res.data,
      error: err => this.errorHandler.handleError(err)
    });
  }

  loadHalls(): void {

    this.adminService.getHalls().subscribe({
      next: (res: any) => {
        // backend may return { data: Hall[] } OR { halls: Hall[] } OR plain array
        this.halls = (res?.data || res?.halls || res || []) as Hall[];
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      },
      complete: () => {
    }
    });
  }
  // ================= CREATE SHOW =================
  openCreateForm(): void {
    this.showCreateForm = true;
    this.createForm.reset({ startAmPm: 'AM', endAmPm: 'AM' });
  }

  createShow(): void {
    if (this.createForm.invalid) return;

    const startTime = this.buildDateTime(
      this.createForm.value.startDate,
      this.createForm.value.startHour,
      this.createForm.value.startMinute,
      this.createForm.value.startAmPm
    );

    const endTime = this.buildDateTime(
      this.createForm.value.endDate,
      this.createForm.value.endHour,
      this.createForm.value.endMinute,
      this.createForm.value.endAmPm
    );

    const data: ShowCreateRequest = {
      movieId: this.createForm.value.movieId,
      hallName: this.createForm.value.hallName,
      startTime,
      endTime,
      price: this.createForm.value.price
    };

    this.adminService.createShow(data).subscribe({
      next: res => {
        this.errorHandler.showSuccess(res.message);
        this.shows.unshift(res.show);
        this.showCreateForm = false;
      },
      error: err => this.errorHandler.handleError(err)
    });
  }

  private buildDateTime(date: string, hour: number, minute: number, amPm: string): Date {
    let h = Number(hour);
    if (amPm === 'PM' && h < 12) h += 12;
    if (amPm === 'AM' && h === 12) h = 0;

    const d = new Date(date);
    d.setHours(h, Number(minute), 0, 0);
    return d;
  }

  // ================= EDIT SHOW =================
openEditForm(show: Show): void {
  this.editingShow = show;

  const start = new Date(show.startTime);
  const end = new Date(show.endTime);

  // Convert hours to 12-hour format
  const startHour12 = start.getHours() % 12 || 12;
  const startAmPm = start.getHours() >= 12 ? 'PM' : 'AM';

  const endHour12 = end.getHours() % 12 || 12;
  const endAmPm = end.getHours() >= 12 ? 'PM' : 'AM';

  this.editForm.patchValue({
    movieId: typeof show.movieId === 'string' ? show.movieId : show.movieId._id,
    hallName: typeof show.hallId === 'object' && show.hallId ? show.hallId.name : '',

    startDate: start,         // must be a valid Date object
    startHour: startHour12,   // number
    startMinute: start.getMinutes(),
    startAmPm: startAmPm,     // 'AM' or 'PM'

    endDate: end,
    endHour: endHour12,
    endMinute: end.getMinutes(),
    endAmPm: endAmPm,

    price: show.price
  });
}


  updateShow(): void {
    if (!this.editingShow) return;

    const data: ShowUpdateRequest = {
      movieId: this.editForm.value.movieId,
      hallName: this.editForm.value.hallName,
      startTime: this.editForm.value.startTime ? new Date(this.editForm.value.startTime) : undefined,
      endTime: this.editForm.value.endTime ? new Date(this.editForm.value.endTime) : undefined,
      price: this.editForm.value.price
    };

    this.adminService.updateShow(this.editingShow._id, data).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Show updated successfully');
        this.editingShow = null;
        this.loadShows();
      },
      error: err => this.errorHandler.handleError(err)
    });
  }

  // ================= TOGGLE STATUS =================
  toggleShowStatus(show: Show): void {
    this.adminService.setShowStatus(show._id, !show.isActive).subscribe({
      next: () => this.loadShows(),
      error: err => this.errorHandler.handleError(err)
    });
  }

  // ================= DELETE SHOW =================
  deleteShow(show: Show): void {
    if (!confirm('Delete this show?')) return;

    this.adminService.deleteShow(show._id).subscribe({
      next: () => this.loadShows(),
      error: err => this.errorHandler.handleError(err)
    });
  }

  // ================= HELPERS =================
  getMovieTitle(show: Show): string {
    return typeof show.movieId === 'string' ? 'N/A' : show.movieId.title;
  }

  getHallName(show: Show): string {
    return typeof show.hallId === 'object' && show.hallId ? show.hallId.name : 'N/A';
  }
}
