数据存储是开发APP必不可少的一部分，比如页面缓存，从网络上获取数据的本地持久化等，那么在RN中如何进行数据存储呢？

    RN官方推荐我们在RN中用AsyncStorage进行数据存储

# 什么是AsyncStorage?

    * 简单的，异步的，持久化的key-value存储系统
    * AsyncStorage也是React Native官方推荐的数据存储方式，旨在代替LocalStorage

AsyncStorage在iOS下存储分两种情况：

    * 如果存储的内容较小，那么AsyncStorage会将要存储的内容放在一个序列化的字典中
    * 如果存储的值较大，那么AsyncStorage会将存储的内容放在一个单独的文件中

AsyncStorage在Android下的存储也分两种情况：

    * AsyncStorage会将数据存储在 RocksDB 或者 SQLite，具体存储在 RocksDB 中还是SQLite中这取决于设备支持哪一种存储方式了


# 如何使用AsyncStorage

    首先导入AsyncStorage作为RN一个标准的组件使用之前需要先导入：

    import { AsyncStorage } from 'react-native'

    存储数据：

    /*
        存储数据
        return {Promise.<void>}
    */
    async doSave () {
        // 用法一
        AsyncStorage.setItem(KEY, this.value, error => {
            error && console.log(error.toString())
        })

        // 用法二
        AsyncStorage.setItem(KEY, this.value)
            .catch(error => {
                error && console.log(error.toString())
            })

        // 用法三
        try {
            await AsyncStorage.setItem(KEY, this.value)
        } catch (error) {
            error && console.log(error.toString())
        }
    }

    读取数据：

    async getData () {
        // 用法一
        AsyncStorage.getItem(KEY, (error, value) => {
            this.setState({
                showText: value
            })
        })

        // 用法二
        AsyncStorage.getItem(KEY)
            .then(value => {
                this.setState({
                    showText: value
                })
                console.log(value)
            })
            .catch(error => {
                error && console.log(error.toString())
            })

        // 用法三
        try {
            const value = await AsyncStorage.getItem(KEY)
            this.setState({
                showText: value
            })
            console.log(value)
        } catch(error){
            error && console.log(error.toString())
        }
    }

    删除数据：

    async doRemove() {
        // 用法一
        AsyncStorage.removeItem(KEY, error => {
            error && console.log(error.toString())
        })

        // 用法二
        AsyncStorage.removeItem(KEY)
            .catch(error => {
                error && console.log(error.toString())
            })

        // 用法三
        try {
            await AsyncStorage.removeItem(KEY)
        } catch (error) {
            error && console.log(error.toString())
        }
    }

# AsyncStorage有哪些常用的API

# setItem()

    方法原型：static setItem(key: string, value: string, [callback]: ?(error: ?Error) => void)

    该方法提供以key,value键值对的方式存储数据，方法的第三个参数是错误callback,可以通过判断error是否为空来判断是否保存
    成功。方法返回一个Promise对象


# getItem()

    方法原型：static getItem(key: string, [callback]: ?(error: ?Error,result: ?string) => void)

    该方法用户获取存储的数据，方法的第二个参数是callback(error,result),完成读取数据后会回调该方法。方法返回一个Promise对象


# removeItem()

    方法原型：static removeItem(key:string,[callback]:?(error: ?Error) => void)

    删除一个字段。可以通过判断error是否为空来判断是否保存成功。方法返回一个Promise对象

# mergeItem()

    方法原型：static margeItem(key:string,value: string, [callback]:?(error: ?Error) => void)

    对已存在的数据进行修改