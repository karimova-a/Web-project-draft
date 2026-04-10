import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  poster_url: string;
  release_date: string;
  rating_imdb: number;
  description: string;
  genre: number;
  genre_name: string;
  genre_mood_tags: string;
  average_rating: number;
  reviews?: any[];
}

export interface WatchlistItem {
  id: number;
  movie: number;
  movie_detail: Movie;
  status: string;
  user_rating: number | null;
  review: string;
  created_at: string;
  updated_at: string;
}

export interface MoodEntry {
  id: number;
  mood: string;
  note: string;
  recommended_movie_detail: Movie | null;
  created_at: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar: string;
  preferred_genres: string;
  watchlist_stats: { planned: number; watching: number; completed: number };
  follower_count: number;
  following_count: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Movies
  getMovies(params?: { genre?: string; search?: string; mood?: string }): Observable<Movie[]> {
    let httpParams = new HttpParams();
    if (params?.genre) httpParams = httpParams.set('genre', params.genre);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.mood) httpParams = httpParams.set('mood', params.mood);
    return this.http.get<Movie[]>(`${this.baseUrl}/movies/`, { params: httpParams });
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/movies/${id}/`);
  }

  // Genres
  getGenres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/genres/`);
  }

  // Mood recommendations
  getMoodRecommendations(mood: string, mode: string = 'resting'): Observable<{ mood: string; recommendations: Movie[] }> {
    return this.http.post<{ mood: string; recommendations: Movie[] }>(
      `${this.baseUrl}/mood/recommend/`, { mood, mode }
    );
  }

  // Watchlist
  getWatchlist(status?: string): Observable<WatchlistItem[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<WatchlistItem[]>(`${this.baseUrl}/watchlist/`, { params });
  }

  addToWatchlist(movieId: number, status: string = 'planned'): Observable<WatchlistItem> {
    return this.http.post<WatchlistItem>(`${this.baseUrl}/watchlist/`, { movie: movieId, status });
  }

  updateWatchlistItem(id: number, data: Partial<WatchlistItem>): Observable<WatchlistItem> {
    return this.http.put<WatchlistItem>(`${this.baseUrl}/watchlist/${id}/`, data);
  }

  removeFromWatchlist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/watchlist/${id}/`);
  }

  // Mood entries
  getMoodEntries(): Observable<MoodEntry[]> {
    return this.http.get<MoodEntry[]>(`${this.baseUrl}/mood/entries/`);
  }

  // Profile
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/profile/`);
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/profile/`, data);
  }
}
