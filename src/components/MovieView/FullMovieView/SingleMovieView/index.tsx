import React, { MouseEventHandler, useState } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import { MovieType } from "model";
import ParentState from "parent-state";
import { v4 as uuidv4 } from "uuid";

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
  const [TITLE_CONTEXT_MENU_ID] = useState(() => "SingleMovieViewTitle" + (uuidv4 as () => string)());
  const { show: showTitleContextMenu, hideAll: hideTitleContextMenu } = useContextMenu({ id: TITLE_CONTEXT_MENU_ID });
  const [selectedSeason, setSelectedSeason] = useState(movie.state.mainPreviewSeasonIndex);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const onTitleContextMenu: MouseEventHandler<HTMLElement> = event => showTitleContextMenu({ event: event });

  let title: JSX.Element;

  if (isEditingTitle) {
    title = (
      <input
        type="text"
        defaultValue={movie.state.title}
        onContextMenu={onTitleContextMenu}
        onBlur={event => {
          movie.update(movie => {
            movie.title = event.currentTarget.value;
          });

          setIsEditingTitle(false);
        }}
      />
    );
  } else {
    title = <p onContextMenu={onTitleContextMenu}>{movie.state.title}</p>;
  }

  return (
    <div className={styles.SingleMovieView}>
      <MoviePreview movie={movie} selectedSeason={new ParentState(selectedSeason, setSelectedSeason)} />
      <div className={styles.Info}>
        {title}
        <div className={styles.Seasons}>
          {movie.state.seasons.map((season, index) => (
            <SeasonView
              key={index}
              selected={index === selectedSeason}
              addSeason={() => {
                movie.update(movie => {
                  movie.seasons.push({ title: "Новый сезон", image: undefined, episodes: [] });
                });
              }}
              removeSeason={() => {
                movie.update(movie => {
                  movie.seasons.splice(index, 1);
                });
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
      <Menu id={TITLE_CONTEXT_MENU_ID} animation={false}>
        <Item
          disabled={isEditingTitle}
          onClick={() => {
            setIsEditingTitle(true);
            hideTitleContextMenu();
          }}
        >
          Изменить название
        </Item>
      </Menu>
    </div>
  );
};

export default SingleMovieView;
export type { Props };
