#####################################################################################################
createStackNavigator 提供APP屏幕之间切换的能力，它是以栈的形式管理屏幕之间的切换，新切换到的屏幕会放在栈的顶部

屏幕转场风格

默认情况下，createStackNavigator提供了转场过渡效果，在Android和ios上过渡效果是不同的，这也是React Native重平台性
的一个体现，在Android上从屏幕底部淡入，在ios上是从屏幕的右侧划入，当然你也可以通过配置让StackNavigator支持屏幕
从底部滑入的效果

createStackNavigator API
    createStackNavigator(RouteConfigs, StackNavigatorConfig)
    * RouteConfigs(必须)：路由配置对象是从路由名称到路由配置的映射，告诉导航器该路由呈现什么
    * StackNavigatorConfig(可选)：配置导航器的路由（如：默认首屏，navigationOptions,paths等）样式(如：转场模式mode、头部模式等)

从createStackNavigator API上可以看出createStackNavigator 支持通过 RouteConfigs 和 StackNavigatorConfig 两个参数来创建createStackNavigator导航器

RouteConfigs
RouteConfigs支持三个参数screen、path以及navigationOptions
    * screen(必须)：指定一个 React 组件作为屏幕的主要显示内容，当这个组件被createStackNavigator加载时，它会被分配一个 navigation prop
    * path（可选）：用来设置支持schema跳转时使用，具体使用会在下文的有关Schema章节中讲到
    * navigationOptions(可选)：用以配置全局的屏幕导航选项如：title、headerRight、headerLeft

StackNavigatorConfig
从 react-navigation 源码中可以看出StackNavigatorConfig支持配置的参数有10个

function createStackNavigator(routeConfigMap, stackConfig = {}) {
    const {
        initialRouteKey,
        initialRouteName,
        initialRouteParams,
        paths,
        navigationOptions,
        disablekeyboardHandling,
        getCustomActionCreators
    } = stackConfig
}
...

这7个参数可以根据作用不同分为路由配置、视图样式配置两类，首先看用于路由配置的参数：
    用于路由配置的参数：
    * initialRouteName: 设置默认的页面组件，必须是上面已注册的页面组件
    * initialRouteParams: 初始路由的参数
    * navigationOptions: 屏幕导航的默认选项，下文会详细讲解
    * initialRouteKey: 初始路由的可选标识符
    * paths: 用来设置支持schema跳转时使用，具体使用会在下文的有关Schema章节中讲到

    用于导航样式配置的参数：
    * mode:页面切换模式：左右是card(相当于ios中的push效果)，上下是modal(相当于ios中的modal效果)
        * card:普通app常用的左右切换
        * modal:上下切换
    * headerMode:导航栏的显示模式：screen：有渐变透明效果，float:无透明效果，none:隐藏导航

   3:09