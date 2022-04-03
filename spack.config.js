const { config } = require("@swc/core/spack");
const path = require("path");

module.exports = config({
  entry: {
    bundle: path.resolve(__dirname, "lib", "index.ts"),
  },

  output: {
    path: path.resolve(__dirname, "dist"),
  },
})
