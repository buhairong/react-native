/*全局导航跳转工具类*/
export default class NavigationUtil {
    /*跳转到指定页面*/
    static goPage (params, page) {
        const navigation = NavigationUtil.navigation

        if (!navigation) {
            return
        }
        navigation.navigate(
            page,
            {
                ...params
            }
        )
    }

    /*返回上一页*/
    static goBack (navigation) {
        navigation.goBack()
    }

    /*重置到首页*/
    static resetToHomePage (params) {
        const {navigation} = params
        navigation.navigate("Main")
    }
}