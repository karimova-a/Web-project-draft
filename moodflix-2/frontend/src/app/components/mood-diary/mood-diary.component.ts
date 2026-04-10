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
    .page { max-width: 700px; margin: 0 auto; padding: 2rem; }
    .page-title { font-size: 2rem; font-weight: 800; color: #fff; }
    .subtitle { color: rgba(255,255,255,0.5); margin-bottom: 2rem; }
    .empty { text-align: center; color: rgba(255,255,255,0.5); padding: 3rem; }
    .empty a { color: #ffd200; }
    .entry-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px; padding: 1.2rem; margin-bottom: 0.8rem;
      display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
    }
    .entry-mood { display: flex; align-items: center; gap: 0.5rem; }
    .mood-emoji { font-size: 2rem; }
    .mood-text { color: #ffd200; font-weight: 600; text-transform: capitalize; }
    .entry-info { flex: 1; }
    .entry-date { color: rgba(255,255,255,0.4); font-size: 0.85rem; display: block; }
    .entry-note { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
    .rec-movie {
      display: flex; align-items: center; gap: 0.5rem;
      text-decoration: none; color: #fff; font-size: 0.85rem;
    }
    .rec-poster { width: 40px; height: 60px; object-fit: cover; border-radius: 6px; }
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

  getMoodEmoji(mood: string): string { return this.emojiMap[mood] || '🎬'; }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/40x60?text=N/A';
  }
}
