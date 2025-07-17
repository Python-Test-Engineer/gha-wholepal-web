const useFile = () => {
  const getExtension = (fileName: string) =>
    fileName.split(".").pop().toLowerCase();

  return {
    getExtension,
  };
};

export default useFile;
