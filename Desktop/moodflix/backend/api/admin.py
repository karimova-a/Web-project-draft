from django.contrib import admin
from .models import Genre, Movie, WatchlistItem, MoodEntry, UserProfile

admin.site.register(Genre)
admin.site.register(Movie)
admin.site.register(WatchlistItem)
admin.site.register(MoodEntry)
admin.site.register(UserProfile)
