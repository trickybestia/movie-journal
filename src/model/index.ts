import * as t from "io-ts";

const Season = t.exact(
  t.type({
    title: t.string,
    /**
     * Base64-encoded image with mime type.
     */
    image: t.union([t.string, t.undefined]),
    episodes: t.array(t.boolean)
  })
);

const Movie = t.exact(
  t.type({
    title: t.string,
    seasons: t.array(Season)
  })
);

const Model = t.exact(
  t.type({
    movies: t.array(Movie)
  })
);

type SeasonType = t.TypeOf<typeof Season>;
type MovieType = t.TypeOf<typeof Movie>;
type ModelType = t.TypeOf<typeof Model>;

export { Model, Movie, Season };
export type { ModelType, MovieType, SeasonType };
