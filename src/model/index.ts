type Model = {
  movies: Movie[];
};

type Movie = {
  title: string;
  seasons: Season[];
};

type Season = {
  title: string;
  /**
   * Base64-encoded image with mime type.
   */
  image: string | undefined;
  episodes: boolean[];
};

export type { Model, Movie, Season };
