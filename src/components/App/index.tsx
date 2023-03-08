import React, { useState } from "react";
import StatusBar, { Props as StatusBarProps } from "../StatusBar";
import ToolBar, { Props as ToolBarProps } from "../ToolBar";
import styles from "./index.module.scss";

const getToolBarButtons = (
  compactView: boolean,
  setCompactView: (value: boolean) => void,
  hideWatched: boolean,
  setHideWatched: (value: boolean) => void
): ToolBarProps["buttons"] => [
  {
    title: "Файл",
    items: [
      { kind: "button", title: "Создать", onClick: () => {} },
      { kind: "button", title: "Открыть…", onClick: () => {} },
      { kind: "button", title: "Сохранить…", onClick: () => {} }
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

const getStatusBarProps = (): StatusBarProps => ({
  fileName: "pog",
  changedSinceLastSave: true,
  watchedTitles: 100,
  totalTitles: 150,
  watchedEpisodes: 500,
  totalEpisodes: 700
});

const App: React.FC = () => {
  const [compactView, setCompactView] = useState(() => false);
  const [hideWatched, setHideWatched] = useState(() => false);

  const toolBarButtons = getToolBarButtons(
    compactView,
    setCompactView,
    hideWatched,
    setHideWatched
  );

  const statusBarProps = getStatusBarProps();

  return (
    <div className={styles.App}>
      <header>
        <ToolBar buttons={toolBarButtons} />
      </header>
      <main style={{ height: "auto" }}>
        <div style={{ height: "100%" }}></div>
      </main>
      <footer>
        <StatusBar {...statusBarProps} />
      </footer>
    </div>
  );
};

export default App;
