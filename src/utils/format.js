export const format = interval => {
  interval = interval | 0
  const min = (interval / 60) | 0
  const sec = padLeft(interval % 60)
  return `${min}:${sec}`
}

export const padLeft = (num, n = 2) => {
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}
