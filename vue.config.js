const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@views', resolve('src/views'))
      .set('@components', resolve('src/components'))
      .set('@assets', resolve('src/assets'))
      .set('styles', resolve('src/styles'))
    // 配置引入字体
    // config.module.rule([
    //   {
    //     test: /\.(woff2?|eot|ttf|otf)(\?.*)$/,
    //     loder: 'url-loader',
    //     options: {
    //       limit: 10000
    //     }
    //   }
    // ])
  }
  // 配置引入字体
  // configureWebpack: {
  //   plugins: [],
  //   module: {
  //     rules: [
  //       {
  //         test: /\.(woff2?|eot|ttf|otf)(\?.*)$/,
  //         use: [
  //           {
  //             loader: 'url-loader',
  //             options: {
  //               limit: 10000
  //             }
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // }
}
