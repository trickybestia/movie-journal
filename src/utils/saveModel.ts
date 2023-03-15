import { saveAs } from "file-saver";
import { isRight } from "fp-ts/lib/Either";
import { Model, ModelType } from "model";

const saveModel = (model: ModelType, fileName: string) => {
  const blob = new Blob([JSON.stringify(model)], { type: "text/plain;charset=utf-8" });

  saveAs(blob, fileName + ".json");
};

const loadModel = (callback: (model: ModelType, fileName: string) => void) => {
  const fileInput = document.createElement("input");

  fileInput.setAttribute("type", "file");

  fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files![0];

    if (file) {
      file
        .text()
        .then(text => {
          const model = Model.decode(JSON.parse(text));

          if (isRight(model)) {
            callback(model.right, file.name);
          }
        })
        .catch(reason => console.error(reason));
    }
  };
};

export { loadModel, saveModel };
