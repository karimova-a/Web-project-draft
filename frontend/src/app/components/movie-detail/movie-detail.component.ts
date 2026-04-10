import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Movie } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, SlicePipe],
  template: `
    @if (movie) {
      <div class="detail-page">
        <div class="detail-header">
          <div class="poster-col">
            <img [src]="movie.poster_url" [alt]="movie.title" class="poster"
                 (error)="onImgError($event)" />
          </div>
          <div class="info-col">
            <h1 class="title">{{ movie.title }}</h1>
            <div class="meta">
              <span class="rating">⭐ {{ movie.rating_imdb }}</span>
              @if (movie.genre_name) { <span class="genre">{{ movie.genre_name }}</span> }
              @if (movie.release_date) { <span class="year">{{ movie.release_date | slice:0:4 }}</span> }
            </div>
            <p class="description">{{ movie.description }}</p>

            @if (auth.isLoggedIn()) {
              <div class="actions">
                <button class="btn-primary" (click)="addToWatchlist('planned')">📋 Add to Planned</button>
                <button class="btn-secondary" (click)="addToWatchlist('watching')">▶️ Watching</button>
                <button class="btn-secondary" (click)="addToWatchlist('completed')">✅ Completed</button>
              </div>

              <div class="review-form">
                <h3>Leave a Review</h3>
                <div class="star-rating">
                  @for (s of [1,2,3,4,5]; track s) {
                    <button class="star" [class.filled]="userRating >= s" (click)="userRating = s">★</button>
                  }
                </div>
                <textarea [(ngModel)]="userReview" placeholder="Write your review..." class="input-area"></textarea>
                <button class="btn-primary" (click)="submitReview()">Submit Review</button>
              </div>
            }

            @if (message) { <div class="msg">{{ message }}</div> }
          </div>
        </div>

        @if (movie.reviews && movie.reviews.length > 0) {
          <div class="reviews-section">
            <h2>Reviews</h2>
            @for (r of movie.reviews; track r.id) {
              <div class="review-card">
                <div class="review-header">
                  <span class="reviewer">{{ r.username }}</span>
                  <span class="review-rating">
                    @for (s of [1,2,3,4,5]; track s) {
                      <span [class.filled]="r.user_rating >= s">★</span>
                    }
                  </span>
                </div>
                <p class="review-text">{{ r.review }}</p>
              </div>
            }
          </div>
        }
      </div>
    } @else {
      <div class="loading">Loading...</div>
    }
  `,
  styles: [`
    .detail-page { max-width: 1000px; margin: 0 auto; padding: 2rem; }
    .detail-header { display: flex; gap: 2rem; flex-wrap: wrap; }
    .poster-col { flex: 0 0 300px; }
    .poster { width: 100%; border-radius: 16px; }
    .info-col { flex: 1; min-width: 280px; }
    .title { font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 0.8rem; }
    .meta { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; }
    .rating { color: #ffd200; font-weight: 700; font-size: 1.1rem; }
    .genre {
      background: rgba(255,210,0,0.15); color: #ffd200;
      padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;
    }
    .year { color: rgba(255,255,255,0.5); }
    .description { color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 1.5rem; }
    .actions { display: flex; gap: 0.8rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .btn-primary, .btn-secondary {
      border: none; padding: 0.7rem 1.2rem; border-radius: 10px;
      font-weight: 600; cursor: pointer; font-size: 0.9rem; transition: opacity 0.2s;
    }
    .btn-primary {
      background: linear-gradient(135deg, #f7971e, #ffd200); color: #0f0c29;
    }
    .btn-secondary {
      background: rgba(255,255,255,0.08); color: #fff;
      border: 1px solid rgba(255,255,255,0.15);
    }
    .btn-secondary:hover { border-color: #ffd200; }
    .review-form {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px; padding: 1.5rem; margin-top: 1rem;
    }
    .review-form h3 { color: #fff; margin-bottom: 1rem; }
    .star-rating { margin-bottom: 1rem; }
    .star {
      background: none; border: none; font-size: 1.8rem;
      color: rgba(255,255,255,0.2); cursor: pointer; transition: color 0.2s;
    }
    .star.filled { color: #ffd200; }
    .input-area {
      width: 100%; min-height: 80px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 10px;
      padding: 0.8rem; font-size: 0.95rem; resize: vertical; margin-bottom: 1rem;
      outline: none;
    }
    .input-area:focus { border-color: #ffd200; }
    .msg { color: #4caf50; margin-top: 1rem; text-align: center; }
    .reviews-section { margin-top: 3rem; }
    .reviews-section h2 { color: #fff; margin-bottom: 1rem; }
    .review-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px; padding: 1rem; margin-bottom: 0.8rem;
    }
    .review-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .reviewer { color: #ffd200; font-weight: 600; }
    .review-rating .filled { color: #ffd200; }
    .review-text { color: rgba(255,255,255,0.7); }
    .loading { text-align: center; color: #ffd200; padding: 4rem; }
  `]
})
export class MovieDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);

  movie: Movie | null = null;
  userRating = 0;
  userReview = '';
  message = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getMovie(id).subscribe(m => this.movie = m);
  }

  addToWatchlist(status: string) {
    if (!this.movie) return;
    this.api.addToWatchlist(this.movie.id, status).subscribe({
      next: () => this.message = `Added to ${status}!`,
      error: (e) => this.message = e.error?.movie ? 'Already in your watchlist' : 'Error adding'
    });
  }

  submitReview() {
    if (!this.movie || !this.userRating) return;
    this.api.addToWatchlist(this.movie.id, 'completed').subscribe({
      next: (item) => {
        this.api.updateWatchlistItem(item.id, {
          user_rating: this.userRating, review: this.userReview, status: 'completed'
        } as any).subscribe({
          next: () => { this.message = 'Review submitted!'; this.userReview = ''; this.userRating = 0; },
          error: () => this.message = 'Error submitting review'
        });
      },
      error: () => this.message = 'Error - movie may already be in your list'
    });
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Poster';
  }
}
