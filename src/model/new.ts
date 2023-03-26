import { ModelType } from "model";

const newModel = (): ModelType => {
  return { movies: [], tags: [] };
};

export { newModel };
