import React, { createContext } from "react";

class BlobUrlMapper {
  private urls: Map<Blob, string> = new Map();

  public getUrl(blob: Blob): string {
    const url = this.urls.get(blob);

    if (url === undefined) {
      throw new Error("can't find url for specified blob");
    }

    return url;
  }

  public update(blobs: Set<Blob>) {
    const addedBlobs: Blob[] = [];

    blobs.forEach(blob => {
      if (!this.urls.has(blob)) {
        addedBlobs.push(blob);
      }
    });

    const removedBlobs: Blob[] = [];

    this.urls.forEach((url, blob) => {
      if (!blobs.has(blob)) {
        URL.revokeObjectURL(url);

        removedBlobs.push(blob);
      }
    });

    removedBlobs.forEach(blob => {
      this.urls.delete(blob);
    });
    addedBlobs.forEach(blob => {
      this.urls.set(blob, URL.createObjectURL(blob));
    });
  }
}

const BlobUrlMapperContext: React.Context<BlobUrlMapper | undefined> = createContext(
  undefined as BlobUrlMapper | undefined
);

export { BlobUrlMapper, BlobUrlMapperContext };
