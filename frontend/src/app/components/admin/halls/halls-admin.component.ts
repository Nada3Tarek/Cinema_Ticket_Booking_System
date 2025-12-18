import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Hall, HallCreateRequest, HallUpdateRequest } from '../../../models/hall.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-halls-admin',
  templateUrl: './halls-admin.component.html',
  styleUrls: ['./halls-admin.component.scss']
})
export class HallsAdminComponent implements OnInit {
  halls: Hall[] = [];
  loading = false;

  displayedColumns: string[] = ['name', 'rows', 'columns', 'totalSeats', 'isActive', 'actions'];

  createForm: FormGroup;
  editForm: FormGroup;

  editingHall: Hall | null = null;
  showCreateForm = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      rows: [1, [Validators.required, Validators.min(1)]],
      columns: [1, [Validators.required, Validators.min(1)]]
    });

    // PATCH partial updates allowed
    this.editForm = this.fb.group({
      name: [''],
      rows: [null, [Validators.min(1)]],
      columns: [null, [Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadHalls();
  }

  // ✅ NEW: Load halls from GET /api/halls
  loadHalls(): void {
    this.loading = true;

    this.adminService.getHalls().subscribe({
      next: (res: any) => {
        // backend may return { data: Hall[] } OR { halls: Hall[] } OR plain array
        this.halls = (res?.data || res?.halls || res || []) as Hall[];
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.createForm.reset({ name: '', rows: 1, columns: 1 });
  }

  createHall(): void {
    if (this.createForm.invalid) return;

    const data: HallCreateRequest = this.createForm.value;

    this.adminService.createHall(data).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Hall created successfully');
        this.showCreateForm = false;
        this.loadHalls(); // ✅ reload
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  openEditForm(hall: Hall): void {
    this.editingHall = hall;
    this.editForm.reset({
      name: hall.name ?? '',
      rows: hall.rows ?? null,
      columns: hall.columns ?? null
    });
  }

  updateHall(): void {
    if (!this.editingHall || this.editForm.invalid) return;

    // ✅ send only changed fields (PATCH)
    const raw = this.editForm.value as Partial<HallUpdateRequest>;
    const payload: HallUpdateRequest = {};

    if (raw.name && raw.name.trim()) payload.name = raw.name.trim();
    if (raw.rows != null) payload.rows = Number(raw.rows);
    if (raw.columns != null) payload.columns = Number(raw.columns);

    // Prevent empty PATCH
    if (Object.keys(payload).length === 0) {
      this.errorHandler.handleError({ message: 'No changes to update' });
      return;
    }

    this.adminService.updateHall(this.editingHall._id, payload).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Hall updated successfully');
        this.editingHall = null;
        this.loadHalls(); // ✅ reload
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  deleteHall(hall: Hall): void {
    if (!hall?._id) return;

    if (confirm(`Are you sure you want to delete "${hall.name}"?`)) {
      this.adminService.deleteHall(hall._id).subscribe({
        next: () => {
          this.errorHandler.showSuccess('Hall deleted successfully');
          this.loadHalls(); // ✅ reload
        },
        error: (error) => {
          this.errorHandler.handleError(error);
        }
      });
    }
  }

  calculateTotalSeats(rows: number, columns: number): number {
    return Number(rows) * Number(columns);
  }

  // Optional helper لو عايزة تعرضي total seats في الفورم live
  get createTotalSeats(): number {
    const rows = Number(this.createForm.get('rows')?.value || 0);
    const cols = Number(this.createForm.get('columns')?.value || 0);
    return this.calculateTotalSeats(rows, cols);
  }
}
