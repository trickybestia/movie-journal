import React, { useState } from "react";
import { Filter, unwatched, watched } from "filters";
import produce from "immer";
import { ModelType, MovieType, SeasonType } from "model";
import { newModel } from "model/new";
import { getModelStats } from "model/stats";
import ParentState from "parent-state";
import { BlobUrlMapper, BlobUrlMapperContext } from "utils/blob-url-mapper";
import { loadModel, saveModel } from "utils/save-model";
import useStateWithSetCallback from "utils/use-context-with-set-callback";

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
  };

  const [model, setModel] = useStateWithSetCallback(createModel, setModelCallback);
  const [modelFileName, setModelFileName] = useState(NEW_MODEL_FILE_NAME);
  const [changedSinceLastSave, setChangedSinceLastSave] = useState(true);
  const [compactView, setCompactView] = useState(() => false);

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

  const MovieView = compactView ? CompactMovieView : FullMovieView;

  const [selectedFilters, setSelectedFilters] = useState(() => [watched, unwatched] as readonly Filter[]);

  return (
    <div className={styles.App}>
      <header>
        <ToolBar buttons={toolBarButtons} />
      </header>
      <div className={styles.MainWrapper}>
        <div className={styles.SidePanel}>
          <SidePanel
            tags={model.tags}
            selectedFilters={new ParentState(selectedFilters, setSelectedFilters)}
            addTag={tag => {
              if (model.tags.indexOf(tag) === -1)
                setModel(
                  produce(model, model => {
                    model.tags.push(tag);
                  })
                );
            }}
            removeTag={tag => {
              const tagIndex = model.tags.indexOf(tag);

              if (tagIndex !== -1) {
                setModel(
                  produce(model, model => {
                    model.tags.splice(tagIndex, 1);

                    model.movies.forEach(movie => {
                      const movieTagIndex = movie.tags.indexOf(tag);

                      if (movieTagIndex !== -1) movie.tags.splice(movieTagIndex, 1);
                    });
                  })
                );
              }
            }}
          />
        </div>
        <main>
          <BlobUrlMapperContext.Provider value={blobUrlMapper}>
            <MovieView
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
    </div>
  );
};

export default App;
