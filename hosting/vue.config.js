const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, 'src/assets'),
        '~': path.resolve(__dirname, 'src/_services')
      }
    }
  },
  runtimeCompiler: true
}
