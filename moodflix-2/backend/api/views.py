import random
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Genre, Movie, WatchlistItem, MoodEntry, UserProfile
from .serializers import (
    GenreSerializer, MovieSerializer, WatchlistItemSerializer,
    MoodEntrySerializer, RegisterSerializer, MoodRecommendationSerializer,
    UserProfileSerializer
)

MOOD_TO_GENRES = {
    'happy': ['Comedy', 'Adventure', 'Animation'],
    'sad': ['Drama', 'Romance'],
    'excited': ['Action', 'Thriller', 'Sci-Fi'],
    'chill': ['Documentary', 'Indie', 'Animation'],
    'romantic': ['Romance', 'Drama'],
    'energetic': ['Action', 'Adventure', 'Comedy'],
    'mysterious': ['Thriller', 'Horror', 'Sci-Fi'],
    'calm': ['Documentary', 'Indie', 'Drama'],
}


# ========== Function-Based Views (2+) ==========

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """FBV 1: User registration"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'User registered successfully',
            'user': {'id': user.id, 'username': user.username, 'email': user.email}
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mood_recommend_view(request):
    """FBV 2: Get movie recommendations based on mood"""
    serializer = MoodRecommendationSerializer(data=request.data)
    if serializer.is_valid():
        mood = serializer.validated_data['mood']
        genre_names = MOOD_TO_GENRES.get(mood, ['Drama'])
        movies = Movie.objects.filter(genre__name__in=genre_names)
        movie_list = list(movies)
        random.shuffle(movie_list)
        recommended = movie_list[:5]

        # Save mood entry
        rec_movie = recommended[0] if recommended else None
        MoodEntry.objects.create(
            user=request.user,
            mood=mood,
            note=serializer.validated_data.get('mode', ''),
            recommended_movie=rec_movie
        )

        return Response({
            'mood': mood,
            'recommendations': MovieSerializer(recommended, many=True).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def genre_list_view(request):
    """FBV 3: List all genres"""
    genres = Genre.objects.all()
    return Response(GenreSerializer(genres, many=True).data)


# ========== Class-Based Views (2+) ==========

class MovieListCreateView(APIView):
    """CBV 1: List all movies or create a new movie"""
    permission_classes = [AllowAny]

    def get(self, request):
        genre = request.query_params.get('genre')
        search = request.query_params.get('search')
        mood = request.query_params.get('mood')

        movies = Movie.objects.all().order_by('-created_at')

        if genre:
            movies = movies.filter(genre__name__icontains=genre)
        if search:
            movies = movies.filter(title__icontains=search)
        if mood:
            genre_names = MOOD_TO_GENRES.get(mood, [])
            movies = movies.filter(genre__name__in=genre_names)

        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MovieDetailView(APIView):
    """CBV 2: Retrieve, update, or delete a movie"""
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            return Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            return None

    def get(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MovieSerializer(movie)
        data = serializer.data
        # Include reviews
        reviews = WatchlistItem.objects.filter(movie=movie, review__gt='').order_by('-updated_at')[:10]
        data['reviews'] = WatchlistItemSerializer(reviews, many=True).data
        return Response(data)

    def put(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MovieSerializer(movie, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WatchlistView(APIView):
    """CBV 3: User watchlist management"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status_filter = request.query_params.get('status')
        items = WatchlistItem.objects.filter(user=request.user).order_by('-updated_at')
        if status_filter:
            items = items.filter(status=status_filter)
        serializer = WatchlistItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WatchlistItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WatchlistItemDetailView(APIView):
    """CBV 4: Update or delete a watchlist item"""
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            item = WatchlistItem.objects.get(pk=pk, user=request.user)
        except WatchlistItem.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = WatchlistItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            item = WatchlistItem.objects.get(pk=pk, user=request.user)
        except WatchlistItem.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MoodEntryListView(APIView):
    """CBV 5: List mood entries for authenticated user"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entries = MoodEntry.objects.filter(user=request.user).order_by('-created_at')[:30]
        serializer = MoodEntrySerializer(entries, many=True)
        return Response(serializer.data)


class UserProfileView(APIView):
    """CBV 6: Get/update user profile"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ========== Friends / Social Features ==========

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users_view(request):
    """FBV: Search users to follow"""
    query = request.query_params.get('q', '')
    if len(query) < 2:
        return Response([])
    users = User.objects.filter(username__icontains=query).exclude(id=request.user.id)[:10]
    my_profile, _ = UserProfile.objects.get_or_create(user=request.user)
    following_ids = list(my_profile.following.values_list('user_id', flat=True))
    results = []
    for u in users:
        profile, _ = UserProfile.objects.get_or_create(user=u)
        results.append({
            'id': u.id,
            'username': u.username,
            'avatar': profile.avatar,
            'is_following': u.id in following_ids,
        })
    return Response(results)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user_view(request):
    """FBV: Follow a user"""
    user_id = request.data.get('user_id')
    if not user_id or int(user_id) == request.user.id:
        return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        target_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    my_profile, _ = UserProfile.objects.get_or_create(user=request.user)
    target_profile, _ = UserProfile.objects.get_or_create(user=target_user)
    my_profile.following.add(target_profile)
    return Response({'message': f'Now following {target_user.username}'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_user_view(request):
    """FBV: Unfollow a user"""
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        target_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    my_profile, _ = UserProfile.objects.get_or_create(user=request.user)
    target_profile, _ = UserProfile.objects.get_or_create(user=target_user)
    my_profile.following.remove(target_profile)
    return Response({'message': f'Unfollowed {target_user.username}'})


class FriendsActivityView(APIView):
    """CBV: Get activity feed from followed users"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        my_profile, _ = UserProfile.objects.get_or_create(user=request.user)
        following_user_ids = list(my_profile.following.values_list('user_id', flat=True))

        # Get recent watchlist activity from friends
        activities = WatchlistItem.objects.filter(
            user_id__in=following_user_ids
        ).select_related('user', 'movie', 'movie__genre').order_by('-updated_at')[:20]

        result = []
        for item in activities:
            action = 'added to planned'
            if item.status == 'watching':
                action = 'started watching'
            elif item.status == 'completed':
                action = 'completed'
            if item.user_rating:
                action = f'rated {item.user_rating}★'
            if item.review:
                action = 'wrote a review for'

            result.append({
                'id': item.id,
                'username': item.user.username,
                'action': action,
                'movie': MovieSerializer(item.movie).data,
                'review': item.review if item.review else None,
                'rating': item.user_rating,
                'timestamp': item.updated_at,
            })

        return Response(result)


class FollowingListView(APIView):
    """CBV: Get list of users I follow and my followers"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        my_profile, _ = UserProfile.objects.get_or_create(user=request.user)

        following = []
        for p in my_profile.following.select_related('user').all():
            following.append({
                'id': p.user.id,
                'username': p.user.username,
                'avatar': p.avatar,
            })

        followers = []
        for p in my_profile.followers.select_related('user').all():
            followers.append({
                'id': p.user.id,
                'username': p.user.username,
                'avatar': p.avatar,
            })

        return Response({
            'following': following,
            'followers': followers,
        })
