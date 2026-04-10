from django.core.management.base import BaseCommand
from api.models import Genre, Movie


class Command(BaseCommand):
    help = 'Seed database with initial genres and movies'

    def handle(self, *args, **options):
        genres_data = [
            ('Comedy', 'happy,energetic,chill'),
            ('Drama', 'sad,calm,romantic'),
            ('Action', 'excited,energetic'),
            ('Thriller', 'excited,mysterious'),
            ('Romance', 'romantic,happy'),
            ('Animation', 'happy,chill,calm'),
            ('Sci-Fi', 'excited,mysterious'),
            ('Documentary', 'chill,calm'),
            ('Horror', 'mysterious,excited'),
            ('Adventure', 'happy,energetic,excited'),
            ('Indie', 'chill,calm'),
        ]
        genres = {}
        for name, tags in genres_data:
            g, _ = Genre.objects.get_or_create(name=name, defaults={'mood_tags': tags})
            genres[name] = g

        movies_data = [
            ('The Grand Budapest Hotel', 'https://image.tmdb.org/t/p/w500/eWDyYritelMbPFmcSiMzEX2XJZW.jpg', '2014-03-28', 8.1, 'Comedy',
             'The adventures of Gustave H, a legendary concierge at a famous European hotel.'),
            ('Inception', 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', '2010-07-16', 8.8, 'Sci-Fi',
             'A thief who steals corporate secrets through dream-sharing technology.'),
            ('The Shawshank Redemption', 'https://image.tmdb.org/t/p/w500/9cjIGRiQG3jKCnR2fPNqfalfWdn.jpg', '1994-09-23', 9.3, 'Drama',
             'Two imprisoned men bond over a number of years, finding solace and eventual redemption.'),
            ('Spirited Away', 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', '2001-07-20', 8.6, 'Animation',
             'A young girl wanders into a world ruled by gods, witches, and spirits.'),
            ('The Dark Knight', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1IFe7.jpg', '2008-07-18', 9.0, 'Action',
             'Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'),
            ('La La Land', 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', '2016-12-09', 8.0, 'Romance',
             'A musician and an actress fall in love while pursuing their dreams in Los Angeles.'),
            ('Interstellar', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', '2014-11-07', 8.7, 'Sci-Fi',
             'A team of explorers travel through a wormhole in space to ensure humanity\'s survival.'),
            ('Amélie', 'https://image.tmdb.org/t/p/w500/nSxLnvnRJSNnOtG0BstatMRphSg.jpg', '2001-04-25', 8.3, 'Comedy',
             'Amélie is an innocent and naive girl in Paris with her own sense of justice.'),
            ('Mad Max: Fury Road', 'https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg', '2015-05-15', 8.1, 'Action',
             'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler.'),
            ('Pride and Prejudice', 'https://image.tmdb.org/t/p/w500/5Jv7MJhIJLsUdG66WYLNVHPYP0p.jpg', '2005-09-16', 7.8, 'Romance',
             'Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy.'),
            ('The Hangover', 'https://image.tmdb.org/t/p/w500/uluhlXubGu1VxICNOEKyKOq9dun.jpg', '2009-06-05', 7.7, 'Comedy',
             'Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night.'),
            ('Get Out', 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg', '2017-02-24', 7.7, 'Horror',
             'A young African-American visits his white girlfriend\'s parents for the weekend.'),
            ('Planet Earth', 'https://image.tmdb.org/t/p/w500/kROm0OFhXFbLANhmNanssMbmPBj.jpg', '2006-03-05', 9.4, 'Documentary',
             'A breathtaking exploration of the natural world.'),
            ('Up', 'https://image.tmdb.org/t/p/w500/vpbaStTMt8qqXaEgnOR2EE4DNJk.jpg', '2009-05-29', 8.3, 'Animation',
             'A 78-year-old man carries out his lifelong dream of exploring South America.'),
            ('John Wick', 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg', '2014-10-24', 7.4, 'Action',
             'An ex-hitman comes out of retirement to track down the gangsters that killed his dog.'),
            ('The Notebook', 'https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg', '2004-06-25', 7.8, 'Romance',
             'A poor yet passionate young man falls in love with a rich young woman.'),
            ('Moonlight', 'https://image.tmdb.org/t/p/w500/4911T5FbGnrgS9MkDHMKQLwSAJb.jpg', '2016-10-21', 7.4, 'Drama',
             'A young African-American man grapples with his identity and sexuality.'),
            ('WALL-E', 'https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg', '2008-06-27', 8.4, 'Animation',
             'In a distant future, a small waste-collecting robot inadvertently embarks on a space journey.'),
            ('The Matrix', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', '1999-03-31', 8.7, 'Sci-Fi',
             'A hacker discovers the shocking truth about reality.'),
            ('Superbad', 'https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg', '2007-08-17', 7.6, 'Comedy',
             'Two co-dependent high school seniors are forced to deal with separation anxiety.'),
        ]
        for title, poster, date, rating, genre_name, desc in movies_data:
            Movie.objects.get_or_create(
                title=title,
                defaults={
                    'poster_url': poster,
                    'release_date': date,
                    'rating_imdb': rating,
                    'genre': genres.get(genre_name),
                    'description': desc,
                }
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(genres_data)} genres and {len(movies_data)} movies'))
