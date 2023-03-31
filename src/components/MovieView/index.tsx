import React from "react";
import { Filter } from "filters";
import useDynamicContextMenu from "hooks/use-dynamic-context-menu";
import { MovieType } from "model";
import { newMovie } from "model/new";
import ParentState from "parent-state";

import SingleMovieView from "./SingleMovieView";

import styles from "./index.module.scss";

type Props = { movies: ParentState<readonly MovieType[]>; filters: readonly Filter[] };

const FullMovieView: React.FC<Props> = ({ movies, filters }: Props) => {
  const { requestContextMenuItems } = useDynamicContextMenu();

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
        <div
          key={index}
          className={styles.SingleMovieViewWrapper}
          onContextMenu={() => {
            requestContextMenuItems([
              {
                name: "Удалить тайтл",
                onClick: () => {
                  movies.update(movies => {
                    movies.splice(index, 1);
                  });
                }
              }
            ]);
          }}
        >
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
      );
      movieViews.push(<div className={styles.Separator} key={`Separator${index}`}></div>);
    }
  });

  return (
    <div
      className={styles.FullMovieView}
      onContextMenu={() => {
        requestContextMenuItems([
          {
            name: "Добавить тайтл",
            onClick: () => {
              movies.update(movies => {
                movies.push(newMovie());
              });
            }
          }
        ]);
      }}
    >
      {movieViews}
    </div>
  );
};

export default FullMovieView;
export type { Props };
