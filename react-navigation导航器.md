###########################################
从navigator到react-navigation
随着react-navigation逐渐稳定，Navigator也被光荣的退休了。在React Native生态环境中需要一款
可扩展且易于使用的导航组件，Navigator自然胜任不了，这时React Native社区便孕育出了一个开源
导航组件react-navigation

react-navigation的出现替代了Navigator、Ex-Navigation等老一代的导航组件，react-navigation可以说
是Navigator的加强版，不仅有Navigator的全部功能，另外还支持底部导航类似于与IOS中的UITabBarController,
此外它也支持侧拉效果方式的导航类似于Android中的抽屉效果。

##################################################
什么是导航器
导航器也可以看成一个是普通的React组件，你可以通过导航器来定义你的App的导航结构。导航器还可以渲染通用元素。
例如可以配置的标题栏和选项卡栏。

在react-navigation中有以下7种类型的导航器：
* createStackNavigator：类似于普通的Navigator，屏幕上方导航栏
* createTabNavigator：createTabNavigator已弃用，使用createBottomTabNavigator或createMaterialTopTabNavigator替代
* createBottomTabNavigator：相当于IOS里面的TabBarController,屏幕下方的标签栏
* createMaterialTopTabNavigator：屏幕顶部的材料设计主题标签栏
* createDrawerNavigator：抽屉效果，侧边滑出
* createSwitchNavigator：SwitchNavigator的用途是一次只显示一个页面

你可以通过以上7种导航器来创建你的APP,可以是其中一个也可以多个组合，这个可以根据具体的应用场景并结合每一个导航器的特性
进行选择。

在开始学习7种导航器之前，我们需要先了解两个和导航关于概念：
* Screen navigation prop（屏幕导航属性）：通过navigation可以完成屏幕之间的调度操作，例如打开另一个屏幕
* Screen navigationOption（屏幕导航选项）：通过navigationOptions可以定制导航器显示屏幕的方式（例如：头部标题，选项卡标签等）

##########################################################
导航器所支持的Props

const SomeNav = createStackNavigator/createBottomTabNavigator/createMaterialTopTabNavigator => ({
    // config
})

<SomeNav
    screenProps = {xxx}
    ref = {nav => {navigation = nav;}}
    onNavigationStateChange = (prevState, newState, action) => {

    }
/>

* ref：可以通过ref属性获取到navigation
* onNavigationStateChange(prevState, newState, action)：顶级节点除了ref属性之外，还接受onNavigationStateChange(prevState,newState,action)属性，
每次当导航器所管理的state发生改变时，都会回调该方法
    * prevState：变化之前的state
    * newState：新的state
    * 导致state变化的action
* screenProps:向子屏幕传递额外的数据，子屏幕可以通过this.props.screenProps获取到该数据

#####################################################################################
Screen Navigation Prop（屏幕的navigation Prop）

当导航器中的屏幕被打开时，它会收到一个navigation prop, navigation prop是整个导航环节的关键一员，接下来就详细讲解一下navigation的作用

navigation包含以下功能：
    * navigate： 跳转到其他界面
    * state： 屏幕的当前state
    * setParams： 改变路由的params
    * goBack： 关闭当前屏幕
    * dispatch： 向路由发送一个action
    * addListener： 订阅导航生命周期的更新
    * isFocused： true 标识屏幕获取了焦点
    * getParam： 获取具有回退的特定参数
    * dangerouslyGetParent: 返回父导航器

注意：一个navigation有可能没有navigate、setParams以及goBack,只有state与dispatch,所以在使用navigate时要进行判断，
如果没有navigate可以使用navigation去dispatch一个新的action
如：
const {navigation, theme, selectedTab} = this.props
const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({
            routeName: 'HomePage',
            params: {
                theme: theme,
                selectedTab:selectedTab
            }
        })
    ]
})
navigation.dispatch(resetAction)

StackNavigator的navigation的额外功能：
6:21
