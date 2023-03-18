const readFile = (callback: (file: File) => void, accept: string) => {
  const fileInput = document.createElement("input");

  fileInput.setAttribute("type", "file");
  fileInput.setAttribute("accept", accept);

  fileInput.onchange = () => {
    const file = fileInput.files![0];

    if (file) {
      callback(file);
    }
  };

  fileInput.click();
};

export default readFile;
