import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Movie } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink, SlicePipe],
  template: `
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">You don't choose a movie —<br><span class="highlight">your mood chooses it.</span></h1>
        <p class="hero-sub">Select your mood and get instant movie recommendations</p>
      </div>
    </section>

    <section class="mood-section">
      <h2 class="section-title">How are you feeling?</h2>
      <div class="mood-grid">
        @for (m of moods; track m.key) {
          <button
            class="mood-card"
            [class.selected]="selectedMood === m.key"
            (click)="selectMood(m.key)">
            <span class="mood-emoji">{{ m.emoji }}</span>
            <span class="mood-label">{{ m.label }}</span>
          </button>
        }
      </div>

      @if (selectedMood && !isLoggedIn) {
        <div class="login-prompt">
          <p>Please <a routerLink="/login">log in</a> to get personalized recommendations!</p>
        </div>
      }

      @if (loading) {
        <div class="loading">Finding perfect movies for you...</div>
      }

      @if (recommendations.length > 0) {
        <h2 class="section-title">Recommended for your mood: <span class="highlight">{{ selectedMood }}</span></h2>
        <div class="movie-grid">
          @for (movie of recommendations; track movie.id) {
            <a [routerLink]="['/movies', movie.id]" class="movie-card">
              <div class="poster-wrap">
                <img [src]="movie.poster_url" [alt]="movie.title" class="poster"
                     (error)="onImgError($event)"/>
                <div class="poster-overlay">
                  <span class="rating">⭐ {{ movie.rating_imdb }}</span>
                  @if (movie.genre_name) {
                    <span class="genre-tag">{{ movie.genre_name }}</span>
                  }
                </div>
              </div>
              <h3 class="movie-title">{{ movie.title }}</h3>
              <p class="movie-year">{{ movie.release_date | slice:0:4 }}</p>
            </a>
          }
        </div>
      }

      @if (error) {
        <div class="error-msg">{{ error }}</div>
      }
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
      padding: 5rem 2rem 4rem; text-align: center;
      position: relative; overflow: hidden;
    }
    .hero::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(circle at 30% 50%, rgba(247,151,30,0.08) 0%, transparent 60%),
                  radial-gradient(circle at 70% 50%, rgba(255,210,0,0.06) 0%, transparent 60%);
    }
    .hero-content { position: relative; z-index: 1; }
    .hero-title {
      font-size: 3rem; font-weight: 800; color: #fff;
      line-height: 1.2; margin-bottom: 1rem; letter-spacing: -1px;
    }
    .highlight {
      background: linear-gradient(135deg, #f7971e, #ffd200);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-sub { color: rgba(255,255,255,0.6); font-size: 1.2rem; }

    .mood-section { padding: 3rem 2rem; max-width: 1200px; margin: 0 auto; }
    .section-title {
      font-size: 1.8rem; font-weight: 700; color: #fff;
      margin-bottom: 1.5rem; text-align: center;
    }
    .mood-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 1rem; margin-bottom: 2rem;
    }
    .mood-card {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px; padding: 1.5rem 1rem; cursor: pointer;
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
      transition: all 0.3s; color: #fff;
    }
    .mood-card:hover {
      background: rgba(255,255,255,0.08); border-color: rgba(255,210,0,0.3);
      transform: translateY(-4px);
    }
    .mood-card.selected {
      background: rgba(255,210,0,0.1); border-color: #ffd200;
      box-shadow: 0 0 20px rgba(255,210,0,0.15);
    }
    .mood-emoji { font-size: 2.5rem; }
    .mood-label { font-size: 0.9rem; font-weight: 600; opacity: 0.8; }

    .movie-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem; margin-top: 1.5rem;
    }
    .movie-card {
      text-decoration: none; color: #fff; transition: transform 0.3s;
    }
    .movie-card:hover { transform: translateY(-8px); }
    .poster-wrap {
      position: relative; border-radius: 12px; overflow: hidden;
      aspect-ratio: 2/3; background: rgba(255,255,255,0.05);
    }
    .poster { width: 100%; height: 100%; object-fit: cover; }
    .poster-overlay {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 0.8rem; display: flex; justify-content: space-between; align-items: center;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
    }
    .rating { font-size: 0.85rem; font-weight: 600; }
    .genre-tag {
      font-size: 0.7rem; background: rgba(255,210,0,0.2);
      color: #ffd200; padding: 0.2rem 0.5rem; border-radius: 8px;
    }
    .movie-title { font-size: 0.95rem; font-weight: 600; margin-top: 0.5rem; }
    .movie-year { font-size: 0.8rem; color: rgba(255,255,255,0.5); }

    .loading { text-align: center; color: #ffd200; padding: 2rem; font-size: 1.1rem; }
    .error-msg { text-align: center; color: #ff6b6b; padding: 1rem; }
    .login-prompt {
      text-align: center; padding: 1.5rem; color: rgba(255,255,255,0.7);
    }
    .login-prompt a { color: #ffd200; text-decoration: underline; }
  `]
})
export class HomeComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  moods = [
    { key: 'happy', emoji: '😊', label: 'Happy' },
    { key: 'sad', emoji: '😢', label: 'Sad' },
    { key: 'excited', emoji: '🤩', label: 'Excited' },
    { key: 'chill', emoji: '😌', label: 'Chill' },
    { key: 'romantic', emoji: '🥰', label: 'Romantic' },
    { key: 'energetic', emoji: '⚡', label: 'Energetic' },
    { key: 'mysterious', emoji: '🔮', label: 'Mysterious' },
    { key: 'calm', emoji: '🧘', label: 'Calm' },
  ];

  selectedMood = '';
  recommendations: Movie[] = [];
  loading = false;
  error = '';
  isLoggedIn = false;

  constructor() {
    this.isLoggedIn = this.auth.isLoggedIn();
  }

  selectMood(mood: string) {
    this.selectedMood = mood;
    if (!this.auth.isLoggedIn()) return;
    this.loading = true;
    this.error = '';
    this.recommendations = [];
    this.api.getMoodRecommendations(mood).subscribe({
      next: res => { this.recommendations = res.recommendations; this.loading = false; },
      error: () => { this.error = 'Failed to get recommendations. Please try again.'; this.loading = false; }
    });
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Poster';
  }
}
