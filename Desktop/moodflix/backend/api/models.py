from django.db import models
from django.contrib.auth.models import User


class Genre(models.Model):
    name = models.CharField(max_length=100)
    mood_tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated mood tags: happy,sad,excited,chill,romantic")

    def __str__(self):
        return self.name


class Movie(models.Model):
    title = models.CharField(max_length=255)
    poster_url = models.URLField(blank=True, default='')
    release_date = models.DateField(null=True, blank=True)
    rating_imdb = models.FloatField(default=0.0)
    description = models.TextField(blank=True, default='')
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, blank=True, related_name='movies')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def average_rating(self):
        ratings = self.watchlist_items.filter(user_rating__isnull=False).exclude(user_rating=0)
        if ratings.exists():
            return round(ratings.aggregate(models.Avg('user_rating'))['user_rating__avg'], 1)
        return self.rating_imdb


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.URLField(blank=True, default='')
    preferred_genres = models.CharField(max_length=500, blank=True, default='')
    following = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True)

    def __str__(self):
        return self.user.username


class WatchlistItem(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('watching', 'Watching'),
        ('completed', 'Completed'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='watchlist_items')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    user_rating = models.IntegerField(null=True, blank=True)
    review = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'movie')

    def __str__(self):
        return f"{self.user.username} - {self.movie.title} ({self.status})"


class MoodEntry(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('excited', 'Excited'),
        ('chill', 'Chill'),
        ('romantic', 'Romantic'),
        ('energetic', 'Energetic'),
        ('mysterious', 'Mysterious'),
        ('calm', 'Calm'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mood_entries')
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    note = models.TextField(blank=True, default='')
    recommended_movie = models.ForeignKey(Movie, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.mood} ({self.created_at.strftime('%Y-%m-%d')})"
