import React, { useState } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import { BlobWithData } from "io-ts-types/blob-with-data";
import { SeasonType } from "model";
import ParentState from "parent-state";
import readFile from "utils/read-file";
import { v4 as uuidv4 } from "uuid";

import styles from "./index.module.scss";

type Props = {
  season: ParentState<SeasonType>;
  selected: boolean;
};

const SeasonView: React.FC<Props> = ({ season, selected }: Props) => {
  const [CONTEXT_MENU_ID] = useState(() => "SeasonViewContextMenu" + (uuidv4 as () => string)());

  const { show: showContextMenu } = useContextMenu({ id: CONTEXT_MENU_ID });

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

  return (
    <div
      className={`${styles.SeasonView} ${selected ? styles.selected : ""}`}
      onContextMenu={event => showContextMenu({ event: event })}
    >
      <p className={styles.Title}>{season.state.title}</p>
      <div className={styles.Episodes}>
        {season.state.episodes.map((isWatched, index) => (
          <div
            key={index}
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
      </Menu>
    </div>
  );
};

export default SeasonView;
export type { Props };
