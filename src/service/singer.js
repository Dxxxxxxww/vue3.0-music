import { get } from './base'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetail(mid) {
  return get('/api/getSingerDetail', { mid })
}
