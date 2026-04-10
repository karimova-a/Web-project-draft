from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Auth (JWT)
    path('register/', views.register_view, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Genres (FBV)
    path('genres/', views.genre_list_view, name='genre-list'),

    # Mood recommendation (FBV)
    path('mood/recommend/', views.mood_recommend_view, name='mood-recommend'),

    # Movies (CBV - CRUD)
    path('movies/', views.MovieListCreateView.as_view(), name='movie-list'),
    path('movies/<int:pk>/', views.MovieDetailView.as_view(), name='movie-detail'),

    # Watchlist (CBV)
    path('watchlist/', views.WatchlistView.as_view(), name='watchlist'),
    path('watchlist/<int:pk>/', views.WatchlistItemDetailView.as_view(), name='watchlist-detail'),

    # Mood entries (CBV)
    path('mood/entries/', views.MoodEntryListView.as_view(), name='mood-entries'),

    # Profile (CBV)
    path('profile/', views.UserProfileView.as_view(), name='profile'),
]
