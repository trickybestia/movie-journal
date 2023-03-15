import produce from "immer";
import { Model, Movie, Season } from "model";
import { getModelStats } from "model/stats";
import ParentState from "parent_state";
import React, { useState } from "react";
import { loadModel, saveModel } from "utils/saveModel";
import CompactMovieView from "../MovieView/CompactMovieView";
import FullMovieView from "../MovieView/FullMovieView";
import StatusBar from "../StatusBar";
import ToolBar, { Props as ToolBarProps } from "../ToolBar";

import styles from "./index.module.scss";

const NEW_MODEL_FILE_NAME = "Новый файл";

const createSeason = (title: string): Season => ({
  title: title,
  image: undefined,
  episodes: [true, true, true, true, false]
});

const createMovie = (title: string): Movie => {
  const seasons = [];

  for (let i = 0; i != 3; i++) {
    seasons.push(createSeason(`Сезон ${i + 1}`));
  }

  return {
    title: title,
    seasons: seasons
  };
};

const createModel = (): Model => {
  const model: Model = { movies: [] };

  for (let i = 0; i < 10; i++) {
    model.movies.push(createMovie((i + 1).toString()));
  }

  return model;
};

const App: React.FC = () => {
  const [model, setModel] = useState(createModel);
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
        <MovieView
          movies={
            new ParentState(model.movies, newMovies =>
              setModel(
                produce(model => {
                  model.movies = newMovies;
                })
              )
            )
          }
          hideWatched={hideWatched}
        />
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
