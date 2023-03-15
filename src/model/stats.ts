import { ModelType, MovieType } from "model";

type ModelStats = {
  watchedMovies: number;
  totalMovies: number;
  watchedEpisodes: number;
  totalEpisodes: number;
};

type MovieStats = {
  watchedEpisodes: number;
  totalEpisodes: number;
};

const getMovieStats = (movie: MovieType): MovieStats => {
  const stats: MovieStats = {
    watchedEpisodes: 0,
    totalEpisodes: 0
  };

  movie.seasons.forEach(season => {
    stats.totalEpisodes += season.episodes.length;

    season.episodes.forEach(episode => {
      if (episode) {
        stats.watchedEpisodes++;
      }
    });
  });

  return stats;
};

const getModelStats = (model: ModelType): ModelStats => {
  const stats: ModelStats = {
    watchedMovies: 0,
    totalMovies: model.movies.length,
    watchedEpisodes: 0,
    totalEpisodes: 0
  };

  model.movies.forEach(movie => {
    const movieStats = getMovieStats(movie);

    stats.totalEpisodes += movieStats.totalEpisodes;
    stats.watchedEpisodes += movieStats.watchedEpisodes;

    if (movieStats.totalEpisodes === movieStats.watchedEpisodes) {
      stats.watchedMovies++;
    }
  });

  return stats;
};

export { getModelStats, getMovieStats };
export type { ModelStats, MovieStats };
