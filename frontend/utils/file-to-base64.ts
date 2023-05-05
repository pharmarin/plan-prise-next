const convertToBase64 = (file: Blob) => {
  return new Promise<string | null>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result as string | null);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export default convertToBase64;
