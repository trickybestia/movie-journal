import { ModelType, MovieType } from "model";

const newModel = (): ModelType => {
  return { movies: [] };
};

const newMovie = (): MovieType => {
  return { title: "Новый тайтл", description: "", seasons: [], mainPreviewSeasonIndex: undefined, tags: [] };
};

export { newModel, newMovie };
