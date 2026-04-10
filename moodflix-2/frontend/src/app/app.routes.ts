import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { MoodDiaryComponent } from './components/mood-diary/mood-diary.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FriendsComponent } from './components/friends/friends.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'MoodFlix — Home' },
  { path: 'movies', component: MovieListComponent, title: 'MoodFlix — Movies' },
  { path: 'movies/:id', component: MovieDetailComponent, title: 'MoodFlix — Movie Details' },
  { path: 'watchlist', component: WatchlistComponent, title: 'MoodFlix — Watchlist', canActivate: [authGuard] },
  { path: 'friends', component: FriendsComponent, title: 'MoodFlix — Friends', canActivate: [authGuard] },
  { path: 'mood-diary', component: MoodDiaryComponent, title: 'MoodFlix — Mood Diary', canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, title: 'MoodFlix — Profile', canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, title: 'MoodFlix — Login' },
  { path: 'register', component: RegisterComponent, title: 'MoodFlix — Register' },
  { path: '**', redirectTo: '' },
];
