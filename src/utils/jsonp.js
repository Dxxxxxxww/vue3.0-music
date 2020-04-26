import originJSONP from 'jsonp'

const jsonp = function(url, data, option) {
  // 判断 url 是否含有 '?' 如果有，就表示已经有拼接的k-v了，就需要加 '&'，没有就拼 '?'
  url += (url.includes('?') ? '&' : '?') + param(url, data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
/**
 * @description 将 data 拼接到 url 中
 * @param {*} data 传递的参数
 * @returns {*} url
 */
const param = function(data) {
  let url = ''
  for (const key in data) {
    const value = data[key] !== undefined ? data[key] : ''
    url += `&${key}=${encodeURIComponent(value)}`
  }
  // 截取最开始的 '&' 符号
  return url ? url.substr(1) : ''
}

export default jsonp
