在这一节呢我们来学习如何设计一个React Native离线缓存框架

# 为什么要离线缓存呢？

    宏观上来说：

    * 提升用户体验： 我们要为用户提供流畅的APP操作体验，但我们无法保证所有用户的网络流畅度都是好的，所以我们需要离线缓存
      来提升用户体验
    * 节省流量：节省流量分两个层次：
        * 节省服务器流量
        * 节省用户手机的流量


    对于我们这款APP来说：

    * APP的数据来源在国外：咱们App的数据主要来自于Github,但Github的服务器在国外，所以在国内访问速度很不好，所以我们希望
      很不容易获取到的数据不能用一次就丢掉
    * 对数据实时性要求不高：https://github.com/trending的数据也不是实时更新的

# 离线缓存的策略

    * a: 优先从本地获取数据，如果数据过时或不存在则从服务器获取数据，数据返回后同时将数据同步到本地数据库
    * b: 优先从服务器获取数据，数据返回后同时将数据同步到本地数据库，如果网络故障则从本地获取数据
    * c: 同时从本地和服务器获取数据，如果本地数据库返回数据则先展示本地数据，等网络数据回来后在展示网络数据同时将数据
         同步到本地数据库

以上，是离线缓存的几种策略，我们就以a策略为例来讲解如何实现离线缓存

# 离线缓存的实现

    首先我们需要实现对数的存储：

# 数据存储

    saveData(url, data, callback) {
        if (!data || !url) return;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
    }

    上述代码我们实现了一个saveData方法，它接受一个url作为缓存数据的key，接受一个object的参数data作为保存的value,因为
    AsyncStorage是无法直接保存object的所以我们需要将其序列化成json

    a策略中提到了数据的有效期，所以我们要给缓存的数据加个时间戳：

    _wrapData(data){
        return {data: data, timestamp: new Date().getTime()}
    }

    注意：这里我们取的是本地时间作为的时间戳，本地时间存在被篡改的风险，如果条件允许可以取服务器的时间作为时间戳

# 获取本地数据

    fetchlocalData(url){
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(e)
                        console.error(e)
                    }
                } else {
                    reject(error)
                    console.error(error)
                }
            })
        })
    }

    AsyncStorage.getItem获取的数据是String类型的，以方便使用我们需要将其反序列成Object

# 获取网络数据

    fetchNetData(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error('Network response was not ok')
                })
                .then((responseData) => {
                    this.saveData(url, responseData)
                    resolve(responseData)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    * 通过上述代码我们获取到网络数据，并对响应不成功的情况抛出了异常
    * 在获取到网络数据的同时我们将同步到了本地数据库

# 实现缓存策略

    按照a策略：优先从本地获取数据，如果数据过时或不存在则从服务器获取数据，我们需要这样设计我们的代码：

        * 我们优先获取本地数据
        * 如果数据存在且在有效期内，我们将数据返回
        * 否则我们获取网络数据

    fetchData(url){
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).then((wrapData) => {
                if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
                    resolve(wrapData)
                } else {
                    this.fetchNetData(url)
                        .then((data) => {
                            resolve(this._wrapData(data))
                        })
                        .catch((error) => {
                            reject(error)
                        })
                }
            })
            .catch((error) => {
                this.fetchNetData(url)
                    .then((data) => {
                        resolve(this._wrapData(data))
                    })
                    .catch((error => {
                        reject(error)
                    }))
            })
        })
    }

    在上述代码中我们通过DataStore.checkTimestampValid来判断数据是否有效

    /*
        检查timestamp是否在有效期内
        true 不需要更新,false 需要更新
    */
    static checkTimestampValid(timestamp) {
        const currentDate = new Date()
        const targetDate = new Date()
        targetDate.setTime(timestamp)
        if (currentDate.getMonth() !== targetDate.getMonth()) {
            return false
        }
        if (currentDate.getDate() !== targetDate.getDate()) {
            return false
        }
        if (currentDate.getHours() - targetDate.getDate() > 4) {
            return false // 有效期4个小时
        }
        return true
    }
