export const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const shuffle = list => {
  const _list = list.slice()
  for (let i = 0; i < _list.length; i++) {
    const j = getRandomInt(0, i)
    const temp = _list[i]
    _list[i] = _list[j]
    _list[j] = temp
  }
  return _list
}
