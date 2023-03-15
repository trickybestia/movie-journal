import { ModelStats } from "model/stats";
import React from "react";

import styles from "./index.module.scss";

type Props = {
  fileName: string;
  changedSinceLastSave: boolean;
  modelStats: ModelStats;
};

const StatusBar: React.FC<Props> = ({ fileName, changedSinceLastSave, modelStats }: Props) => {
  return (
    <div className={styles.StatusBar}>
      <div>
        {fileName}
        {changedSinceLastSave ? " *" : ""}
      </div>
      <div>
        {modelStats.watchedMovies} / {modelStats.totalMovies} просмотрено/тайтлов
      </div>
      <div>
        {modelStats.watchedEpisodes} / {modelStats.totalEpisodes} просмотрено/серий
      </div>
    </div>
  );
};

export default StatusBar;
export type { Props };
