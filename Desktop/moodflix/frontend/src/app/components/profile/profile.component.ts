import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, UserProfile } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (profile) {
      <div class="page">
        <div class="profile-card">
          <div class="avatar">{{ profile.username.charAt(0).toUpperCase() }}</div>
          <h1 class="username">{{ profile.username }}</h1>
          <p class="email">{{ profile.email }}</p>

          <div class="stats">
            <div class="stat">
              <span class="stat-num">{{ profile.watchlist_stats.planned }}</span>
              <span class="stat-label">Planned</span>
            </div>
            <div class="stat">
              <span class="stat-num">{{ profile.watchlist_stats.watching }}</span>
              <span class="stat-label">Watching</span>
            </div>
            <div class="stat">
              <span class="stat-num">{{ profile.watchlist_stats.completed }}</span>
              <span class="stat-label">Completed</span>
            </div>
          </div>

          <div class="edit-section">
            <h3>Preferred Genres</h3>
            <input type="text" [(ngModel)]="profile.preferred_genres"
                   placeholder="e.g. Comedy, Drama, Sci-Fi" class="input" />
            <button class="btn-primary" (click)="saveProfile()">Save Changes</button>
            @if (message) { <p class="msg">{{ message }}</p> }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page { max-width: 500px; margin: 0 auto; padding: 2rem; }
    .profile-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px; padding: 2.5rem; text-align: center;
    }
    .avatar {
      width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1rem;
      background: linear-gradient(135deg, #f7971e, #ffd200);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 800; color: #0f0c29;
    }
    .username { color: #fff; font-size: 1.5rem; font-weight: 700; }
    .email { color: rgba(255,255,255,0.5); margin-bottom: 1.5rem; }
    .stats { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; }
    .stat { text-align: center; }
    .stat-num { display: block; font-size: 1.5rem; font-weight: 800; color: #ffd200; }
    .stat-label { font-size: 0.8rem; color: rgba(255,255,255,0.5); }
    .edit-section { text-align: left; }
    .edit-section h3 { color: #fff; margin-bottom: 0.5rem; }
    .input {
      width: 100%; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1); color: #fff;
      padding: 0.7rem 1rem; border-radius: 10px; margin-bottom: 1rem;
      font-size: 0.95rem; outline: none; box-sizing: border-box;
    }
    .input:focus { border-color: #ffd200; }
    .btn-primary {
      width: 100%; background: linear-gradient(135deg, #f7971e, #ffd200);
      border: none; color: #0f0c29; padding: 0.8rem; border-radius: 10px;
      font-weight: 700; cursor: pointer; font-size: 1rem;
    }
    .msg { color: #4caf50; text-align: center; margin-top: 0.8rem; }
  `]
})
export class ProfileComponent implements OnInit {
  private api = inject(ApiService);
  profile: UserProfile | null = null;
  message = '';

  ngOnInit() {
    this.api.getProfile().subscribe(p => this.profile = p);
  }

  saveProfile() {
    if (!this.profile) return;
    this.api.updateProfile({ preferred_genres: this.profile.preferred_genres }).subscribe({
      next: () => this.message = 'Profile updated!',
      error: () => this.message = 'Error saving profile'
    });
  }
}
