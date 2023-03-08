import React, { useState } from "react";
import ToolBar, { Props as ToolBarProps } from "./ToolBar";

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

const App: React.FC = () => {
  const [compactView, setCompactView] = useState(() => false);
  const [hideWatched, setHideWatched] = useState(() => false);

  const toolbarButtons = getToolBarButtons(
    compactView,
    setCompactView,
    hideWatched,
    setHideWatched
  );

  return (
    <div>
      <ToolBar buttons={toolbarButtons} />
    </div>
  );
};

export default App;
