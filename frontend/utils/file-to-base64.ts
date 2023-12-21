const convertToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      const result = fileReader.result;

      if (typeof result !== "string") {
        return reject();
      }

      return resolve(result);
    };

    fileReader.onerror = (error) => {
      return reject(error);
    };
  });
};

export default convertToBase64;
