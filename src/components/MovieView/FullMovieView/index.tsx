import React from "react";
import ParentState from "parent-state";

import { MovieView, Props } from "..";

import SingleMovieView from "./SingleMovieView";

import styles from "./index.module.scss";

const FullMovieView: MovieView = ({ movies, filters }: Props) => {
  const movieViews: JSX.Element[] = [];

  movies.state.forEach((movie, index) => {
    const shouldRender = () => {
      for (let i = 0; i != filters.length; i++) {
        if (filters[i](movie)) {
          return true;
        }
      }

      return false;
    };

    if (shouldRender()) {
      movieViews.push(
        <SingleMovieView
          key={index}
          movie={
            new ParentState(movie, newMovie =>
              movies.update(movies => {
                movies[index] = newMovie;
              })
            )
          }
        />
      );
    }
  });

  return <div className={styles.FullMovieView}>{movieViews}</div>;
};

export default FullMovieView;
export type { Props };
