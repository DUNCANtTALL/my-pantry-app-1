import { Component, inject } from '@angular/core';
import { AppAuthService } from '../services';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  private readonly authService = inject(AppAuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  async handleSignIn() {
    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Veuillez renseigner votre email et mot de passe.';
      return;
    }

    this.loading = true;
    try {
      await this.authService.userSignIn(this.username.trim(), this.password);
      await this.router.navigate(['/stock']);
    } catch (error) {
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Inscription impossible. Essayez un autre email.';
    } finally {
      this.loading = false;
    }
  }

}
