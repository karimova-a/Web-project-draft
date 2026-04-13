import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { ApiService, MoodEntry } from '../../services/api.service';

@Component({
  selector: 'app-mood-diary',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  template: `
    <div class="page">
      <h1 class="page-title">Mood Diary</h1>
      <p class="subtitle">Your mood history and movie recommendations</p>

      @if (entries.length === 0) {
        <div class="empty">
          <p>No mood entries yet. Go to <a routerLink="/">Home</a> and pick your mood!</p>
        </div>
      }

      <div class="timeline">
        @for (entry of entries; track entry.id) {
          <div class="entry-card">
            <div class="entry-mood">
              <span class="mood-emoji">{{ getMoodEmoji(entry.mood) }}</span>
              <span class="mood-text">{{ entry.mood }}</span>
            </div>
            <div class="entry-info">
              <span class="entry-date">{{ entry.created_at | slice:0:10 }}</span>
              @if (entry.note) { <span class="entry-note">{{ entry.note }}</span> }
            </div>
            @if (entry.recommended_movie_detail) {
              <a [routerLink]="['/movies', entry.recommended_movie_detail.id]" class="rec-movie">
                <img [src]="entry.recommended_movie_detail.poster_url" class="rec-poster"
                     (error)="onImgError($event)" />
                <span>{{ entry.recommended_movie_detail.title }}</span>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1000px;
      margin: 0 auto;
      padding: 3rem;
    }

    .page-title {
      font-size: 2.6rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: rgba(255,255,255,0.5);
      margin-bottom: 2.5rem;
      font-size: 1.2rem;
    }

    /* Главное — нормальный скролл */
    .timeline {
      max-height: 80vh;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .empty {
      text-align: center;
      color: rgba(255,255,255,0.5);
      padding: 3rem;
      font-size: 1.2rem;
    }

    .empty a {
      color: #ffd200;
      font-weight: 600;
    }

    .entry-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 1.8rem;
      margin-bottom: 1.2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .entry-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.25);
    }

    .entry-mood {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      min-width: 160px;
    }

    .mood-emoji {
      font-size: 2.8rem;
    }

    .mood-text {
      color: #ffd200;
      font-weight: 700;
      font-size: 1.3rem;
      text-transform: capitalize;
    }

    .entry-info {
      flex: 1;
      min-width: 200px;
    }

    .entry-date {
      color: rgba(255,255,255,0.45);
      font-size: 1rem;
      display: block;
      margin-bottom: 0.2rem;
    }

    .entry-note {
      color: rgba(255,255,255,0.75);
      font-size: 1.1rem;
    }

    .rec-movie {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      text-decoration: none;
      color: #fff;
      font-size: 1.05rem;
      background: rgba(255,255,255,0.03);
      padding: 0.5rem 0.7rem;
      border-radius: 10px;
    }

    .rec-movie:hover {
      background: rgba(255,255,255,0.08);
    }

    .rec-poster {
      width: 60px;
      height: 90px;
      object-fit: cover;
      border-radius: 8px;
    }
  `]
})
export class MoodDiaryComponent implements OnInit {
  private api = inject(ApiService);
  entries: MoodEntry[] = [];

  private emojiMap: Record<string, string> = {
    happy: '😊', sad: '😢', excited: '🤩', chill: '😌',
    romantic: '🥰', energetic: '⚡', mysterious: '🔮', calm: '🧘'
  };

  ngOnInit() {
    this.api.getMoodEntries().subscribe(e => this.entries = e);
  }

  getMoodEmoji(mood: string): string {
    return this.emojiMap[mood] || '🎬';
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src =
        'https://via.placeholder.com/60x90?text=N/A';
  }
}