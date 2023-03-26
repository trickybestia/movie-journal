import React from "react";
import { Filter } from "filters";
import { MovieType } from "model";
import ParentState from "parent-state";

import CompactMovieView from "./CompactMovieView";
import FullMovieView from "./FullMovieView";

type Props = { movies: ParentState<readonly MovieType[]>; filters: readonly Filter[] };
type MovieView = React.FC<Props>;

export { CompactMovieView, FullMovieView };
export type { MovieView, Props };
