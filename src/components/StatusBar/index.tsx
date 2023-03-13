import React from "react";

import styles from "./index.module.scss";

type Props = {
  fileName: string;
  changedSinceLastSave: boolean;
  watchedTitles: number;
  totalTitles: number;
  watchedEpisodes: number;
  totalEpisodes: number;
};

const StatusBar: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.StatusBar}>
      <div>
        {props.fileName}
        {props.changedSinceLastSave ? "*" : ""}
      </div>
      <div>
        {props.watchedTitles} / {props.totalTitles} просмотрено/тайтлов
      </div>
      <div>
        {props.watchedEpisodes} / {props.totalEpisodes} просмотрено/серий
      </div>
    </div>
  );
};

export default StatusBar;
export type { Props };
