import { get } from '@/service/base'

// 歌词映射 mid: lyric
const lyricMap = {}

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map(song => song.mid)
  }).then(res => {
    const map = res.map
    return songs
      .map(song => {
        song.url = map[song.mid]
        return song
      })
      .filter(song => song.url.includes('vkey'))
  })
}

export function getLyric(song) {
  // 不同歌曲存在 mid （不同演唱版本）相同的情况，所以将歌词缓存下来，节约请求
  const lyric = lyricMap[song.mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }
  return get('/api/getLyric', {
    mid: song.mid
  }).then(result => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[song.mid] = lyric
    return lyric
  })
}
