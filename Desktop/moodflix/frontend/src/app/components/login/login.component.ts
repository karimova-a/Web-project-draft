import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-sub">Log in to your MoodFlix account</p>

        <div class="form-group">
          <label>Username</label>
          <input type="text" [(ngModel)]="username" placeholder="Enter username" class="input" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" placeholder="Enter password" class="input" />
        </div>

        @if (error) { <p class="error">{{ error }}</p> }

        <button class="btn-primary" (click)="onLogin()" [disabled]="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <p class="switch-link">Don't have an account? <a routerLink="/register">Register</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex; align-items: center; justify-content: center;
      min-height: calc(100vh - 70px); padding: 2rem;
    }
    .auth-card {
      width: 100%; max-width: 400px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px; padding: 2.5rem;
    }
    .auth-title { color: #fff; font-size: 1.8rem; font-weight: 800; text-align: center; }
    .auth-sub { color: rgba(255,255,255,0.5); text-align: center; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; color: rgba(255,255,255,0.7); margin-bottom: 0.4rem; font-size: 0.9rem; }
    .input {
      width: 100%; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1); color: #fff;
      padding: 0.8rem 1rem; border-radius: 10px; font-size: 0.95rem;
      outline: none; box-sizing: border-box;
    }
    .input:focus { border-color: #ffd200; }
    .error { color: #ff6b6b; text-align: center; margin-bottom: 1rem; font-size: 0.9rem; }
    .btn-primary {
      width: 100%; background: linear-gradient(135deg, #f7971e, #ffd200);
      border: none; color: #0f0c29; padding: 0.9rem; border-radius: 10px;
      font-weight: 700; cursor: pointer; font-size: 1rem; margin-top: 0.5rem;
    }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .switch-link {
      text-align: center; color: rgba(255,255,255,0.5);
      margin-top: 1.5rem; font-size: 0.9rem;
    }
    .switch-link a { color: #ffd200; text-decoration: none; }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  error = '';
  loading = false;

  onLogin() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: () => { this.router.navigate(['/']); },
      error: () => { this.error = 'Invalid username or password'; this.loading = false; }
    });
  }
}
