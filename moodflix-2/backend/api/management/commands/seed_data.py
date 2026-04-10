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

        # (title, poster, date, rating, genre, description, trailer_embed)
        movies_data = [
            (
                'The Grand Budapest Hotel',
                'https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_SX300.jpg',
                '2014-03-28', 8.1, 'Comedy',
                'The adventures of Gustave H, a legendary concierge at a famous European hotel.',
                'https://youtu.be/1Fg5iWmQjwk',
            ),
            (
                'Inception',
                'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
                '2010-07-16', 8.8, 'Sci-Fi',
                'A thief who steals corporate secrets through dream-sharing technology.',
                'https://youtu.be/8hP9D6kZseM',
            ),
            (
                'The Shawshank Redemption',
                'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg',
                '1994-09-23', 9.3, 'Drama',
                'Two imprisoned men bond over a number of years, finding solace and eventual redemption.',
                'https://youtu.be/PLl99DlL6b4',
            ),
            (
                'Spirited Away',
                'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
                '2001-07-20', 8.6, 'Animation',
                'A young girl wanders into a world ruled by gods, witches, and spirits.',
                'https://youtu.be/ByXuk9QqQkk',
            ),
            (
                'The Dark Knight',
                'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
                '2008-07-18', 9.0, 'Action',
                'Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
                'https://youtu.be/EXeTwQWrcwY',
            ),
            (
                'La La Land',
                'https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_SX300.jpg',
                '2016-12-09', 8.0, 'Romance',
                'A musician and an actress fall in love while pursuing their dreams in Los Angeles.',
                'https://youtu.be/GTWqwSNQCcg?list=RDGTWqwSNQCcg',
            ),
            (
                'Interstellar',
                'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg',
                '2014-11-07', 8.7, 'Sci-Fi',
                'A team of explorers travel through a wormhole in space to ensure humanity\'s survival.',
                'https://youtu.be/zSWdZVtXT7E',
            ),
            (
                'Amelie',
                'https://m.media-aamazon.com/images/I/81Ir3aomQyL._AC_UF894,1000_QL80_.jpg',
                '2001-04-25', 8.3, 'Comedy',
                'Amelie is an innocent and naive girl in Paris with her own sense of justice.',
                'https://youtu.be/Py7cDXQae2U',
            ),
            (
                'Mad Max: Fury Road',
                'https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
                '2015-05-15', 8.1, 'Action',
                'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler.',
                'https://youtu.be/hEJnMQG9ev8',
            ),
            (
                'Pride and Prejudice',
                'https://m.media-amazon.com/images/M/MV5BMTA1NDQ3NTcyOTNeQTJeQWpwZ15BbWU3MDA0MzA4MzE@._V1_SX300.jpg',
                '2005-09-16', 7.8, 'Romance',
                'Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy.',
                'https://youtu.be/Ur_DIHs92NM',
            ),
            (
                'The Hangover',
                'https://m.media-amazon.com/images/M/MV5BNGQwZjg5YmYtY2VkNC00NzliLTljYTctNzI5NmU3MjE2ODQzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
                '2009-06-05', 7.7, 'Comedy',
                'Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night.',
                'https://youtu.be/TZc39afdeXU',
            ),
            (
                'Get Out',
                'https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_SX300.jpg',
                '2017-02-24', 7.7, 'Horror',
                'A young African-American visits his white girlfriend\'s parents for the weekend.',
                'https://youtu.be/DzfpyUB60YY',
            ),
            (
                'Planet Earth',
                'https://m.media-amazon.com/images/I/91yNaIH3SiL._AC_UF894,1000_QL80_.jpg',
                '2006-03-05', 9.4, 'Documentary',
                'A breathtaking exploration of the natural world.',
                'https://youtu.be/c8aFcHFu8QM',
            ),
            (
                'Up',
                'https://m.media-amazon.com/images/I/5182qWG3BFL._AC_UF1000,1000_QL80_.jpg',
                '2009-05-29', 8.3, 'Animation',
                'A 78-year-old man carries out his lifelong dream of exploring South America.',
                'https://youtu.be/ORFWdXl_zJ4',
            ),
            (
                'John Wick',
                'https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_SX300.jpg',
                '2014-10-24', 7.4, 'Action',
                'An ex-hitman comes out of retirement to track down the gangsters that killed his dog.',
                'https://youtu.be/C0BMx-qxsP4',
            ),
            (
                'The Notebook',
                'https://m.media-amazon.com/images/I/71qUfucZMTL._AC_UF1000,1000_QL80_.jpg',
                '2004-06-25', 7.8, 'Romance',
                'A poor yet passionate young man falls in love with a rich young woman.',
                'https://youtu.be/yDJIcYE32NU',
            ),
            (
                'Avengers: Infinity War',
                'https://m.media-amazon.com/images/I/81skfhCLqZL._AC_UF1000,1000_QL80_.jpg',
                '2018-04-27', 9.0, 'Action',
                'Earths heroes fight Thanos, who wants to collect all Infinity Stones to destroy half of all life in the Universe',
                'https://youtu.be/6ZfuNTqbHE8',
            ),
            (
                'WALL-E',
                'https://m.media-amazon.com/images/I/51RoZRgIHtL.jpg',
                '2008-06-27', 8.4, 'Animation',
                'In a distant future, a small waste-collecting robot inadvertently embarks on a space journey.',
                'https://youtu.be/CZ1CATNbXg0',
            ),
            (
                'The Matrix',
                'https://m.media-amazon.com/images/I/613ypTLZHsL._AC_UF1000,1000_QL80_.jpg',
                '1999-03-31', 8.7, 'Sci-Fi',
                'A hacker discovers the shocking truth about reality.',
                'https://youtu.be/vKQi3bBA1y8',
            ),
            (
                'Superbad',
                'https://m.media-amazon.com/images/I/51aHfqvu3-L._AC_UF894,1000_QL80_.jpg',
                '2007-08-17', 7.6, 'Comedy',
                'Two co-dependent high school seniors are forced to deal with separation anxiety.',
                'https://youtu.be/4eaZ_48ZYog',
            ),
        ]

        for title, poster, date, rating, genre_name, desc, trailer in movies_data:
            movie, created = Movie.objects.get_or_create(
                title=title,
                defaults={
                    'poster_url': poster,
                    'release_date': date,
                    'rating_imdb': rating,
                    'genre': genres.get(genre_name),
                    'description': desc,
                    'trailer_url': trailer,
                }
            )
            if not created:
                movie.poster_url = poster
                movie.trailer_url = trailer
                movie.save()

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(genres_data)} genres and {len(movies_data)} movies'))
