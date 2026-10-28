import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { SignInModalComponent } from '../sign-in-modal/sign-in-modal.component';
import { SignUpModalComponent } from '../sign-up-modal/sign-up-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { StorageService, StoredUser } from '../../services/storage.service';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.scss',
})
export class UserPanelComponent {
  user$: Observable<StoredUser | null>;

  constructor(
    private dialog: MatDialog,
    private storageService: StorageService
  ) {
    this.user$ = this.storageService.getUserObservable();
  }

  signOut(): void {
    this.storageService.clearSession();
  }

  openSignInModal(): void {
    this.dialog.open(SignInModalComponent, {
      width: '400px',
    });
  }

  openSignUpModal(): void {
    this.dialog.open(SignUpModalComponent, {
      width: '400px',
    });
  }
}
