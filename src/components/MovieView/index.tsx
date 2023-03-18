import React from "react";
import { MovieType } from "model";
import ParentState from "parent-state";

import CompactMovieView from "./CompactMovieView";
import FullMovieView from "./FullMovieView";

type Props = { movies: ParentState<MovieType[]>; hideWatched: boolean };
type MovieView = React.FC<Props>;

export { CompactMovieView, FullMovieView };
export type { MovieView, Props };
