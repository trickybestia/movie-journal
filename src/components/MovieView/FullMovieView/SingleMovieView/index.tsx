import React from "react";
import { MovieType } from "model";
import ParentState from "parent-state";

import MoviePreview from "./MoviePreview";
import SeasonView from "./SeasonView";

import styles from "./index.module.scss";

type Props = {
  movie: ParentState<MovieType>;
};

const SingleMovieView: React.FC<Props> = ({ movie }: Props) => {
  return (
    <div className={styles.SingleMovieView}>
      <MoviePreview movie={movie} />
      <div className={styles.Info}>
        <p>{movie.state.title}</p>
        <div className={styles.Seasons}>
          {movie.state.seasons.map((season, index) => (
            <SeasonView
              key={index}
              season={
                new ParentState(season, newSeason =>
                  movie.update(movie => {
                    movie.seasons[index] = newSeason;

                    if (newSeason.image !== undefined && movie.mainPreviewSeasonIndex === undefined) {
                      movie.mainPreviewSeasonIndex = index;
                    }
                  })
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleMovieView;
export type { Props };
