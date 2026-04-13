import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Movie } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink, SlicePipe],
  template: `
    <div class="page">
      <section class="hero">
        <h1>You don't choose a movie <br><span class="highlight">your mood chooses it.</span></h1>
        <p>Select your mood and get instant movie recommendations</p>
      </section>

      <section class="mood-section">
        <h2>How are you feeling?</h2>
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
          <h2 class="rec-title">Recommended for your mood: <span class="highlight">{{ selectedMood }}</span></h2>
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
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: linear-gradient(160deg, #06060f 0%, #130a28 45%, #0a0a18 100%);
      color: #fff;
    }

    /* HERO */
    .hero {
      text-align: center;
      padding: 3rem 2rem 2rem;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 30% 70%, rgba(120, 50, 220, 0.15) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 30%, rgba(247, 151, 30, 0.08) 0%, transparent 60%);
      pointer-events: none;
    }

    .hero h1 {
      font-size: 4.8rem;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 0.75rem;
      position: relative;
    }

    .highlight {
      background: linear-gradient(135deg, #f7971e, #ffd200);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 1.23rem;
      position: relative;
    }

    .mood-section {
      padding: 2rem 3rem 3rem;
    }

    .mood-section h2 {
      text-align: center;
      font-size: 1.67rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.65);
      margin-bottom: 1.25rem;
    }


    .mood-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      width: 100%;
      max-width: 900px;
      margin: 0 auto 2rem;
    }

    .mood-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1.5px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      padding: 1.8rem 1rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.6rem;
      transition: all 0.25s;
      color: #fff;
    }

    .mood-card:hover {
      background: rgb(26, 26, 44);
      border-color: rgba(180, 100, 255, 0.45);
      transform: translateY(-4px);
    }

    .mood-card.selected {
      background: rgba(255, 210, 0, 0.1);
      border-color: #ffd200;
      box-shadow: 0 0 24px rgba(255, 210, 0, 0.15);
    }

    .mood-emoji {
      font-size: 2.8rem;
    }

    .mood-label {
      font-size: 1rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.75);
    }

    .mood-card.selected .mood-label {
      color: #ffd200;
    }


    .rec-title {
      text-align: center;
      font-size: 1.2rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 1.5rem;
    }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);

      gap: 1.5rem;
    }

    .movie-card {
      text-decoration: none;
      color: #fff;
      transition: transform 0.3s;
    }

    .movie-card:hover {
      transform: translateY(-8px);
    }

    .poster-wrap {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 2/3;
      background: rgba(255, 255, 255, 0.05);
    }

    .poster {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .poster-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.7rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.82));
    }

    .rating {
      font-size: 0.82rem;
      font-weight: 600;
    }

    .genre-tag {
      font-size: 0.68rem;
      background: rgba(255, 210, 0, 0.18);
      color: #ffd200;
      padding: 0.15rem 0.45rem;
      border-radius: 8px;
    }

    .movie-title {
      font-size: 0.9rem;
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .movie-year {
      font-size: 0.78rem;
      color: rgba(255, 255, 255, 0.45);
    }

    .loading {
      text-align: center;
      color: #ffd200;
      padding: 2rem;
    }

    .error-msg {
      text-align: center;
      color: #ff6b6b;
      padding: 1rem;
    }

    .login-prompt {
      text-align: center;
      padding: 1.2rem;
      color: rgba(255, 255, 255, 0.65);
    }

    .login-prompt a {
      color: #ffd200;
      text-decoration: underline;
    }
  `]
})
export class HomeComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  moods = [
    { key: 'happy',      emoji: '😊', label: 'Happy' },
    { key: 'sad',        emoji: '😢', label: 'Sad' },
    { key: 'excited',    emoji: '🤩', label: 'Excited' },
    { key: 'chill',      emoji: '😌', label: 'Chill' },
    { key: 'romantic',   emoji: '🥰', label: 'Romantic' },
    { key: 'energetic',  emoji: '⚡', label: 'Energetic' },
    { key: 'mysterious', emoji: '🔮', label: 'Mysterious' },
    { key: 'calm',       emoji: '🧘', label: 'Calm' },
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