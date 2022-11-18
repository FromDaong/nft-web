module.exports = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          removeViewBox: true, // https://github.com/svg/svgo/issues/1128
          sortAttrs: true,
          removeOffCanvasPaths: true,
        },
      },
    },
  ],
};
