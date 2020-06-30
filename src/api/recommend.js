import axios from 'axios'
// import jsonp from '@/utils/jsonp'
import { commonParams } from '@/config/config'
import { HttpCode } from '@/lib/enum'

const { ERR_OK } = HttpCode
const debug = process.env.NODE_ENV !== 'production'

/**
 * @description 获取轮播图数据
 */
const getRecommend = function() {
  const url = debug
    ? '/api/getTopBanner'
    : 'http://ustbhuangyi.com/music/api/getTopBanner'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq.json',
    hostUin: 0,
    needNewCode: 0,
    inCharset: 'utf8',
    format: 'json',
    '-': 'recom' + (Math.random() + '').replace('0.', ''),
    data: {
      comm: { ct: 24 },
      category: {
        method: 'get_hot_category',
        param: { qq: '' },
        module: 'music.web_category_svr'
      },
      recomPlaylist: {
        method: 'get_hot_recommend',
        param: { async: 1, cmd: 2 },
        module: 'playlist.HotRecommendServer'
      },
      playlist: {
        method: 'get_playlist_by_category',
        param: { id: 8, curPage: 1, size: 40, order: 5, titleid: 8 },
        module: 'playlist.PlayListPlazaServer'
      },
      new_song: {
        module: 'newsong.NewSongServer',
        method: 'get_new_song_info',
        param: { type: 5 }
      },
      new_album: {
        module: 'newalbum.NewAlbumServer',
        method: 'get_new_album_info',
        param: { area: 1, sin: 0, num: 20 }
      },
      new_album_tag: {
        module: 'newalbum.NewAlbumServer',
        method: 'get_new_album_area',
        param: {}
      },
      toplist: {
        module: 'musicToplist.ToplistInfoServer',
        method: 'GetAll',
        param: {}
      },
      focus: {
        module: 'QQMusic.MusichallServer',
        method: 'GetFocus',
        param: {}
      }
    }
  })

  // return jsonp(url, data, config.options)
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return res.data
      // return Promise.reject(res.data)
      // 这里的 reject可以在下面 catch 住，也可以在 .vue 中 catch，但是在下面 catch住的话， .vue 里的 then 中处理函数如果访问了 res 中的内容就会报错 TypeError: Cannot read property 'code' of undefined, 这样的话，.vue 里还是需要一个 catch
      // 所以还是在 .vue 里 catch 的好，不报错，也符合逻辑(api 就纯粹是 model 层，不带有 view)。

      // if (res.code === 0) {
      // } else {
      // }
      // 展开一下，如果在 api 中进行判断接口是否正常返回，如果正常就返回 Promise.resolve() 不正常返回 Promise.reject()
      // 这样在 .vue 文件里就可以在 then 中进行 正确的判断， catch 里进行 错误提示(这种处理方式感觉 api 就不够纯粹，又感觉 res.code 的判断本来就应该在这里进行，.vue 文件只接受数据，不管是正常数据还是不正常数据。)
      // 但是如果 api 接口直接返回 res.data 的话，在 .vue 文件里进行 res.code 的判断，那么接口是否正常返回的判断，业务进行还是错误提示都要在 then 里进行处理。(这种方式的话 api 都是返回数据，比较 ”纯粹“？)。具体哪种方式更好不好说。
      // --删除--个人比较喜欢 code 在这里判断--删除--
    })
  // .catch(rej => {
  //   console.log('rej', rej)
  // })
}

/**
 * @description 获取歌单列表
 */
const getDiscList = function() {
  const url = debug
    ? '/api/getDiscList'
    : 'http://ustbhuangyi.com/music/api/getTopBanner'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    format: 'json',
    rnd: Math.random()
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      if (res.data.code === ERR_OK) {
        return Promise.resolve(res.data)
      }
      return Promise.reject(res.data)
    })
}

export { getRecommend, getDiscList }
