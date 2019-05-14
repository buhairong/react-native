#################################################################################################
createMaterialTopTabNavigator API

    createMaterialTopTabNavigator(RouteConfigs, TabNavigatorConfig):
    * RouteConfigs(必须)：路由配置对象是从路由名称到路由配置的映射，告诉导航器该路由呈现什么
    * TabNavigatorConfig(可选)：配置导航器的路由（如：默认首屏，navigationOptions, paths等）样式（如：转场模式mode、头部模式等）

从createMaterialTopTabNavigator API 上可以看出 createMaterialTopTabNavigator 支持通过 RouteConfigs 和 TabNavigatorConfig 两个
参数来创建createMaterialTopTabNavigator导航器

# RouteConfigs

RouteConfigs支持三个参数screen、path以及navigationOptions：
    * screen(必选)：指定一个React组件作为屏幕的主要显示内容，当这个组件被TabNavigator加载时，它会被分配一个navigation prop
    * path(可选)：用来设置支持schema跳转时使用，具体使用会在下文的有关Schema章节中讲到
    * navigationOptions（可选）：用以配置全局的屏幕导航选项如：title、headerRight、headerLeft等

# TabNavigatorConfig
    * tabBarComponent:指定TabNavigator的TabBar组件
    * tabBarPosition:用于指定TabBar的显示位置，支持'top'与'bottom'两种方式
    * swipeEnabled:是否可以左右滑动切换tab
    * lazy:默认值是false。如果是true,Tab页只会在被选中或滑动到该页时被渲染。当为false时，所有的Tab页都将直接被渲染；（可以轻松实现多Tab页面的懒加载）
    * optimizationsEnabled:是否将Tab页嵌套在到 ResourceSavingScene 中。如果是，一旦该Tab页失去焦点，将被移出当前页面，从而提高内存使用率。
    * animationEnabled:切换页面时是否有动画效果
    * initialLayout:包含初始高度和宽度的可选对象可以被传递以防止react-native-tab-view呈现中的一个帧延迟
    * tabBarOptions:配置TabBar下文会详细讲解
    * initialRouteName:默认页面组件，TabNavigator显示的第一个页面
    * order:定义tab顺序的routeNames数组
    * paths:提供routeName到path config的映射，它覆盖routeConfigs中设置的路径
    * backBehavior:后退按钮是否会导致标签切换到初始tab?如果是，则设切换到初始tab,否则什么也不做。默认为切换到初始tab

# tabBarOptions(tab配置)
    * activeTintColor:设置TabBar选中状态下的标签和图标的颜色
    * inactiveTintColor:设置TabBar非选中状态下的标签和图标的颜色
    * showIcon:是否展示图标，默认是false
    * showLabel:是否展示标签，默认是true
    * upperCaselabel:是否使标签大写，默认为true
    * tabStyle:设置单个tab的样式
    * indicatorStyle: 设置indicator (tab下面的那条线)的样式
    * labelStyle: 设置TabBar标签的样式
    * iconStyle: 设置图标的样式
    * style:设置整个TabBar的样式
    * allowFontScaling:设置TabBar标签是否支持缩放，默认支持
    * pressColor:Color for material ripple (仅支持 Android >= 5.0 )
    * pressOpacity:按下标签时的不透明度 (支持ios 和 android < 5.0)
    * scrollEnabled: 是否支持选项卡滚动

tabBarOptions: {
    labelStyle: {
        fontSize: 12
    },
    tabStyle: {
        width: 100
    },
    style: {
        backgroundColor: 'blue'
    }
}

# navigationOptions (屏幕导航选项)

createMaterialTapTabNavigator支持的屏幕导航选项的参数有:
    * title:可以用作headerTitle 和 tabBarLabel的备选的通用标题
    * swipeEnabled:是否允许tab之间的滑动切换，默认允许
    * tabBarLabel:设置TabBar的标签
    * tabBarOnPress: Tab被点击的回调函数，它的参数是一包含以下变量的对象：
        * navigation:页面的navigation props
        * defaultHandler: tab press 的默认 handler
    * tabBarAccessibilityLabel:选项卡按钮的辅助功能标签。当用户点击标签时，屏幕阅读器会读取这些信息。如果您没有选项卡的标签，建议设置此项
    * tabBarTestID：用于在测试中找到该选项卡按钮的ID

#################################################################################################
案例一：使用 createMaterialTopTabNavigator 做界面导航、配置navigationOptions
矢量图标第三方库
yarn add react-native-vector-icons
react-native link react-native-vector-icon

https://oblador.github.io/react-native-vector-icons/