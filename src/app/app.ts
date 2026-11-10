import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';

import { AppAuthService } from './services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly authService = inject(AppAuthService);
  private readonly auth = inject(Auth);

  readonly isLoggedIn$ = authState(this.auth).pipe(map((user) => !!user));

  async logout() {
    await this.authService.userLogout();
    await this.router.navigate(['/login']);
  }
}
