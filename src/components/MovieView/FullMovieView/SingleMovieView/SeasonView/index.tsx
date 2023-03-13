import React from "react";
import { Season } from "model";
import ParentState from "parent_state";

import styles from "./index.module.scss";

type Props = {
  season: ParentState<Season>;
};

const SeasonView: React.FC<Props> = ({ season }: Props) => {
  return (
    <div className={styles.SeasonView}>
      <p className={styles.Title}>{season.state.title}</p>
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
