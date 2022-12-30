const webpackParams = {
  title:
    'Practice Locations of Washington University in St Louis Otolaryngology Graduates ',
  description:
    'Interactive map showing where Washington University/Barnes-Jewish Hospital Residency Program graduates are now practicing, along with current academic status',
  site_name:
    'Applets from Clinical Outcomes Research at Washington University in St Louis',
  url: 'https://outcomesresearch.github.io/alumni-map/',
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/alumni-map/' : '/',
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      Object.entries(webpackParams).forEach(([key, value]) => {
        args[0][key] = value
      })
      return args
    })
  },
}
