import React, { useState } from "react";
import useDynamicContextMenu from "hooks/use-dynamic-context-menu";
import { MovieType } from "model";
import ParentState from "parent-state";

import MoviePreview from "./MoviePreview";
import SeasonView from "./SeasonView";
import TagView from "./TagView";

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
  const { requestContextMenuItems } = useDynamicContextMenu();
  const [selectedSeason, setSelectedSeason] = useState(movie.state.mainPreviewSeasonIndex);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  let title: JSX.Element;

  if (isEditingTitle) {
    title = (
      <input
        type="text"
        defaultValue={movie.state.title}
        onBlur={event => {
          movie.update(movie => {
            movie.title = event.currentTarget.value;
          });

          setIsEditingTitle(false);
        }}
      />
    );
  } else {
    title = (
      <p
        onContextMenu={() => {
          requestContextMenuItems([
            {
              name: "Изменить название",
              onClick: () => setIsEditingTitle(true)
            }
          ]);
        }}
      >
        {movie.state.title}
      </p>
    );
  }

  return (
    <div
      className={styles.SingleMovieView}
      onContextMenu={() => {
        requestContextMenuItems([
          {
            name: "Добавить метку",
            onClick: () => {
              const tag = prompt("Введите новую метку");

              if (tag !== null && movie.state.tags.indexOf(tag) === -1) {
                movie.update(movie => {
                  movie.tags.push(tag);
                });
              }
            }
          }
        ]);
      }}
    >
      <div>
        <MoviePreview movie={movie} selectedSeason={new ParentState(selectedSeason, setSelectedSeason)} />
      </div>

      {movie.state.tags.length !== 0 && (
        <TagView
          tags={
            new ParentState(movie.state.tags, tags => {
              movie.update(movie => {
                movie.tags = tags;
              });
            })
          }
        />
      )}

      <div className={styles.Info}>
        {title}
        <div
          className={styles.Seasons}
          onContextMenu={() => {
            requestContextMenuItems([
              {
                name: "Добавить сезон",
                onClick: () =>
                  movie.update(movie => {
                    movie.seasons.push({ title: "Новый сезон", image: undefined, episodes: [] });
                  })
              }
            ]);
          }}
        >
          {movie.state.seasons.map((season, index) => (
            <SeasonView
              key={index}
              selected={index === selectedSeason}
              removeSeason={() => {
                movie.update(movie => {
                  movie.seasons.splice(index, 1);
                });

                setSelectedSeason(undefined);
              }}
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

      <textarea
        className={isEditingDescription ? styles.editingTextarea : ""}
        defaultValue={movie.state.description}
        onClick={() => {
          setIsEditingDescription(true);
        }}
        onBlur={event => {
          movie.update(movie => {
            movie.description = event.currentTarget.value;
          });

          setIsEditingDescription(false);
        }}
      />
    </div>
  );
};

export default SingleMovieView;
export type { Props };
