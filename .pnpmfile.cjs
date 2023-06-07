module.exports = {
  hooks: {
    readPackage: (pkg) => {
      if (pkg.name === "node-fetch") {
        pkg.dependencies["encoding"] = "0.1.13";
      }
      return pkg;
    },
  },
};
