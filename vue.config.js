module.exports = {
  css: {
    extract: false
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: {
    entry: './example/main.js',
    output: {
      libraryExport: 'default'
    }
  }
}
