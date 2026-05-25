import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { users, movies, userMovies } from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log('Seeding data...');
  
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const insertedUsers = await db.insert(users).values([
    { email: 'admin@example.com', name: 'Admin User', role: 'admin', passwordHash },
    { email: 'user@example.com', name: 'Normal User', role: 'user', passwordHash },
  ]).returning();

  const insertedMovies = await db.insert(movies).values([
    { title: 'Inception', slug: 'inception', year: 2010, director: 'Christopher Nolan', genre: 'Sci-Fi', description: 'A thief who steals corporate secrets through the use of dream-sharing technology.', posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvmHnTPhqO.jpg' },
    { title: 'The Matrix', slug: 'the-matrix', year: 1999, director: 'The Wachowskis', genre: 'Action', description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { title: 'Interstellar', slug: 'interstellar', year: 2014, director: 'Christopher Nolan', genre: 'Sci-Fi', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MvrIdMVD.jpg' },
    { title: 'The Dark Knight', slug: 'the-dark-knight', year: 2008, director: 'Christopher Nolan', genre: 'Action', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { title: 'Fight Club', slug: 'fight-club', year: 1999, director: 'David Fincher', genre: 'Drama', description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.', posterUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
    { title: 'Pulp Fiction', slug: 'pulp-fiction', year: 1994, director: 'Quentin Tarantino', genre: 'Crime', description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPbOYKQruzY.jpg' },
    { title: 'The Shawshank Redemption', slug: 'the-shawshank-redemption', year: 1994, director: 'Frank Darabont', genre: 'Drama', description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg' },
    { title: 'Forrest Gump', slug: 'forrest-gump', year: 1994, director: 'Robert Zemeckis', genre: 'Drama', description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.', posterUrl: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg' },
    { title: 'Goodfellas', slug: 'goodfellas', year: 1990, director: 'Martin Scorsese', genre: 'Crime', description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.', posterUrl: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg' },
    { title: 'The Godfather', slug: 'the-godfather', year: 1972, director: 'Francis Ford Coppola', genre: 'Crime', description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' }
  ]).returning();

  await db.insert(userMovies).values([
    { userId: insertedUsers[0].id, movieId: insertedMovies[0].id, status: 'watched', rating: 9, review: 'Amazing!' },
    { userId: insertedUsers[0].id, movieId: insertedMovies[1].id, status: 'watching' },
    { userId: insertedUsers[0].id, movieId: insertedMovies[2].id, status: 'to_watch' },
    { userId: insertedUsers[0].id, movieId: insertedMovies[3].id, status: 'watched', rating: 10 },
    { userId: insertedUsers[0].id, movieId: insertedMovies[4].id, status: 'to_watch' },
    
    { userId: insertedUsers[1].id, movieId: insertedMovies[5].id, status: 'watched', rating: 8 },
    { userId: insertedUsers[1].id, movieId: insertedMovies[6].id, status: 'watching' },
    { userId: insertedUsers[1].id, movieId: insertedMovies[7].id, status: 'to_watch' },
    { userId: insertedUsers[1].id, movieId: insertedMovies[8].id, status: 'to_watch' },
    { userId: insertedUsers[1].id, movieId: insertedMovies[9].id, status: 'to_watch' },
  ]);

  console.log('Seeding completed!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
