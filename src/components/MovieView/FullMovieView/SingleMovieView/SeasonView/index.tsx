import React from "react";
import { SeasonType } from "model";
import ParentState from "parent-state";
import { BlobWithData } from "utils/blob-with-data";
import readFile from "utils/read-file";

import styles from "./index.module.scss";

type Props = {
  season: ParentState<SeasonType>;
};

const SeasonView: React.FC<Props> = ({ season }: Props) => {
  const setPreviewButton = () => {
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
    <div className={styles.SeasonView}>
      <p className={styles.Title}>{season.state.title}</p>
      <div className={styles.SetPreviewButton} onClick={() => setPreviewButton()}></div>
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
  );
};

export default SeasonView;
export type { Props };
