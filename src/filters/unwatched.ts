import { Filter } from "filters";
import { getMovieStats } from "model/stats";

const unwatched: Filter = movie => {
  const stats = getMovieStats(movie);

  return stats.totalEpisodes !== stats.watchedEpisodes;
};

export default unwatched;
