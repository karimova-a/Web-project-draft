# 🎬 MoodFlix — Movies by Mood

> "You don't choose a movie — your mood chooses it."

**Team:** Karimova Aigerim (24B031834) · Kaldanova Lina (24B031829) · Baktygerey Kamshat (24B031679)

**Repository:** https://github.com/karimova-a/WEB_DEV_Project

---

## Project Overview

MoodFlix is a full-stack web application that helps users discover, track, and review movies based on their mood. Users select their current mood and instantly receive personalized movie recommendations.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | Angular 17+ (TypeScript) |
| Backend | Django + Django REST Framework |
| Database | SQLite |
| Auth | JWT (djangorestframework-simplejwt) |
| CORS | django-cors-headers |

---

## 👥 Code Responsibility Division

### Айгерим (Backend — Django + DRF)

| File | Description |
|---|---|
| `backend/api/models.py` | 5 models: Genre, Movie, UserProfile, WatchlistItem, MoodEntry (3+ ForeignKey) |
| `backend/api/serializers.py` | 2 ModelSerializer (MovieSerializer, WatchlistItemSerializer) + 2 Serializer (RegisterSerializer, MoodRecommendationSerializer) + extras |
| `backend/api/views.py` | 2 FBV (register_view, mood_recommend_view) + 2+ CBV (MovieListCreateView, MovieDetailView, WatchlistView, etc.) |
| `backend/api/urls.py` | All API endpoints with JWT login/refresh |
| `backend/api/admin.py` | Admin registration for all models |
| `backend/api/apps.py` | App config with auto-profile signal |
| `backend/api/management/commands/seed_data.py` | Seed 11 genres + 20 movies |
| `backend/moodflix_backend/settings.py` | Django settings: DRF, JWT, CORS config |
| `backend/moodflix_backend/urls.py` | Root URL config |
| `backend/requirements.txt` | Python dependencies |

**Also helps with:** frontend forms (ngModel bindings), Postman collection

---

### Камшат (Frontend — Services, Interceptor, Forms, Events)

| File | Description |
|---|---|
| `frontend/src/app/services/api.service.ts` | HttpClient service: all API calls (movies, watchlist, mood, profile) |
| `frontend/src/app/services/auth.service.ts` | Auth service: login, register, logout, JWT token management |
| `frontend/src/app/interceptors/jwt.interceptor.ts` | JWT interceptor: auto-attach Bearer token to requests |
| `frontend/src/app/app.config.ts` | App config with HTTP client + interceptor setup |
| `frontend/src/app/components/login/login.component.ts` | Login page with ngModel form + click event |
| `frontend/src/app/components/register/register.component.ts` | Register page with ngModel form + click event |
| `frontend/src/app/components/movie-detail/movie-detail.component.ts` | Movie detail: review form (ngModel), star rating (click), watchlist buttons (click) |
| `frontend/src/app/components/profile/profile.component.ts` | Profile page: edit form (ngModel) + save (click) |
| `frontend/src/app/components/home/home.component.ts` | Home: mood selection (click events), recommendation display |

**Checklist covered:**
- ✅ 4+ events (click) that trigger API requests
- ✅ 4+ forms with [(ngModel)]
- ✅ JWT interceptor
- ✅ Angular Service with HttpClient
- ✅ Graceful error handling
- ✅ Presentation PDF

---

### Лина (Frontend — Components, Templates, Routing, CSS)

| File | Description |
|---|---|
| `frontend/src/app/app.routes.ts` | Routing: 8 routes with 3+ named routes + auth guard |
| `frontend/src/app/guards/auth.guard.ts` | Route guard for protected pages |
| `frontend/src/app/components/navbar/navbar.component.ts` | Navbar: navigation links, @if for auth state, logout button |
| `frontend/src/app/components/movie-list/movie-list.component.ts` | Movie catalog: @for list rendering, search/filter, genre select |
| `frontend/src/app/components/watchlist/watchlist.component.ts` | Watchlist: @for items, @if conditional, status tabs, star rating |
| `frontend/src/app/components/mood-diary/mood-diary.component.ts` | Mood diary: @for entries timeline, @if conditions |
| `frontend/src/app/app.component.ts` | Root component with router-outlet |
| `frontend/src/styles.css` | Global styles (font, scrollbar, colors) |
| `frontend/src/index.html` | HTML entry point |

**Checklist covered:**
- ✅ CSS styling on all components
- ✅ Routing with 3+ named routes and navigation
- ✅ @for for displaying lists
- ✅ @if for conditional rendering
- ✅ README

---

## 📋 Requirements Checklist

### Backend (Django + DRF)
- [x] 4+ models (Genre, Movie, UserProfile, WatchlistItem, MoodEntry)
- [x] 3+ ForeignKey (Movie→Genre, WatchlistItem→User, WatchlistItem→Movie, MoodEntry→User)
- [x] 2 ModelSerializer + 2 Serializer
- [x] 2 Function-Based Views (register, mood_recommend)
- [x] 2+ Class-Based Views (MovieListCreate, MovieDetail, Watchlist, etc.)
- [x] JWT authentication (login/register/token refresh)
- [x] CRUD for Movie and WatchlistItem
- [x] Objects bound to request.user
- [x] CORS configured
- [x] Postman collection (to be exported)

### Frontend (Angular)
- [x] 4+ click events calling API (mood select, add to watchlist, rate, submit review, login, register, save profile, remove, filter)
- [x] 4+ forms with [(ngModel)] (login, register, search, review, profile edit, watchlist status)
- [x] CSS styling on all components
- [x] Routing with 3+ named routes
- [x] @for for lists (movies, watchlist, mood entries, genres, stars)
- [x] @if for conditional rendering (auth state, loading, errors, empty states)
- [x] JWT interceptor
- [x] Angular Service with HttpClient
- [x] Error handling

### General
- [x] GitHub repository with README
- [ ] Commit history (maintain during development)
- [ ] Postman collection (export after testing)
- [ ] Presentation PDF (max 4 pages)
- [ ] Demo (frontend + backend together)

---

## 🚀 Setup Instructions

### Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations api
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at: http://localhost:8000

### Frontend (Angular)

```bash
cd frontend
npm install
ng serve
```

Frontend runs at: http://localhost:4200

---

## API Endpoints

| Method | URL | Auth | Description |
|---|---|---|---|
| POST | /api/register/ | No | Register new user |
| POST | /api/login/ | No | Get JWT tokens |
| POST | /api/token/refresh/ | No | Refresh JWT token |
| GET | /api/genres/ | No | List all genres |
| GET | /api/movies/ | No | List movies (query: search, genre, mood) |
| GET | /api/movies/:id/ | No | Movie details + reviews |
| POST | /api/movies/ | No | Create movie |
| PUT | /api/movies/:id/ | No | Update movie |
| DELETE | /api/movies/:id/ | No | Delete movie |
| POST | /api/mood/recommend/ | Yes | Get mood recommendations |
| GET | /api/mood/entries/ | Yes | List mood history |
| GET | /api/watchlist/ | Yes | Get user watchlist |
| POST | /api/watchlist/ | Yes | Add to watchlist |
| PUT | /api/watchlist/:id/ | Yes | Update watchlist item |
| DELETE | /api/watchlist/:id/ | Yes | Remove from watchlist |
| GET | /api/profile/ | Yes | Get user profile |
| PUT | /api/profile/ | Yes | Update profile |

---

## Mood → Genre Mapping

| Mood | Genres |
|---|---|
| Happy | Comedy, Adventure, Animation |
| Sad | Drama, Romance |
| Excited | Action, Thriller, Sci-Fi |
| Chill | Documentary, Indie, Animation |
| Romantic | Romance, Drama |
| Energetic | Action, Adventure, Comedy |
| Mysterious | Thriller, Horror, Sci-Fi |
| Calm | Documentary, Indie, Drama |
