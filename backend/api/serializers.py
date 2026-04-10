from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Genre, Movie, WatchlistItem, MoodEntry, UserProfile


# ========== ModelSerializers (2+) ==========

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class MovieSerializer(serializers.ModelSerializer):
    genre_name = serializers.CharField(source='genre.name', read_only=True)
    genre_mood_tags = serializers.CharField(source='genre.mood_tags', read_only=True)
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Movie
        fields = ['id', 'title', 'poster_url', 'release_date', 'rating_imdb',
                  'description', 'genre', 'genre_name', 'genre_mood_tags', 'average_rating']


class WatchlistItemSerializer(serializers.ModelSerializer):
    movie_detail = MovieSerializer(source='movie', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = WatchlistItem
        fields = ['id', 'user', 'movie', 'movie_detail', 'username',
                  'status', 'user_rating', 'review', 'created_at', 'updated_at']
        read_only_fields = ['user']


class MoodEntrySerializer(serializers.ModelSerializer):
    recommended_movie_detail = MovieSerializer(source='recommended_movie', read_only=True)

    class Meta:
        model = MoodEntry
        fields = ['id', 'user', 'mood', 'note', 'recommended_movie',
                  'recommended_movie_detail', 'created_at']
        read_only_fields = ['user', 'recommended_movie']


# ========== Regular Serializers (2+) ==========

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)
        return user


class MoodRecommendationSerializer(serializers.Serializer):
    mood = serializers.ChoiceField(choices=[
        'happy', 'sad', 'excited', 'chill', 'romantic', 'energetic', 'mysterious', 'calm'
    ])
    mode = serializers.CharField(required=False, default='resting')


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    watchlist_stats = serializers.SerializerMethodField()
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'avatar', 'preferred_genres',
                  'watchlist_stats', 'follower_count', 'following_count']

    def get_watchlist_stats(self, obj):
        watchlist = obj.user.watchlist
        return {
            'planned': watchlist.filter(status='planned').count(),
            'watching': watchlist.filter(status='watching').count(),
            'completed': watchlist.filter(status='completed').count(),
        }

    def get_follower_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()
