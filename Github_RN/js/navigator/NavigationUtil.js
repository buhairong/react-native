/*
全局导航跳转工具类
*/

export default class NavigationUtil {
    /*
        返回上一页
    */
    static goBack (navigation) {
        navigation.goBack()
    }

    /*
        重置到首页
    */
    static resetToHomePage (params) {
        const {navigation} = params
        navigation.navigate("Main")
    }
}