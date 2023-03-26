import { MovieType } from "model";

import unwatched from "./unwatched";
import watched from "./watched";
import withTag from "./with_tag";

type Filter = (movie: MovieType) => boolean;

export { unwatched, watched, withTag };
export type { Filter };
