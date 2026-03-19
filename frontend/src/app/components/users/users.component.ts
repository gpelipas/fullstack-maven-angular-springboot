import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

type ViewState = 'list' | 'create' | 'edit';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1>Users</h1>
        <p class="subtitle">Manage users via the Spring Boot REST API</p>
      </div>
      <button class="btn btn-primary" (click)="showCreate()" *ngIf="view === 'list'">
        + New User
      </button>
    </div>

    <!-- Alert -->
    <div *ngIf="alert" class="alert" [class]="'alert-' + alert.type">
      {{ alert.message }}
      <button class="alert-close" (click)="alert = null">×</button>
    </div>

    <!-- List View -->
    <div *ngIf="view === 'list'">
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div> Loading users...
      </div>

      <div *ngIf="!loading && users.length === 0" class="empty">
        <div class="empty-icon">👤</div>
        <p>No users yet. Create the first one!</p>
      </div>

      <div *ngIf="!loading && users.length > 0" class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td class="id-col">#{{ user.id }}</td>
              <td><strong>{{ user.name }}</strong></td>
              <td class="muted">{{ user.email }}</td>
              <td>
                <span class="badge" [class]="'badge-' + (user.role?.toLowerCase() || 'user')">
                  {{ user.role || 'USER' }}
                </span>
              </td>
              <td class="muted">{{ user.createdAt | date:'mediumDate' }}</td>
              <td>
                <div class="row-actions">
                  <button class="btn-sm btn-edit" (click)="showEdit(user)">Edit</button>
                  <button class="btn-sm btn-delete" (click)="confirmDelete(user)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Form -->
    <div *ngIf="view === 'create' || view === 'edit'" class="form-card">
      <h2>{{ view === 'create' ? 'Create User' : 'Edit User' }}</h2>

      <form [formGroup]="form" (ngSubmit)="submitForm()">
        <div class="form-row">
          <div class="form-group">
            <label>Full Name</label>
            <input formControlName="name" placeholder="Jane Doe" />
            <div class="field-error" *ngIf="f['name'].touched && f['name'].errors?.['required']">
              Name is required
            </div>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input formControlName="email" type="email" placeholder="jane@example.com" />
            <div class="field-error" *ngIf="f['email'].touched && f['email'].errors?.['required']">
              Email is required
            </div>
            <div class="field-error" *ngIf="f['email'].touched && f['email'].errors?.['email']">
              Must be a valid email
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Role</label>
          <select formControlName="role">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="cancelForm()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">
            {{ saving ? 'Saving…' : (view === 'create' ? 'Create User' : 'Save Changes') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Delete Confirm Modal -->
    <div *ngIf="deleteTarget" class="modal-overlay" (click)="deleteTarget = null">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>Delete User?</h3>
        <p>Are you sure you want to delete <strong>{{ deleteTarget.name }}</strong>? This cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn btn-outline" (click)="deleteTarget = null">Cancel</button>
          <button class="btn btn-danger" (click)="deleteUser()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 28px;
      gap: 16px;
    }
    h1 { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.01em; }
    .subtitle { color: var(--text-muted); font-size: 0.92rem; margin-top: 4px; }

    .btn {
      display: inline-flex;
      align-items: center;
      padding: 9px 20px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 0.92rem;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-primary {
      background: var(--primary); color: #fff; border-color: var(--primary);
      &:hover:not(:disabled) { background: var(--primary-hover); border-color: var(--primary-hover); }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }
    .btn-outline {
      background: var(--surface); color: var(--text); border-color: var(--border);
      &:hover { border-color: var(--primary); color: var(--primary); }
    }
    .btn-danger {
      background: var(--danger); color: #fff; border-color: var(--danger);
      &:hover { background: var(--danger-hover); }
    }

    .alert {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      border-radius: var(--radius-sm);
      margin-bottom: 20px;
      font-size: 0.92rem;
      font-weight: 500;
    }
    .alert-success { background: #dcfce7; color: #15803d; }
    .alert-error   { background: #fee2e2; color: #b91c1c; }
    .alert-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0; color: inherit; opacity: 0.7; }

    .loading {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-muted);
      padding: 40px 0;
    }
    .spinner {
      width: 20px; height: 20px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty {
      text-align: center;
      padding: 60px 0;
      color: var(--text-muted);
    }
    .empty-icon { font-size: 2.5rem; margin-bottom: 12px; }

    .table-wrap {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
    tr:last-child td { border-bottom: none; }
    th { background: var(--bg); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
    tr:hover td { background: #fafbff; }
    .id-col { color: var(--text-muted); font-size: 0.85rem; }
    .muted { color: var(--text-muted); }

    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .badge-admin   { background: #ede9fe; color: #6d28d9; }
    .badge-manager { background: #fef3c7; color: #b45309; }
    .badge-user    { background: #dbeafe; color: #1d4ed8; }

    .row-actions { display: flex; gap: 8px; }
    .btn-sm {
      padding: 4px 12px;
      border-radius: 5px;
      font-size: 0.82rem;
      font-weight: 600;
      border: 1px solid;
      cursor: pointer;
      transition: all 0.12s;
    }
    .btn-edit   { border-color: var(--border); background: var(--surface); color: var(--text); &:hover { border-color: var(--primary); color: var(--primary); } }
    .btn-delete { border-color: #fecaca; background: #fff5f5; color: var(--danger); &:hover { background: #fee2e2; } }

    .form-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 36px;
      max-width: 640px;
      box-shadow: var(--shadow-sm);
    }
    .form-card h2 { font-size: 1.3rem; font-weight: 700; margin-bottom: 28px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
    label { font-weight: 600; font-size: 0.88rem; color: var(--text); }
    input, select {
      padding: 9px 12px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.92rem;
      background: var(--bg);
      transition: border-color 0.15s;
      &:focus { outline: none; border-color: var(--primary); background: #fff; }
    }
    .field-error { color: var(--danger); font-size: 0.82rem; }
    .form-actions { display: flex; gap: 12px; margin-top: 8px; }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    }
    .modal {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 36px;
      max-width: 420px;
      width: 90%;
      box-shadow: var(--shadow-md);
    }
    .modal h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 12px; }
    .modal p { color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 28px; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  saving = false;
  view: ViewState = 'list';
  form!: FormGroup;
  editingId?: number;
  deleteTarget: User | null = null;
  alert: { type: string; message: string } | null = null;

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.loadUsers();
  }

  get f() { return this.form.controls; }

  initForm(user?: User) {
    this.form = this.fb.group({
      name:  [user?.name  || '', [Validators.required]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      role:  [user?.role  || 'USER']
    });
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: () => { this.showAlert('error', 'Failed to load users.'); this.loading = false; }
    });
  }

  showCreate() {
    this.view = 'create';
    this.editingId = undefined;
    this.initForm();
  }

  showEdit(user: User) {
    this.view = 'edit';
    this.editingId = user.id;
    this.initForm(user);
  }

  cancelForm() {
    this.view = 'list';
  }

  submitForm() {
    if (this.form.invalid) return;
    this.saving = true;
    const payload: User = this.form.value;

    const req = this.view === 'create'
      ? this.userService.create(payload)
      : this.userService.update(this.editingId!, payload);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.view = 'list';
        this.loadUsers();
        this.showAlert('success', this.view === 'list'
          ? (this.editingId ? 'User updated.' : 'User created.')
          : 'Done.');
      },
      error: () => {
        this.saving = false;
        this.showAlert('error', 'Failed to save user. Check for duplicate email.');
      }
    });
  }

  confirmDelete(user: User) {
    this.deleteTarget = user;
  }

  deleteUser() {
    if (!this.deleteTarget?.id) return;
    this.userService.delete(this.deleteTarget.id).subscribe({
      next: () => {
        this.showAlert('success', `Deleted ${this.deleteTarget!.name}.`);
        this.deleteTarget = null;
        this.loadUsers();
      },
      error: () => {
        this.showAlert('error', 'Failed to delete user.');
        this.deleteTarget = null;
      }
    });
  }

  showAlert(type: string, message: string) {
    this.alert = { type, message };
    setTimeout(() => this.alert = null, 4000);
  }
}
