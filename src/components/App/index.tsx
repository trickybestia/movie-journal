import React, { useEffect, useState } from "react";
import { Filter, unwatched, watched } from "filters";
import useStateWithSetCallback from "hooks/use-context-with-set-callback";
import { DynamicContextMenuContext } from "hooks/use-dynamic-context-menu";
import produce from "immer";
import { ModelType, MovieType, SeasonType } from "model";
import { newModel } from "model/new";
import { getModelStats } from "model/stats";
import ParentState from "parent-state";
import { BlobUrlMapper, BlobUrlMapperContext } from "utils/blob-url-mapper";
import { loadModel, saveModel } from "utils/save-model";

import ContextMenu, { ContextMenuItemProps } from "components/ContextMenu";
import CompactMovieView from "components/MovieView/CompactMovieView";
import FullMovieView from "components/MovieView/FullMovieView";
import SidePanel from "components/SidePanel";
import StatusBar from "components/StatusBar";
import ToolBar, { Props as ToolBarProps } from "components/ToolBar";

import styles from "./index.module.scss";

const NEW_MODEL_FILE_NAME = "Новый файл";

const createSeason = (title: string): SeasonType => ({
  title: title,
  image: undefined,
  episodes: [true, true, true, true, false]
});

const createMovie = (title: string): MovieType => {
  const seasons = [];

  for (let i = 0; i != 3; i++) {
    seasons.push(createSeason(`Сезон ${i + 1}`));
  }

  return {
    title: title,
    description: "",
    seasons: seasons,
    mainPreviewSeasonIndex: undefined,
    tags: []
  };
};

const createModel = (): ModelType => {
  const model: ModelType = newModel();

  for (let i = 0; i < 10; i++) {
    model.movies.push(createMovie((i + 1).toString()));
  }

  return model;
};

const App: React.FC = () => {
  const [blobUrlMapper] = useState(() => new BlobUrlMapper());

  const setModelCallback = (model: ModelType) => {
    const previews: Set<Blob> = new Set();

    model.movies.forEach(movie =>
      movie.seasons.forEach(season => {
        if (season.image !== undefined) {
          previews.add(season.image.blob);
        }
      })
    );

    blobUrlMapper.update(previews);

    setChangedSinceLastSave(true);
  };

  const [model, setModel] = useStateWithSetCallback(createModel, setModelCallback);
  const [modelFileName, setModelFileName] = useState(NEW_MODEL_FILE_NAME);
  const [changedSinceLastSave, setChangedSinceLastSave] = useState(true);
  const [compactView, setCompactView] = useState(() => false);
  const [requestedContextMenuItems] = useState([] as ContextMenuItemProps[]);
  const [contextMenu, setContextMenu] = useState(undefined as JSX.Element | undefined);

  useEffect(() => {
    document.title = "Дневник фильмов - " + modelFileName;
  });

  const toolBarButtons: ToolBarProps["buttons"] = [
    {
      title: "Файл",
      items: [
        {
          kind: "button",
          title: "Создать",
          onClick: () => {
            setModel(newModel());
            setModelFileName(NEW_MODEL_FILE_NAME);
            setChangedSinceLastSave(true);
          }
        },
        {
          kind: "button",
          title: "Переименовать…",
          onClick: () => {
            const newFileName = prompt("Введите новое имя файла:", modelFileName);

            if (newFileName !== null) setModelFileName(newFileName);
          }
        },
        {
          kind: "button",
          title: "Открыть…",
          onClick: () => {
            loadModel((model, fileName) => {
              const fileNameWithoutExtension = fileName.split(".", 2)[0];

              setModel(model);
              setModelFileName(fileNameWithoutExtension);
              setChangedSinceLastSave(false);
            });
          }
        },
        {
          kind: "button",
          title: "Сохранить…",
          onClick: () => {
            saveModel(model, modelFileName);

            setChangedSinceLastSave(false);
          }
        }
      ]
    },
    {
      title: "Вид",
      items: [
        {
          kind: "checkbox",
          title: "Компактный вид",
          checked: compactView,
          onClick: () => setCompactView(!compactView)
        }
      ]
    }
  ];

  const getTags = (): string[] => {
    const result: Set<string> = new Set();

    model.movies.forEach(movie => {
      movie.tags.forEach(tag => {
        result.add(tag);
      });
    });

    return Array.from(result);
  };

  const MovieView = compactView ? CompactMovieView : FullMovieView;

  const [selectedFilters, setSelectedFilters] = useState(() => [watched, unwatched] as readonly Filter[]);

  return (
    <DynamicContextMenuContext.Provider
      value={items => {
        requestedContextMenuItems.push(...items);
      }}
    >
      <div
        onClick={() => setContextMenu(undefined)}
        className={styles.App}
        onContextMenu={event => {
          if (requestedContextMenuItems.length !== 0) {
            setContextMenu(
              <ContextMenu left={event.clientX} top={event.clientY} items={requestedContextMenuItems.slice()} />
            );
          }

          requestedContextMenuItems.length = 0;

          event.preventDefault();
        }}
      >
        <header>
          <ToolBar buttons={toolBarButtons} />
        </header>
        <div className={styles.MainWrapper}>
          <div className={styles.SidePanel}>
            <SidePanel tags={getTags()} selectedFilters={new ParentState(selectedFilters, setSelectedFilters)} />
          </div>
          <main>
            <BlobUrlMapperContext.Provider value={blobUrlMapper}>
              <MovieView
                key={modelFileName + (changedSinceLastSave ? "1" : "0")}
                filters={selectedFilters}
                movies={
                  new ParentState<readonly MovieType[]>(model.movies, newMovies =>
                    setModel(
                      produce(model, model => {
                        model.movies = newMovies.slice();
                      })
                    )
                  )
                }
              />
            </BlobUrlMapperContext.Provider>
          </main>
        </div>

        <footer>
          <StatusBar
            fileName={modelFileName}
            changedSinceLastSave={changedSinceLastSave}
            modelStats={getModelStats(model)}
          />
        </footer>
        {contextMenu}
      </div>
    </DynamicContextMenuContext.Provider>
  );
};

export default App;
