import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="logo">
        <span class="logo-icon">🎬</span>
        <span class="logo-text">MoodFlix</span>
      </a>
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <a routerLink="/movies" routerLinkActive="active">Movies</a>
        @if (auth.isLoggedIn$ | async) {
          <a routerLink="/watchlist" routerLinkActive="active">Watchlist</a>
          <a routerLink="/friends" routerLinkActive="active">Friends</a>
          <a routerLink="/mood-diary" routerLinkActive="active">Mood Diary</a>
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
          <button class="btn-logout" (click)="onLogout()">Logout</button>
        } @else {
          <a routerLink="/login" routerLinkActive="active" class="btn-login">Login</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 2rem; height: 70px;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      border-bottom: 1px solid rgba(255,255,255,0.05);
      position: sticky; top: 0; z-index: 100;
    }
    .logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
    .logo-icon { font-size: 1.8rem; }
    .logo-text {
      font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px;
      background: linear-gradient(135deg, #f7971e, #ffd200);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .nav-links { display: flex; align-items: center; gap: 1.5rem; }
    .nav-links a {
      color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.95rem;
      font-weight: 500; transition: color 0.2s;
    }
    .nav-links a:hover, .nav-links a.active { color: #ffd200; }
    .btn-login {
      background: linear-gradient(135deg, #f7971e, #ffd200) !important;
      -webkit-text-fill-color: #0f0c29 !important;
      padding: 0.4rem 1.2rem; border-radius: 20px; font-weight: 700 !important;
    }
    .btn-logout {
      background: none; border: 1px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.7); padding: 0.4rem 1rem;
      border-radius: 20px; cursor: pointer; font-size: 0.9rem;
      transition: all 0.2s;
    }
    .btn-logout:hover { border-color: #ffd200; color: #ffd200; }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
