网络请求是开发APP必不可少的一部分，比如获取用户订单数据，获取商品列表，提交表单等等都离不了网络请求，那么在RN中如何进行
网络请求呢？

    RN官方推荐我们在RN中用Fetch进行网络请求

# 什么是Fetch

Fetch API提供了一个JavaScript接口，用于进行网络操作，例如请求和响应。它还提供了一个全局fetch()方法，该方法提供了一种
简单，合理的方式来跨网络异步获取资源。

    React Native引入了Fetch,我们可以在RN中使用全局fetch()方法进行网络请求，并且不需要自己做额外的导入。

做前端开发的小伙伴对XMLHttpRequest一定都不陌生，Fetch可以与XMLHttpRequest相媲美，并且比XMLHttpRequest提供了更加强大以及
灵活的特性。

JavaScript通过XMLHttpRequest(XHR)来执行异步请求，这个方式已经存在了很长一段时间。虽说它很有用，但它不是最佳API。它在设计
上不符合职责分离原则，将输入、输出和用事件来跟踪的状态混杂在一个对象里。而且，基于这种事件的模型，与最近JavaScript流行的
Promise，以及基于生成器的异步编程模型不太搭。

    有一点需要注意的是：fetch规范与jQuery.ajax()主要有两种方式的不同，牢记：

    * 当接收到一个代表错误的HTTP状态码时，从fetch()返回的Promise不会被标记为reject,即使该HTTP响应的状态码是404或500。
      相反，它会将Promise状态标记为resolve(但是会将resolve的返回值的ok属性设置为false),仅当网络故障时或请求被阻止时，
      才会标记为reject
    * 默认情况下，fetch不会从服务端发送或接收任何cookies，如果站点依赖于用户session,则会导致未经认证的请求（要发
      送cookies,必须设置credentials选项）

# 最简单的使用

    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
    fetch(url)
        .then(response => response.text()) // 将response中的data转成String
        .then(responseText => {
            console.log(responseText)
        })
        .catch(e => { //捕获异常
            console.log(e.toString())
        })

这里我们通过网络获取一个JSON文件并将其打印到控制台。最简单的用法是只提供一个参数用来指明想fetch()到的资源路径，然后返回
一个包含响应结果的promise(一个Response对象)

当然它只是一个HTTP响应，而不是真的JSON或Sting。为了获取String的内容，我们需要使用text()方法来将response中的data转成
String

# 支持的请求参数

    Promise fetch(input,init)

# 参数

    * input: 定义要获取的资源。这可能是：
        * 一个String字符串，包含要获取资源的URL
        * 一个Request对象
    * init: [可选]一个配置项对象，包括所有对请求的设置。可选的参数有：
        * method: 请求使用的方法，如GET,POST,PUT,DELETE
        * headers: 请求的头信息，形式为Headers的对象或包含ByteString值的对象字面量
        * body: 请求的body信息：可能是一个Blob、BufferSource、FormData、
                URLSearchParams或者String对象。注意GET或HEAD方法的请求不能包含body信息
        * mode: 请求的模式，如cors、no-cors或者same-origin
        * credentials: 请求的credentials,如omit、same-origin或者include。为了在当前域名内自动发送cookie，必须提供这个
          选项，从Chrome50开始，这个属性也可以接受FederatedCredential实例或是一个PasswordCredential实例
        * cache: 请求的cache模式：default、no-store、reload、no-cache、force-cache或者only-if-cached
        * redirect:可用的redirect模式：follow(自动重定向)，error(如果产生重定向将自动终止并且抛出一个错误)或者manuai(手动
          处理重定向)。在Chome中，Chrome47之前的默认值是follow，从Chrome47开始是manual
        * referrer: 一个USVString可以是no-referrer、client或一个URL。默认是client。
        * referrerPolicy: 指定referer HTTP header的值，可选值[no-referrer、no-referrer-when-downgrade、origin、
          origin-when-cross-origin、unsafe-url]
        * integrity:包括请求的subresource integrity值（例如：sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=）


# 示例

    fetch(url, {
        body: JSON.stringify(data), // 数据类型要和 'Content-Type' header保持一致
        cache: 'no-cache', // default,no-cache,reload,force-cache 或者only-if-cached
        credentials: 'same-origin', // omit、same-origin 或者 include
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
        method: 'POST', // GET,POST,PUT,DELETE等
        mode: 'cors', // no-cors, cors 或same-origin
        redirect: 'follow', // manual,follow或error
        referrer: 'on-referrer', // client 或 no-referrer
    })
    .then(response => response.json()) // 将数据解析成JSON

# 请求错误与异常处理

    如果遇到网络故障， fetch() promise 将会调用reject,带上一个TypeError对象

        需要注意的是：一次请求没有调用reject并不代表请求就一定成功了，通常情况我们需要在resolved的情况，再判断Response.ok
        是不是为true:类似以下代码：

    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
    fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.text() // 将response中的data转成String
            }
            throw new Error('Network response was not ok.')
        })
        .then(responseText => {
            console.log(responseText)
        })
        .catch(e => { // 捕获异常
            console.log(e.toString())
        })