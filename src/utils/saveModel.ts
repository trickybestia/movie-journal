import { saveAs } from "file-saver";
import { Model } from "model";

const saveModel = (model: Model, fileName: string) => {
  const blob = new Blob([JSON.stringify(model)], { type: "text/plain;charset=utf-8" });

  saveAs(blob, fileName + ".json");
};

const loadModel = (callback: (model: Model, fileName: string) => void) => {
  const fileInput = document.createElement("input");

  fileInput.setAttribute("type", "file");

  fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files![0];

    if (file) {
      file
        .text()
        .then(text => {
          callback(JSON.parse(text) as Model, file.name);
        })
        .catch(reason => console.error(reason));
    }
  };
};

export { saveModel, loadModel };
