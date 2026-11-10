import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppAuthService } from '../services';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private readonly authService = inject(AppAuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  async handleLogIn() {
    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Veuillez renseigner votre email et mot de passe.';
      return;
    }

    this.loading = true;
    try {
      await this.authService.userLogin(this.username.trim(), this.password);
      await this.router.navigate(['/stock']);
    } catch (error) {
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Connexion impossible. Verifiez vos identifiants.';
    } finally {
      this.loading = false;
    }
  }
}
