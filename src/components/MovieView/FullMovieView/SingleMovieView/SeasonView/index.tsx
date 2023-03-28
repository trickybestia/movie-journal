import React, { MouseEventHandler, useState } from "react";
import { Item, Menu, PredicateParams, useContextMenu } from "react-contexify";
import { BlobWithData } from "io-ts-types/blob-with-data";
import { SeasonType } from "model";
import ParentState from "parent-state";
import readFile from "utils/read-file";
import { v4 as uuidv4 } from "uuid";

import styles from "./index.module.scss";

type Props = {
  season: ParentState<SeasonType>;
  selected: boolean;
  addSeason: VoidFunction;
  removeSeason: VoidFunction;
};

type ContextMenuProps = {
  episodeIndex: number;
};

const SeasonView: React.FC<Props> = ({ season, selected, addSeason, removeSeason }: Props) => {
  const [CONTEXT_MENU_ID] = useState(() => "SeasonViewContextMenu" + (uuidv4 as () => string)());
  const { show: showContextMenu, hideAll: hideContextMenu } = useContextMenu({ id: CONTEXT_MENU_ID });
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const setPreview = () => {
    readFile(file => {
      const fileReader = new FileReader();

      fileReader.readAsArrayBuffer(file);

      fileReader.onload = () => {
        season.update(season => {
          season.image = new BlobWithData({ data: new Uint8Array(fileReader.result as ArrayBuffer), type: file.type });
        });
      };
    }, "image/*");
  };

  const onTitleContextMenu: MouseEventHandler<HTMLElement> = event => showContextMenu({ event: event });

  let title: JSX.Element;

  if (isEditingTitle) {
    title = (
      <input
        className={styles.Title}
        type="text"
        defaultValue={season.state.title}
        onContextMenu={onTitleContextMenu}
        onBlur={event => {
          season.update(season => {
            season.title = event.currentTarget.value;
          });

          setIsEditingTitle(false);
        }}
      />
    );
  } else {
    title = (
      <p className={styles.Title} onContextMenu={onTitleContextMenu}>
        {season.state.title}
      </p>
    );
  }

  return (
    <div
      className={`${styles.SeasonView} ${selected ? styles.selected : ""}`}
      onContextMenu={event => showContextMenu({ event: event })}
    >
      {title}

      <div className={styles.Episodes}>
        {season.state.episodes.map((isWatched, index) => (
          <div
            key={index}
            onContextMenu={event => {
              showContextMenu({ event: event, props: { episodeIndex: index } });

              event.stopPropagation();
            }}
            className={`${styles.Episode} ${isWatched ? styles.WatchedEpisode : styles.NotWatchedEpisode}`}
            onClick={() => {
              season.update(season => {
                season.episodes[index] = !season.episodes[index];
              });
            }}
          ></div>
        ))}
      </div>

      <Menu id={CONTEXT_MENU_ID} animation={false}>
        <Item
          onClick={() => {
            setPreview();
          }}
        >
          Установить обложку
        </Item>
        <Item
          disabled={season.state.image === undefined}
          onClick={() => {
            season.update(season => {
              season.image = undefined;
            });
          }}
        >
          Удалить обложку
        </Item>
        <Item
          disabled={isEditingTitle}
          onClick={() => {
            setIsEditingTitle(true);
            hideContextMenu();
          }}
        >
          Изменить название
        </Item>
        <Item
          onClick={() =>
            season.update(season => {
              season.episodes.push(false);
            })
          }
        >
          Добавить серию
        </Item>
        <Item
          disabled={({ props: menuProps }) => menuProps === undefined}
          onClick={({ props: menuProps }: PredicateParams<ContextMenuProps>) => {
            if (menuProps !== undefined) {
              season.update(season => {
                season.episodes.splice(menuProps.episodeIndex, 1);
              });
            }
          }}
        >
          Удалить серию
        </Item>
        <Item onClick={() => addSeason()}>Добавить сезон</Item>
        <Item onClick={() => removeSeason()}>Удалить сезон</Item>
      </Menu>
    </div>
  );
};

export default SeasonView;
export type { Props };
