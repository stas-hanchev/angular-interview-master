import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';
import { SignInService } from '../../services/sign-in.service';
import { UserLoginResponse } from '../../models/response.model';

@Component({
  selector: 'app-sign-in-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-in-modal.component.html',
  styleUrl: './sign-in-modal.component.scss'
})
export class SignInModalComponent {
  signInForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private signInService: SignInService,
    public dialogRef: MatDialogRef<SignInModalComponent, UserLoginResponse>
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signInForm.invalid || this.isSubmitting) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.signInForm.value;
    this.isSubmitting = true;
    this.signInService
      .login(email, password)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response) => this.dialogRef.close(response),
        error: () => {},
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }
}
