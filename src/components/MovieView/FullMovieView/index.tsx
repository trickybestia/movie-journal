import React from "react";
import SingleMovieView from "./SingleMovieView";
import ParentState from "parent_state";
import { Movie } from "model";
import { MovieView, Props } from "..";
import { getMovieStats } from "model/stats";

import styles from "./index.module.scss";

const isWatched = (movie: Movie): boolean => {
  const stats = getMovieStats(movie);

  return stats.totalEpisodes === stats.watchedEpisodes;
};

const FullMovieView: MovieView = ({ movies, hideWatched }: Props) => {
  return (
    <div>
      {movies.state.map(
        (movie, index) =>
          (!hideWatched || !isWatched(movie)) && (
            <div key={index} className={styles.SingleMovieView}>
              <SingleMovieView
                movie={
                  new ParentState(movie, newMovie =>
                    movies.update(movies => {
                      movies[index] = newMovie;
                    })
                  )
                }
              />
            </div>
          )
      )}
    </div>
  );
};

export default FullMovieView;
export type { Props };
