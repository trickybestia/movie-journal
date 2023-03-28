import React, { useState } from "react";
import { MovieType } from "model";
import ParentState from "parent-state";

import MoviePreview from "./MoviePreview";
import SeasonView from "./SeasonView";

import styles from "./index.module.scss";

type Props = {
  movie: ParentState<MovieType>;
};

const getSeasonWithImageIndex = (movie: MovieType): number | undefined => {
  for (let i = 0; i != movie.seasons.length; i++) {
    if (movie.seasons[i].image !== undefined) {
      return i;
    }
  }
};

const SingleMovieView: React.FC<Props> = ({ movie }: Props) => {
  const [selectedSeason, setSelectedSeason] = useState(movie.state.mainPreviewSeasonIndex);

  return (
    <div className={styles.SingleMovieView}>
      <MoviePreview movie={movie} selectedSeason={new ParentState(selectedSeason, setSelectedSeason)} />
      <div className={styles.Info}>
        <p>{movie.state.title}</p>
        <div className={styles.Seasons}>
          {movie.state.seasons.map((season, index) => (
            <SeasonView
              key={index}
              selected={index === selectedSeason}
              season={
                new ParentState(season, newSeason =>
                  movie.update(movie => {
                    movie.seasons[index] = newSeason;

                    let resetSelectedSeason = false;

                    if (movie.mainPreviewSeasonIndex === index && newSeason.image === undefined) {
                      movie.mainPreviewSeasonIndex = getSeasonWithImageIndex(movie);

                      resetSelectedSeason = true;
                    }

                    if (newSeason.image !== undefined && movie.mainPreviewSeasonIndex === undefined) {
                      movie.mainPreviewSeasonIndex = index;

                      resetSelectedSeason = true;
                    }

                    if (resetSelectedSeason) setSelectedSeason(movie.mainPreviewSeasonIndex);
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
