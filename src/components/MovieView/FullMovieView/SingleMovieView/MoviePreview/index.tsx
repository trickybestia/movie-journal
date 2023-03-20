import React, { useContext, useState } from "react";
import { MovieType } from "model";
import ParentState from "parent-state";
import { BlobUrlMapperContext } from "utils/blob-url-mapper";

import styles from "./index.module.scss";

type Props = {
  movie: ParentState<MovieType>;
};

type ImageKind = "tall" | "wide";

const MoviePreview: React.FC<Props> = ({ movie }: Props) => {
  const blobUrlMapper = useContext(BlobUrlMapperContext)!;

  const [lastSelectedPreviewIndex, setLastSelectedPreviewIndex] = useState(movie.state.mainPreviewSeasonIndex);
  const [imageKind, setImageKind] = useState("wide" as ImageKind);

  let validPreviewIndex: number | undefined = lastSelectedPreviewIndex;

  if (
    (lastSelectedPreviewIndex === undefined && movie.state.mainPreviewSeasonIndex !== undefined) ||
    (lastSelectedPreviewIndex !== undefined && movie.state.seasons[lastSelectedPreviewIndex] === undefined)
  ) {
    validPreviewIndex = movie.state.mainPreviewSeasonIndex;
  }

  let previewImageSrc: string | undefined = undefined;

  if (validPreviewIndex !== undefined) {
    previewImageSrc = blobUrlMapper.getUrl(movie.state.seasons[validPreviewIndex].image!.blob);
  }

  return (
    <div className={styles.MoviePreview}>
      <div
        className={`${styles.ImageWrapper} ${imageKind === "tall" ? styles.TallImageWrapper : styles.WideImageWrapper}`}
      >
        <img
          className={`${styles.Image} ${previewImageSrc === undefined ? styles.ImageEmpty : ""} ${
            imageKind === "tall" ? styles.TallImage : styles.WideImage
          }`}
          onLoad={event => {
            if (event.currentTarget.naturalWidth >= event.currentTarget.naturalHeight * 0.7) {
              setImageKind("wide");
            } else {
              setImageKind("tall");
            }
          }}
          src={previewImageSrc}
        ></img>
      </div>
      <div className={styles.MovieSelector}>
        {movie.state.seasons.map(
          (season, index) =>
            season.image && (
              <div
                key={index}
                className={`${styles.MovieSelectorItem} ${
                  movie.state.mainPreviewSeasonIndex === index ? styles.MovieSelectorItemMain : ""
                }`}
                onClick={() => setLastSelectedPreviewIndex(index)}
                onDoubleClick={() =>
                  movie.update(movie => {
                    movie.mainPreviewSeasonIndex = index;
                  })
                }
              >
                {
                  <div
                    className={`${styles.MovieSelectorItemDot} ${
                      index === validPreviewIndex ? styles.MovieSelectorItemSelectedDot : ""
                    }`}
                  ></div>
                }
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default MoviePreview;
export type { Props };
