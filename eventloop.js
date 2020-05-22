console.log('start')
async function getName(params) {
  console.log('aoliao', new Date().getSeconds())
  // await async2()
  await setTimeout(() => {
    console.log('name', new Date().getSeconds())
  }, 12000)
  console.log('wahaha')
  await getSleep()
  console.log('jianlibao', new Date().getSeconds())
  await setTimeout(() => {
    console.log('name2', new Date().getSeconds())
  }, 2000)
}
async function getSleep() {
  const res = await axios.get('/v1/token/sleep')
  console.log(res)
}
function getAge() {
  getName()
  Promise.resolve('aaa').then(res => {
    console.log(res)
  })
  console.log('age')
}
getAge()
// 第一轮
// 执行栈  start, aoliao, age
// 微任务 wahaha以及后续, aaa
// 宏任务 (12秒后进入宏任务队列)name

// 第二轮
// 执行栈 wahaha
// 微任务 aaa, axios请求及后面代码
// 宏任务 (12秒后进入宏任务队列)name

// 第三轮
// 执行栈 aaa,
// 微任务 axios请求及后面代码
// 宏任务 (12秒后进入宏任务队列)name

// 第四轮
// 执行栈 axios请求(等待请求返回结果，这不能算是await阻塞线程)
// 微任务 axios后面代码(axios返回的是promise所以是promise.then微任务)
// 宏任务 (12秒后进入宏任务队列)name

// 第五轮
// 执行栈 打印 axios 返回值, jianlibao
// 微任务
// 宏任务 (12秒后进入宏任务队列)name , (2秒后进入宏任务队列)name2

console.log('start')
async function getName(params) {
  console.log('aoliao', new Date().getSeconds())
  // await async2()
  await getSleep()
  await setTimeout(() => {
    console.log('name', new Date().getSeconds())
  }, 12000)
  console.log('wahaha')
  console.log('jianlibao', new Date().getSeconds())
  await setTimeout(() => {
    console.log('name2', new Date().getSeconds())
  }, 2000)
}
async function getSleep() {
  const res = await axios.get('/v1/token/sleep')
  console.log(res)
}
function getAge() {
  getName()
  Promise.resolve('aaa').then(res => {
    console.log(res)
  })
  console.log('age')
}
getAge()
// start
// aoliao 3
// 在这里发送了请求， 如果 await 阻塞线程了的话，下面的 同步代码 age 就不会执行，微任务 aaa 也不会执行
// age
// aaa
// {data: {…}, status: 200, statusText: "OK", headers: {…}, config: {…}, …}
// wahaha
// jianlibao 8
// name2 10
// name 20

// settimeout 和 http 请求都是等打到一定条件后才将回到放入异步任务队列。如下列代码中的 wahaha 和 aaa 的执行顺序
console.log('start')
async function getName(params) {
  console.log('aoliao', new Date().getSeconds())
  // await async2()
  await getSleep()
  // await setTimeout(() => {
  //   console.log('name', new Date().getSeconds())
  // }, 12000)
  console.log('wahaha')
  console.log('jianlibao', new Date().getSeconds())
  await setTimeout(() => {
    console.log('name2', new Date().getSeconds())
  }, 2000)
}
async function getSleep() {
  const res = await axios.get('/v1/token/sleep')
  console.log(res)
}
function getAge() {
  getName()
  Promise.resolve('aaa').then(res => {
    console.log(res)
  })
  console.log('age')
}
getAge()
// start
// aoliao 1
// age
// aaa
// {data: {…}, status: 200, statusText: "OK", headers: {…}, config: {…}, …}
// wahaha
// jianlibao 6
// name2 8
