import { Filter } from "filters";
import { MovieType } from "model";

const filters: Map<string, Filter> = new Map();

const withTagInternal = (tag: string, movie: MovieType): boolean => movie.tags.indexOf(tag) !== -1;

const withTag = (tag: string): Filter => {
  let filter = filters.get(tag);

  if (filter === undefined) {
    filter = movie => withTagInternal(tag, movie);
    filters.set(tag, filter);
  }

  return filter;
};

export default withTag;
