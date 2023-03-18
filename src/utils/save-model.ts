import { saveAs } from "file-saver";
import { isRight } from "fp-ts/lib/Either";
import { Model, ModelType } from "model";
import { pack, unpack } from "msgpackr";

import readFile from "./read-file";

const saveModel = (model: ModelType, fileName: string) => {
  const blob = new Blob([pack(Model.encode(model))], { type: "text/plain;charset=utf-8" });

  saveAs(blob, fileName + ".mjsave");
};

const loadModel = (callback: (model: ModelType, fileName: string) => void) => {
  readFile(file => {
    file
      .arrayBuffer()
      .then(buffer => {
        const model = Model.decode(unpack(new Uint8Array(buffer)));

        if (isRight(model)) {
          callback(model.right, file.name);
        }
      })
      .catch(reason => console.error(reason));
  }, ".mjsave");
};

export { loadModel, saveModel };
