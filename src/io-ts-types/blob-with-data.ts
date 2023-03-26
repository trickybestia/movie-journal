import * as t from "io-ts";

type EncodedBlob = {
  type: string;
  data: Uint8Array;
};

class BlobWithData {
  public readonly blob: Blob;
  public readonly encoded: EncodedBlob;

  public constructor(encoded: EncodedBlob) {
    this.encoded = encoded;

    this.blob = new Blob([encoded.data], { type: encoded.type });
  }
}

const isEncodedBlob = (u: unknown): u is EncodedBlob => {
  const encodedBlob = u as EncodedBlob;

  return (
    typeof encodedBlob === "object" &&
    typeof encodedBlob["type"] === "string" &&
    encodedBlob["data"] instanceof Uint8Array
  );
};

const validateBlob: t.Validate<unknown, BlobWithData> = (u, c) => {
  if (isEncodedBlob(u)) {
    return t.success(new BlobWithData({ data: u.data, type: u.type }));
  }

  return t.failure(u, c);
};

const encodeBlob = (blob: BlobWithData): EncodedBlob => {
  return blob.encoded;
};

const blobWithData: t.Type<BlobWithData, EncodedBlob> = new t.Type(
  "Blob",
  (u): u is BlobWithData => u instanceof BlobWithData,
  validateBlob,
  encodeBlob
);

export { BlobWithData, blobWithData };
