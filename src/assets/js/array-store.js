import storage from 'good-storage'

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, val, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function save(item, key, compare, maxLen) {
  const itemList = storage.get(key, [])
  insertArray(itemList, item, compare, maxLen)
  storage.set(key, itemList)
  return itemList
}

export function remove(item, key, compare) {
  const itemList = storage.get(key, [])
  deleteFromArray(itemList, item, compare)
  storage.set(key, itemList)
  return itemList
}

export function clear(key) {
  storage.remove(key)
  return []
}

export function load(key) {
  return storage.get(key, [])
}
