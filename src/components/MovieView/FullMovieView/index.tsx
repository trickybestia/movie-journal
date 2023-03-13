import React from "react";
import SingleMovieView from "./SingleMovieView";
import ParentState from "parent_state";
import { MovieView, Props } from "..";

import styles from "./index.module.scss";

const FullMovieView: MovieView = ({ movies }: Props) => {
  return (
    <div>
      {movies.state.map((movie, index) => (
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
      ))}
    </div>
  );
};

export default FullMovieView;
export type { Props };
