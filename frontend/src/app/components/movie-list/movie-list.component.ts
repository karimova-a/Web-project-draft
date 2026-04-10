import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Movie } from '../../services/api.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [FormsModule, RouterLink, SlicePipe],
  template: `
    <div class="page">
      <h1 class="page-title">Movie Catalog</h1>
      <div class="filters">
        <input type="text" [(ngModel)]="searchQuery" placeholder="Search movies..."
               class="input" (keyup.enter)="loadMovies()" />
        <select [(ngModel)]="selectedGenre" class="input" (change)="loadMovies()">
          <option value="">All Genres</option>
          @for (g of genres; track g.id) {
            <option [value]="g.name">{{ g.name }}</option>
          }
        </select>
        <button class="btn-primary" (click)="loadMovies()">Search</button>
      </div>

      @if (loading) {
        <div class="loading">Loading movies...</div>
      }

      <div class="movie-grid">
        @for (movie of movies; track movie.id) {
          <a [routerLink]="['/movies', movie.id]" class="movie-card">
            <div class="poster-wrap">
              <img [src]="movie.poster_url" [alt]="movie.title" class="poster"
                   (error)="onImgError($event)" />
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

      @if (!loading && movies.length === 0) {
        <p class="empty">No movies found.</p>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .page-title {
      font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 1.5rem;
    }
    .filters { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .input {
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      color: #fff; padding: 0.7rem 1rem; border-radius: 10px; font-size: 0.95rem;
      flex: 1; min-width: 150px; outline: none;
    }
    .input:focus { border-color: #ffd200; }
    .input option { background: #1a1a2e; color: #fff; }
    .btn-primary {
      background: linear-gradient(135deg, #f7971e, #ffd200);
      border: none; color: #0f0c29; padding: 0.7rem 1.5rem;
      border-radius: 10px; font-weight: 700; cursor: pointer;
      font-size: 0.95rem; transition: opacity 0.2s;
    }
    .btn-primary:hover { opacity: 0.9; }
    .movie-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem;
    }
    .movie-card { text-decoration: none; color: #fff; transition: transform 0.3s; }
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
    .loading { text-align: center; color: #ffd200; padding: 3rem; }
    .empty { text-align: center; color: rgba(255,255,255,0.5); padding: 3rem; }
  `]
})
export class MovieListComponent implements OnInit {
  private api = inject(ApiService);
  movies: Movie[] = [];
  genres: any[] = [];
  searchQuery = '';
  selectedGenre = '';
  loading = false;

  ngOnInit() {
    this.loadMovies();
    this.api.getGenres().subscribe(g => this.genres = g);
  }

  loadMovies() {
    this.loading = true;
    this.api.getMovies({ search: this.searchQuery, genre: this.selectedGenre }).subscribe({
      next: m => { this.movies = m; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Poster';
  }
}
