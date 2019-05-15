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

navigation:navigation prop
defaultHandler:tab按下的默认处理程序

* tabBarButtonComponent: React组件，它包装图标和标签并实现onPress。默认情况下是TouchableWithoutFeedback的一个封装，使其表现与其他可点击组件相同
  tabBarButtonComponent: TouchableOpacity将使用TouchableOpacity来替代
* tabBarAccessibllityLabel:选项卡按钮的辅助功能标签。当用户点击标签时，屏幕阅读器会读取这些信息。如果您没有选项卡的标签，建议设置此项。
* tabBarTestID: 用于在测试中找到该选项卡按钮的ID

# 第一步：创建一个createBottomTabNavigator类型的导航器

export const AppTabNavigator = createBottomTabNavigator({
    Page1: {
        screen: Page1,
        navigationOptions: {
            tabBarLabel: 'Page1',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name = {focused ? 'ios-home' : 'ios-home-outline'}
                    size = {26}
                />
            )
        }
    },
    Page2: {
        screen: Page2,
        navigationOptions: {
            tabBarLabel: 'Page2',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name = {focused ? 'ios-people' : 'ios-people-outline'}
                    size = {26}
                />
            )
        }
    },
    Page3: {
        screen: Page3,
        navigationOptions: {
            tabBarLabel: 'Page3',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name = {focused ? 'ios-chatboxes' : 'ios-chatboxes-outline'}
                    size = {26}
                />
            )
        }
    }, {
        tabBarComponent: TabBarComponent,
        tabBarOptions: {
            activeTintColor: Platform.OS === 'ios' ? '#e91e63' : '#fff'
        }
    }
})

# 第二步：配置 navigationOptions:

TabNavigator的navigationOptions有两个关键的属性，tabBarLabel标签与tabBarIcon图标：









######################################################################################################
【高级案例】 react-navigation 的高级应用

在使用 react-navigation 时往往有些需求通过简单的配置是无法完成的，比如：
    * 动态配置createBottomTabNavigator：官方只提供了TabNavigator中的页面的静态配置方式，如果TabNavigator中的页面不固定，需要动态生成那么需要怎么做呢？
    * 动态配置createBottomTabNavigator的样式：通过官方的文档是无法实现动态改变TabNavigator的样式的，比如：修改显示的文字，修改字体颜色，修改图标等等
    * 多层嵌套后路由个性化定制：createBottomTabNavigator被包裹后在TabNavigator中的页面时无法借助navigation跳转到外层StackNavigator中的页面的，这种应用场景很多，
      尤其是你需要定制TabNavigator的时候
    * 初始化传参：如何在设置页面的时候传递参数呢？

类似上述的应用场景有很多，大家可以通过与本课程配套的实战课程进行进一步学习 react-navigation 的高级应用