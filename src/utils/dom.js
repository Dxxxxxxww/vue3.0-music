// 我自己的做法是用 classList
// const addClass = (el, className) => {
//   if (hasClass(el, className)) {
//     return
//   }
//   el.classList.add(className)
// }

// const hasClass = (el, className) => {
//   return el.classList.contains(className)
// }

const addClass = (el, className) => {
  if (hasClass(el, className)) {
    return
  }
  const newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

const hasClass = (el, className) => {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

const getDomData = (el, name) => {
  const prefix = 'data-'
  return el.getAttribute(prefix + name)
}
const setDomData = (el, name, val) => {
  const prefix = 'data-'
  if (val) {
    el.setAttribute(prefix + name, val)
    return true
  } else {
    return false
  }
}

export { addClass, hasClass, getDomData, setDomData }
