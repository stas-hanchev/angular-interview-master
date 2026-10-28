import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { SignUpService } from '../../services/sign-up.service';
import { UserRegisterResponse } from '../../models/response.model';

@Component({
  selector: 'app-sign-up-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule],
  templateUrl: './sign-up-modal.component.html',
  styleUrl: './sign-up-modal.component.scss',
})
export class SignUpModalComponent {
  signUpForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private signUpService: SignUpService,
    public dialogRef: MatDialogRef<SignUpModalComponent, UserRegisterResponse>
  ) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signUpForm.invalid || this.isSubmitting) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { email, password, firstName, lastName } = this.signUpForm.value;
    this.isSubmitting = true;
    this.signUpService
      .register(email, password, firstName, lastName)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response) => this.dialogRef.close(response),
        error: () => {},
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get firstName() {
    return this.signUpForm.get('firstName');
  }

  get lastName() {
    return this.signUpForm.get('lastName');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }
}
