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
      rows: [0, [Validators.required, Validators.min(1)]],
      columns: [0, [Validators.required, Validators.min(1)]]
    });

    this.editForm = this.fb.group({
      name: [''],
      rows: [0],
      columns: [0]
    });
  }

  ngOnInit(): void {
    // Note: There's no endpoint to list halls, so we'll need to get them from shows
    // For now, we'll leave this empty
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.createForm.reset();
  }

  createHall(): void {
    if (this.createForm.invalid) return;

    const data: HallCreateRequest = this.createForm.value;
    this.adminService.createHall(data).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Hall created successfully');
        this.showCreateForm = false;
        // Reload halls if we had a list endpoint
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  openEditForm(hall: Hall): void {
    this.editingHall = hall;
    this.editForm.patchValue({
      name: hall.name,
      rows: hall.rows,
      columns: hall.columns
    });
  }

  updateHall(): void {
    if (!this.editingHall || this.editForm.invalid) return;

    const data: HallUpdateRequest = this.editForm.value;
    this.adminService.updateHall(this.editingHall._id, data).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Hall updated successfully');
        this.editingHall = null;
        // Reload halls if we had a list endpoint
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  deleteHall(hall: Hall): void {
    if (confirm(`Are you sure you want to delete "${hall.name}"?`)) {
      this.adminService.deleteHall(hall._id).subscribe({
        next: () => {
          this.errorHandler.showSuccess('Hall deleted successfully');
          // Reload halls if we had a list endpoint
        },
        error: (error) => {
          this.errorHandler.handleError(error);
        }
      });
    }
  }

  calculateTotalSeats(rows: number, columns: number): number {
    return rows * columns;
  }
}

