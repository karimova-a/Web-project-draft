import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { ApiService, SearchUser, FriendActivity, SimpleUser } from '../../services/api.service';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [FormsModule, RouterLink, SlicePipe],
  template: `
    <div class="page">
      <h1 class="page-title">Friends</h1>

      <!-- Search Users -->
      <div class="search-section">
        <h2 class="section-title">Find People</h2>
        <div class="search-bar">
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search by username..."
                 class="input" (keyup.enter)="onSearch()" />
          <button class="btn-primary" (click)="onSearch()">Search</button>
        </div>

        @if (searchResults.length > 0) {
          <div class="user-list">
            @for (user of searchResults; track user.id) {
              <div class="user-card">
                <div class="user-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
                <span class="user-name">{{ user.username }}</span>
                @if (user.is_following) {
                  <button class="btn-unfollow" (click)="onUnfollow(user)">Unfollow</button>
                } @else {
                  <button class="btn-follow" (click)="onFollow(user)">Follow</button>
                }
              </div>
            }
          </div>
        }

        @if (searchQuery.length >= 2 && searchResults.length === 0 && searched) {
          <p class="empty">No users found.</p>
        }
      </div>

      <!-- Following / Followers -->
      <div class="lists-section">
        <div class="list-col">
          <h2 class="section-title">Following ({{ following.length }})</h2>
          @if (following.length === 0) {
            <p class="empty">Not following anyone yet.</p>
          }
          @for (user of following; track user.id) {
            <div class="user-card">
              <div class="user-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
              <span class="user-name">{{ user.username }}</span>
              <button class="btn-unfollow" (click)="onUnfollowById(user.id, user.username)">Unfollow</button>
            </div>
          }
        </div>
        <div class="list-col">
          <h2 class="section-title">Followers ({{ followers.length }})</h2>
          @if (followers.length === 0) {
            <p class="empty">No followers yet.</p>
          }
          @for (user of followers; track user.id) {
            <div class="user-card">
              <div class="user-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
              <span class="user-name">{{ user.username }}</span>
            </div>
          }
        </div>
      </div>

  
      <div class="activity-section">
        <h2 class="section-title"> What your friends are watching</h2>
        @if (activities.length === 0) {
          <p class="empty">No activity yet. Follow some people to see what they're watching!</p>
        }
        @for (act of activities; track act.id) {
          <div class="activity-card">
            <div class="activity-header">
              <div class="activity-avatar">{{ act.username.charAt(0).toUpperCase() }}</div>
              <div class="activity-meta">
                <span class="activity-user">{{ act.username }}</span>
                <span class="activity-action">{{ act.action }}</span>
              </div>
              <span class="activity-time">{{ act.timestamp | slice:0:10 }}</span>
            </div>
            <a [routerLink]="['/movies', act.movie.id]" class="activity-movie">
              <img [src]="act.movie.poster_url" class="activity-poster"
                   (error)="onImgError($event)" />
              <div class="activity-movie-info">
                <h4>{{ act.movie.title }}</h4>
                <span class="activity-genre">{{ act.movie.genre_name }}</span>
                @if (act.rating) {
                  <span class="activity-rating">⭐ {{ act.rating }}/5</span>
                }
              </div>
            </a>
            @if (act.review) {
              <p class="activity-review">"{{ act.review }}"</p>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 800px; margin: 0 auto; padding: 2rem; }
    .page-title { font-size: 3rem; font-weight: 800; color: #fff; margin-bottom: 1.5rem; }
    .section-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 1rem; }

    .search-section { margin-bottom: 2.5rem; }
    .search-bar { display: flex; gap: 0.8rem; margin-bottom: 1rem; }
    .input {
      flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      color: #fff; padding: 0.7rem 1rem; border-radius: 10px; font-size: 0.95rem; outline: none;
    }
    .input:focus { border-color: #ffd200; }
    .btn-primary {
      background: linear-gradient(135deg, #f7971e, #ffd200); border: none; color: #0f0c29;
      padding: 0.7rem 1.5rem; border-radius: 10px; font-weight: 700; cursor: pointer;
    }

    .user-list, .list-col { display: flex; flex-direction: column; gap: 0.6rem; }
    .user-card {
      display: flex; align-items: center; gap: 0.8rem; padding: 0.8rem 1rem;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
    }
    .user-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; color: #fff; font-size: 1rem; flex-shrink: 0;
    }
    .user-name { flex: 1; color: #fff; font-weight: 600; }
    .btn-follow {
      background: linear-gradient(135deg, #f7971e, #ffd200); border: none; color: #0f0c29;
      padding: 0.4rem 1rem; border-radius: 20px; font-weight: 700; cursor: pointer; font-size: 0.85rem;
    }
    .btn-unfollow {
      background: none; border: 1px solid rgba(255,100,100,0.4); color: #ff6b6b;
      padding: 0.4rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-unfollow:hover { background: rgba(255,100,100,0.1); }

    .lists-section { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2.5rem; }
    @media (max-width: 600px) { .lists-section { grid-template-columns: 1fr; } }

    .activity-section { margin-top: 1rem; }
    .activity-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px; padding: 1.2rem; margin-bottom: 1rem;
    }
    .activity-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.8rem; }
    .activity-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #f093fb, #f5576c);
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; color: #fff; font-size: 0.9rem; flex-shrink: 0;
    }
    .activity-meta { flex: 1; }
    .activity-user { color: #ffd200; font-weight: 700; margin-right: 0.4rem; }
    .activity-action { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
    .activity-time { color: rgba(255,255,255,0.3); font-size: 0.8rem; }

    .activity-movie {
      display: flex; gap: 0.8rem; text-decoration: none; color: #fff;
      padding: 0.6rem; background: rgba(255,255,255,0.03); border-radius: 10px;
    }
    .activity-poster { width: 50px; height: 75px; object-fit: cover; border-radius: 6px; }
    .activity-movie-info h4 { font-size: 0.95rem; margin-bottom: 0.2rem; }
    .activity-genre { color: rgba(255,255,255,0.5); font-size: 0.8rem; }
    .activity-rating { color: #ffd200; font-size: 0.85rem; margin-left: 0.5rem; }
    .activity-review {
      color: rgba(255,255,255,0.6); font-style: italic; font-size: 0.9rem;
      margin-top: 0.6rem; padding-left: 0.5rem;
      border-left: 2px solid rgba(255,210,0,0.3);
    }
    .empty { color: rgba(255,255,255,0.4); text-align: center; padding: 1rem; }
  `]
})
export class FriendsComponent implements OnInit {
  private api = inject(ApiService);

  searchQuery = '';
  searchResults: SearchUser[] = [];
  searched = false;
  activities: FriendActivity[] = [];
  following: SimpleUser[] = [];
  followers: SimpleUser[] = [];

  ngOnInit() {
    this.loadFriendsList();
    this.loadActivity();
  }

  onSearch() {
    if (this.searchQuery.length < 2) return;
    this.searched = true;
    this.api.searchUsers(this.searchQuery).subscribe(r => this.searchResults = r);
  }

  onFollow(user: SearchUser) {
    this.api.followUser(user.id).subscribe(() => {
      user.is_following = true;
      this.loadFriendsList();
      this.loadActivity();
    });
  }

  onUnfollow(user: SearchUser) {
    this.api.unfollowUser(user.id).subscribe(() => {
      user.is_following = false;
      this.loadFriendsList();
      this.loadActivity();
    });
  }

  onUnfollowById(userId: number, username: string) {
    this.api.unfollowUser(userId).subscribe(() => {
      this.loadFriendsList();
      this.loadActivity();
    });
  }

  loadFriendsList() {
    this.api.getFriendsList().subscribe(data => {
      this.following = data.following;
      this.followers = data.followers;
    });
  }

  loadActivity() {
    this.api.getFriendsActivity().subscribe(a => this.activities = a);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/50x75?text=N/A';
  }
}
