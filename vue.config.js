module.exports = {
  publicPath: '/',
  assetsDir: 'static',
  productionSourceMap: false,
  configureWebpack: {
        devtool: 'source-map'
  },
  devServer:{
    sockHost: '127.0.0.1:8080',
    disableHostCheck: true,
  }
}