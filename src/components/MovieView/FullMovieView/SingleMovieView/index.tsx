import React, { useState } from "react";
import { Movie } from "model";
import ParentState from "parent_state";
import SeasonView from "./SeasonView";

import styles from "./index.module.scss";

type Props = {
  movie: ParentState<Movie>;
};

const SingleMovieView: React.FC<Props> = ({ movie }: Props) => {
  const [selectedSeasonImageIndex, setSelectedSeasonImageIndex] = useState(() => 0);

  return (
    <div className={styles.SingleMovieView}>
      <img className={styles.Image} src={movie.state.seasons[selectedSeasonImageIndex]?.image}></img>
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
