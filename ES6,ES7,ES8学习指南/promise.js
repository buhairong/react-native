var waitSecond = new Promise(function (resolve, reject) {
    setTimeout(resolve, 1000)
})

waitSecond
    .then(function(){
        console.log('hello')
    })
    .then(function(){
        console.log('Hi')
    })

//-----------------------------------------------------------------------------------------------------------------------
// 异步函数本身会返回一个Promise,所以我们可以通过then来获取异步函数的返回值
/*async function charCountAdd(data1, data2) {
    const d1 = await charCount(data1)
    const d2 = await charCount(data2)
    return d1 + d2
}*/

charCountAdd('Hello', 'Hi').then(console.log)

function charCount(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data.length)
        }, 1000)
    })
}

/*
对于上述的例子，我们调用await两次，每次都是等待1秒，一共是2秒，效率比较低，
而且两次await的调用并没有依赖关系，那能不能让其发布并执行呢，答案是可以的，
接下来我们通过Promise all来实现await的并发调用
*/
async function charCountAdd(data1, data2) {
    const [d1, d2] = await Promise.all([charCount(data1), charCount(data2)])
    return d1 + d2
}
/*
* 通过上述代码我们实现了两次charCount的并发调用，Promise.all接受的是一个数组，
* 它可以将数组中的promise对象并发执行
* */
