import * as t from "io-ts";
import { blobWithData } from "io-ts-types/blob-with-data";

const Season = t.exact(
  t.type({
    title: t.string,
    /**
     * Base64-encoded image with mime type.
     */
    image: t.union([blobWithData, t.undefined]),
    episodes: t.array(t.boolean)
  })
);

const Movie = t.exact(
  t.type({
    title: t.string,
    seasons: t.array(Season),
    mainPreviewSeasonIndex: t.union([t.number, t.undefined]),
    tags: t.array(t.string)
  })
);

const Model = t.exact(
  t.type({
    movies: t.array(Movie),
    tags: t.array(t.string)
  })
);

type SeasonType = t.TypeOf<typeof Season>;
type MovieType = t.TypeOf<typeof Movie>;
type ModelType = t.TypeOf<typeof Model>;

export { Model, Movie, Season };
export type { ModelType, MovieType, SeasonType };
