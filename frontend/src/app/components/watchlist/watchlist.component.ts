import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, WatchlistItem } from '../../services/api.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [FormsModule, RouterLink, SlicePipe],
  template: `
    <div class="page">
      <h1 class="page-title">My Watchlist</h1>
      <div class="tabs">
        @for (tab of tabs; track tab.key) {
          <button class="tab" [class.active]="activeTab === tab.key"
                  (click)="filterByStatus(tab.key)">
            {{ tab.label }} ({{ getCount(tab.key) }})
          </button>
        }
      </div>

      @if (loading) {
        <div class="loading">Loading...</div>
      }

      @if (!loading && filteredItems.length === 0) {
        <div class="empty">No movies in this list yet.</div>
      }

      <div class="list">
        @for (item of filteredItems; track item.id) {
          <div class="watchlist-card">
            <a [routerLink]="['/movies', item.movie_detail.id]" class="card-poster">
              <img [src]="item.movie_detail.poster_url" [alt]="item.movie_detail.title"
                   (error)="onImgError($event)" />
            </a>
            <div class="card-info">
              <h3>{{ item.movie_detail.title }}</h3>
              <p class="card-meta">{{ item.movie_detail.genre_name }} · {{ item.movie_detail.release_date | slice:0:4 }}</p>
              <div class="card-actions">
                <select [(ngModel)]="item.status" (change)="updateStatus(item)" class="status-select">
                  <option value="planned">📋 Planned</option>
                  <option value="watching">▶️ Watching</option>
                  <option value="completed">✅ Completed</option>
                </select>
                <div class="star-rating">
                  @for (s of [1,2,3,4,5]; track s) {
                    <button class="star" [class.filled]="(item.user_rating || 0) >= s"
                            (click)="rate(item, s)">★</button>
                  }
                </div>
                <button class="btn-remove" (click)="remove(item)">✕</button>
              </div>
              @if (item.review) {
                <p class="review-preview">{{ item.review }}</p>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 900px; margin: 0 auto; padding: 2rem; }
    .page-title { font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 1.5rem; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .tab {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6); padding: 0.6rem 1.2rem; border-radius: 20px;
      cursor: pointer; font-size: 0.9rem; transition: all 0.2s;
    }
    .tab.active { background: rgba(255,210,0,0.15); border-color: #ffd200; color: #ffd200; }
    .watchlist-card {
      display: flex; gap: 1rem; padding: 1rem;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px; margin-bottom: 0.8rem;
    }
    .card-poster { flex: 0 0 80px; }
    .card-poster img { width: 80px; height: 120px; object-fit: cover; border-radius: 8px; }
    .card-info { flex: 1; }
    .card-info h3 { color: #fff; font-size: 1.1rem; margin-bottom: 0.3rem; }
    .card-meta { color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-bottom: 0.8rem; }
    .card-actions { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .status-select {
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
      color: #fff; padding: 0.4rem 0.6rem; border-radius: 8px; font-size: 0.85rem;
    }
    .status-select option { background: #1a1a2e; }
    .star { background: none; border: none; color: rgba(255,255,255,0.2); cursor: pointer; font-size: 1.2rem; }
    .star.filled { color: #ffd200; }
    .btn-remove {
      background: none; border: 1px solid rgba(255,100,100,0.3);
      color: #ff6b6b; width: 30px; height: 30px; border-radius: 50%;
      cursor: pointer; font-size: 0.9rem; transition: all 0.2s;
    }
    .btn-remove:hover { background: rgba(255,100,100,0.1); }
    .review-preview {
      color: rgba(255,255,255,0.5); font-size: 0.85rem;
      margin-top: 0.5rem; font-style: italic;
    }
    .loading, .empty { text-align: center; color: rgba(255,255,255,0.5); padding: 3rem; }
  `]
})
export class WatchlistComponent implements OnInit {
  private api = inject(ApiService);
  items: WatchlistItem[] = [];
  filteredItems: WatchlistItem[] = [];
  activeTab = 'all';
  loading = false;
  tabs = [
    { key: 'all', label: 'All' },
    { key: 'planned', label: 'Planned' },
    { key: 'watching', label: 'Watching' },
    { key: 'completed', label: 'Completed' },
  ];

  ngOnInit() { this.loadWatchlist(); }

  loadWatchlist() {
    this.loading = true;
    this.api.getWatchlist().subscribe({
      next: items => { this.items = items; this.applyFilter(); this.loading = false; },
      error: () => this.loading = false
    });
  }

  filterByStatus(status: string) {
    this.activeTab = status;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredItems = this.activeTab === 'all'
      ? this.items
      : this.items.filter(i => i.status === this.activeTab);
  }

  getCount(key: string): number {
    return key === 'all' ? this.items.length : this.items.filter(i => i.status === key).length;
  }

  updateStatus(item: WatchlistItem) {
    this.api.updateWatchlistItem(item.id, { status: item.status } as any).subscribe();
  }

  rate(item: WatchlistItem, rating: number) {
    item.user_rating = rating;
    this.api.updateWatchlistItem(item.id, { user_rating: rating } as any).subscribe();
  }

  remove(item: WatchlistItem) {
    this.api.removeFromWatchlist(item.id).subscribe(() => {
      this.items = this.items.filter(i => i.id !== item.id);
      this.applyFilter();
    });
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/80x120?text=N/A';
  }
}
