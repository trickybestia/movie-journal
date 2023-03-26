import { Filter } from "filters";
import { getMovieStats } from "model/stats";

const watched: Filter = movie => {
  const stats = getMovieStats(movie);

  return stats.totalEpisodes === stats.watchedEpisodes;
};

export default watched;
