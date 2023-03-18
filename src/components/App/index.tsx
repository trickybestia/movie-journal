import React, { useState } from "react";
import produce from "immer";
import { ModelType, MovieType, SeasonType } from "model";
import { getModelStats } from "model/stats";
import ParentState from "parent-state";
import { BlobUrlMapper, BlobUrlMapperContext } from "utils/blob-url-mapper";
import { loadModel, saveModel } from "utils/save-model";
import useStateWithSetCallback from "utils/use-context-with-set-callback";

import CompactMovieView from "components/MovieView/CompactMovieView";
import FullMovieView from "components/MovieView/FullMovieView";
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
    seasons: seasons,
    mainPreviewSeasonIndex: undefined
  };
};

const createModel = (): ModelType => {
  const model: ModelType = { movies: [] };

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
  };

  const [model, setModel] = useStateWithSetCallback(createModel, setModelCallback);
  const [modelFileName, setModelFileName] = useState(NEW_MODEL_FILE_NAME);
  const [changedSinceLastSave, setChangedSinceLastSave] = useState(true);
  const [compactView, setCompactView] = useState(() => false);
  const [hideWatched, setHideWatched] = useState(() => false);

  const toolBarButtons: ToolBarProps["buttons"] = [
    {
      title: "Файл",
      items: [
        {
          kind: "button",
          title: "Создать",
          onClick: () => {
            setModel({ movies: [] });
            setModelFileName(NEW_MODEL_FILE_NAME);
            setChangedSinceLastSave(true);
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
        },
        {
          kind: "checkbox",
          title: "Скрыть просмотренные",
          checked: hideWatched,
          onClick: () => setHideWatched(!hideWatched)
        }
      ]
    }
  ];

  const MovieView = compactView ? CompactMovieView : FullMovieView;

  return (
    <div className={styles.App}>
      <header>
        <ToolBar buttons={toolBarButtons} />
      </header>
      <main>
        <BlobUrlMapperContext.Provider value={blobUrlMapper}>
          <MovieView
            movies={
              new ParentState(model.movies, newMovies =>
                setModel(
                  produce(model, model => {
                    model.movies = newMovies;
                  })
                )
              )
            }
            hideWatched={hideWatched}
          />
        </BlobUrlMapperContext.Provider>
      </main>
      <footer>
        <StatusBar
          fileName={modelFileName}
          changedSinceLastSave={changedSinceLastSave}
          modelStats={getModelStats(model)}
        />
      </footer>
    </div>
  );
};

export default App;
