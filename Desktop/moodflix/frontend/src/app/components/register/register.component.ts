import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth-title">Join MoodFlix</h1>
        <p class="auth-sub">Create your account and start discovering movies</p>

        <div class="form-group">
          <label>Username</label>
          <input type="text" [(ngModel)]="username" placeholder="Choose a username" class="input" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="your@email.com" class="input" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" placeholder="Min 6 characters" class="input" />
        </div>

        @if (error) { <p class="error">{{ error }}</p> }
        @if (success) { <p class="success">{{ success }}</p> }

        <button class="btn-primary" (click)="onRegister()" [disabled]="loading">
          {{ loading ? 'Creating...' : 'Register' }}
        </button>

        <p class="switch-link">Already have an account? <a routerLink="/login">Login</a></p>
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
    .success { color: #4caf50; text-align: center; margin-bottom: 1rem; font-size: 0.9rem; }
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
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  error = '';
  success = '';
  loading = false;

  onRegister() {
    this.error = '';
    this.success = '';
    if (this.password.length < 6) { this.error = 'Password must be at least 6 characters'; return; }
    this.loading = true;
    this.auth.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.success = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (e) => {
        this.error = e.error?.username?.[0] || e.error?.email?.[0] || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
