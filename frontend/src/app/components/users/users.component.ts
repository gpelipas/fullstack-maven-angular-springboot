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
  templateUrl: './users.component.html',  
  styleUrls: ['./users.component.css'],
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
