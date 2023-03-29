import React, { useState } from "react";
import useDynamicContextMenu from "hooks/use-dynamic-context-menu";
import { BlobWithData } from "io-ts-types/blob-with-data";
import { SeasonType } from "model";
import ParentState from "parent-state";
import readFile from "utils/read-file";

import styles from "./index.module.scss";

type Props = {
  season: ParentState<SeasonType>;
  selected: boolean;
  removeSeason: VoidFunction;
};

const SeasonView: React.FC<Props> = ({ season, selected, removeSeason }: Props) => {
  const { requestContextMenuItems } = useDynamicContextMenu();
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

  let title: JSX.Element;

  if (isEditingTitle) {
    title = (
      <input
        className={styles.Title}
        type="text"
        defaultValue={season.state.title}
        onBlur={event => {
          season.update(season => {
            season.title = event.currentTarget.value;
          });

          setIsEditingTitle(false);
        }}
      />
    );
  } else {
    title = <p className={styles.Title}>{season.state.title}</p>;
  }

  return (
    <div
      className={`${styles.SeasonView} ${selected ? styles.selected : ""}`}
      onContextMenu={() => {
        requestContextMenuItems([
          {
            name: "Изменить название",
            disabled: isEditingTitle,
            onClick: () => {
              setIsEditingTitle(true);
            }
          },
          {
            name: "Установить обложку",
            onClick: () => {
              setPreview();
            }
          },
          {
            name: "Удалить обложку",
            onClick: () => {
              season.update(season => {
                season.image = undefined;
              });
            }
          },
          {
            name: "Добавить серию",
            onClick: () => {
              season.update(season => {
                season.episodes.push(false);
              });
            }
          },
          { name: "Удалить сезон", onClick: () => removeSeason() }
        ]);
      }}
    >
      {title}

      <div className={styles.Episodes}>
        {season.state.episodes.map((isWatched, index) => (
          <div
            key={index}
            onContextMenu={() => {
              requestContextMenuItems([
                {
                  name: "Удалить серию",
                  onClick: () => {
                    season.update(season => {
                      season.episodes.splice(index, 1);
                    });
                  }
                }
              ]);
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
    </div>
  );
};

export default SeasonView;
export type { Props };
