import React from "react";
import { Movie } from "model";
import ParentState from "parent_state";
import CompactMovieView from "./CompactMovieView";
import FullMovieView from "./FullMovieView";

type Props = { movies: ParentState<Movie[]>; hideWatched: boolean };
type MovieView = React.FC<Props>;

export { CompactMovieView, FullMovieView };
export type { Props, MovieView };
