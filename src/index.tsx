import React from "react";
import ReactDOM from "react-dom/client";
import { enableMapSet } from "immer";

import App from "components/App";

import "purecss";
import "./index.scss";

enableMapSet();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
