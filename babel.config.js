module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  chainWebpack: (config) => {
    config.plugin("copy").tap((opts) => {
      opts[0][0].ignore.push({ glob: "us_postal_codes.csv" });
      return opts;
    });
  },
};
