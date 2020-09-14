const path = require('path')
const axios = require('axios')
const bodyParser = require('body-parser')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    proxy: {
      '/v1': {
        target: 'http://localhost:8000',
        secure: false
      }
    },
    before(app) {
      app.get('/api/getTopBanner', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        const jumpPrefixMap = {
          10002: 'https://y.qq.com/n/yqq/album/',
          10014: 'https://y.qq.com/n/yqq/playlist/',
          10012: 'https://y.qq.com/n/yqq/mv/v/'
        }

        axios
          .get(url, {
            headers: {
              referer: 'https://u.y.qq.com', // 表示请求来源
              host: 'u.y.qq.com' // 表示域名
            },
            params: req.query
          })
          .then(response => {
            response = response.data
            if (response.code === 0) {
              const slider = []
              const content = response.focus.data && response.focus.data.content
              if (content) {
                for (let i = 0; i < content.length; i++) {
                  const item = content[i]
                  const sliderItem = {}
                  sliderItem.id = item.id
                  if (item.type === 3002) {
                    sliderItem.linkUrl = item.jump_info.url + '.html'
                  } else {
                    sliderItem.linkUrl =
                      jumpPrefixMap[item.type] + item.jump_info.url + '.html'
                  }
                  sliderItem.picUrl = item.pic_info.url
                  slider.push(sliderItem)
                }
              }
              res.json({
                code: 0,
                data: {
                  slider
                }
              })
            } else {
              res.json(response)
            }
          })
          .catch(e => {
            console.log(e)
          })
      })

      app.get('/api/getDiscList', (req, res) => {
        const url =
          'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

        axios
          .get(url, {
            headers: {
              referer: 'https://u.y.qq.com/', // 表示请求来源
              host: 'u.y.qq.com' // 表示域名
            },
            params: req.query
          })
          .then(response => {
            res.json(response.data)
          })
          .catch(e => {
            console.log(e)
          })
      })

      app.post('/api/getPurlUrl', bodyParser.json(), function(req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios
          .post(url, req.body, {
            headers: {
              referer: 'https://y.qq.com/',
              origin: 'https://y.qq.com',
              'Content-type': 'application/x-www-form-urlencoded'
            }
          })
          .then(response => {
            res.json(response.data)
          })
          .catch(e => {
            console.log(e)
          })
      })

      app.get('/api/lyric', function(req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        axios
          .get(url, {
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            params: req.query
          })
          .then(response => {
            let ret = response.data
            if (typeof ret === 'string') {
              const reg = /^\w+\(({.+})\)$/
              const matches = ret.match(reg)
              if (matches) {
                ret = JSON.parse(matches[1])
              }
            }
            res.json(ret)
          })
          .catch(e => {
            console.log(e)
          })
      })
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@views', resolve('src/views'))
      .set('@components', resolve('src/components'))
      .set('@assets', resolve('src/assets'))
      .set('@styles', resolve('src/styles'))
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
