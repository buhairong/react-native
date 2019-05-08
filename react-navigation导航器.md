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
当前仅当当前 navigator 是 stack navigator 时， this.props.navigation 上有一些附加功能。这些函数是 navigate 和 goBack 的替代方法，
你可以使用任何你喜欢的方法。这些功能是：
    * this.props.navigation
        * push 导航到堆栈中的一个新的路由
        * pop 返回堆栈中的上一个页面
        * popToTop 跳转到堆栈中最顶层的页面
        * replace 用新路由替换当前路由
        * reset 擦除导航器状态并将其替换为多个操作的结果
        * dismiss 关闭当前栈

###################################################################################
使用 navigate 进行界面之间的跳转
    * navigation.navigate({routeName, params, action, key}) 或 navigation.navigate(routeName, params, action)
        * routeName：要跳转到的界面的路由名，也就是在导航其中配置的路由名
        * params：要传递给下一个界面的参数
        * action：如果该界面是一个navigator的话，将运行这个sub-action
        * key：要导航到的路由的可选标识符。如果已存在，将后退到此路由

export const AppStackNavigator = createStackNavigator({
    HomeScreen: {
        screen: HomeScreen
    },
    Page1: {
        screen: Page1
    }
})

class HomeScreen extends React.Component{
    render () {
        const {navigate} = this.props.navigation

        return (
            <View>
                <Text>This is HomeScreen</Text>
                <Button
                    onPress = {() => navigate('Page1', {name: 'Devio'})}
                    title = "Go to Page1"
                />
            </View>
        )
    }
}

###################################################################################
使用state的params
可以通过this.props.state.params来获取通过 setParams(), 或 navigation.navigate()传递的参数

<Button
    title = {params.mode === 'edit' ? '保存', '编辑'}
    onPress = {() => setParams({mode: params.mode === 'edit' ? '' : 'edit'})}
/>
<Button
    title = "Go To Page1"
    onPress = {() => {navigation.navigate('Page1', {name: 'Devio'})}}
/>
const {navigation} = this.props
const {state, setParams} = navigation
const {params} = state
const showText = params.mode === 'edit' ? '正在编辑' : '编辑完成'

########################################################################################
使用setParams 改变 route params
    * setParams: function setParams(params)： 我们可以借助 setParams 来改变route params，
        比如，通过setParams来更新页面顶部的标题，返回按钮等

class ProfileScreen extends React.Component {
    render () {
        const {setParams} = this.props.navigation
        return (
            <Button
                onPress = {() => setParams({name: 'Lucy'})}
                title = "Set title name to 'Lucy'"
            />
        )
    }
}

注意： navigation.setParams 改变的是当前页面的Params,如果要改变其他页面的Params可以通过
NavigationActions.setParams完成，下文会讲到

##################################################################################################
使用goBack返回到上一页面或指定页面
    * goBack: function goBack(key)：我们可以借助goBack返回到上一页或者路由栈的指定页面
        * 其中 key 表示你要返回到页面的页面标识如 id-1517035332238-4，不是routeName
        * 可以通过指定页面的navigation.state.key来获得页面的标识
        * key 非必传，也可传null

navigation.state {params: {...}, key: "id-1517035332238-4", routeName: "Page1"}

export default class Page1 extends React.Component {
    render () {
        const {navigation} = this.props
        return <View>
            <Text style={styles.text}>欢迎来到Page1</Text>
            <Button
                title = "Go Back"
                onPress = {() => {navigation.goBack()}}
            />
        </View>
    }
}

#####################################################################################################
通过dispatch发送一个action
    * dispatch: function dispatch(action)：给当前界面设置action，会替换原来的跳转，回退等事件

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({
            routeName: 'HomePage',
            params: {
                theme: theme,
                selectedTab: selectedTab
            }
        })
    ]
})
navigation.dispatch(resetAction)

###########################################################################################################
NavigationActions
    * Navigate：导航到其他的页面
    * Back：返回到上一个页面
    * Set Params: 设置指定页面的Params
    * Init： 初始化一个state 如果 state 是 undefined

Navigate:
Navigate action 会使用Navigate action的结果来更新当前的state
方法原型：navigate({routeName, params, action, key})
* routeName: 字符串，必选项，在app的router里注册的导航目的地的routeName
* params: 对象，可选项，融合进目的地route的参数
* actions: 对象，可选项（高级），如果screen也是一个navigator,次级action可以在子router中运行，
在文档中描述的任何actions都可以作为次级action
* key: string or null 可选，要导航到的路由的标识符。如果已存在，则导航回此路由。

import {NavigationActions} from 'react-navigation'

const navigateAction = NavigationActions.navigate({
    routeName: 'Profile',
    params: {},
    action: NavigationActions.navigate({routeName: 'SubProfileRoute'})
})
this.props.navigation.dispatch(navigateAction)

###################################################################################################################
Back
返回到前一个screen并且关闭当前screen.backaction creator接受一个可选的参数：
    * key: String 可选， 这个可以和上文中讲到的goBack的key是一个概念：

import {NavigationActions} from 'react-navigation'
const backAction = NavigationActions.back()
this.props.navigation.dispatch(backAction)

######################################################################################################################
SetParams
通过SetParams我们可以修改指定页面的Params
    * params：对象，必选参数，将会被合并到已经存在页面的Params中
    * key：字符串，必选参数，页面的key

import {NavigationActions} from 'react-navigation'
const setParamsAction = NavigationActions.setParams({
    params: {title: 'HomePage'},
    key: 'id-1517035332238-4'
})

有很多小伙伴可能会问：navigation中有setParams为什么还要有NavigationActions.setParams?

我从两方面来回答一下这个问题：
    1.在上文中讲到过navigation中有可能只有state与dispatch,这个时候如果要修改页面的Params,则只能通过 NavigationActions.setParams 了
    2.另外，navigation.setParams只能修改当前页面的Params,而 NavigationActions.setParams 可以修改所有页面的Params

#############################################################################################################################
StackActions
    * Reset: 重置当前 state 到一个新的state
    * Replace: 使用另一个路由替换指定的路由
    * Push: 在堆栈顶部添加一个页面，然后跳转到该页面
    * Pop: 跳转到上一个页面
    * PopToTop: 跳转到堆栈最顶层的页面，并销毁其他所有页面

Reset:
Reset action删除所有的navigation state 并且使用这个actions的结果来代替
    * index: 数组，必选项，navigation state中route数组中激活route的index
    * actions: 数组，必选项，Navigation Actions数组，将会替代navigation state
    * key: string or null 可选，如果设置，具有给定key的导航器将重置。如果为null,则根导航器将重置

import { NavigationActions, StackActions } from 'react-navigation'

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Profile'})
    ]
})
this.props.navigation.dispatch(resetAction)

使用场景比如进入APP首页后的splash页不在使用，这时可以使用NavigationActions.reset重置它

index参数被用来定制化当前激活的route，举个例子：使用两个routes WelcomePage和HomePage给
一个基础的stack navigation设置，为了重置route到HomePage,但是在堆栈中又存放在WelcomePage之上，你可以这么做：

import { NavigationActions, StackActions } from 'react-navigation'

const resetAction = StackActions.reset({
    index: 1,
    actions: [
        NavigationActions.navigate({ routeName: 'WelcomePage'}),
        NavigationActions.navigate({ routeName: 'HomePage'})
    ]
})

Replace
Replace,用另一个路由替换指定的路由
    * key: string 被替换的路由的key,如果未指定，最近的路由将会被替换
    * newKey: string 用于替换路线的Key,如果未提供，则自动生成
    * routeName: string routeName用于替换路由
    * params: object 要传入替换路由的参数
    * action: object 可选的子动作
    * immediate*: boolean 目前没有效果，这是 stack navigator 支持动画替换（它目前不支持）的占位符

Push
Push，在堆栈顶部添加一条路由，并导航至该路由，与navigate的区别在于，如果有已经加载的页面，navigate方法
将跳转到已经加载的页面，而不会重新创建一个新的页面，push总是会创建一个新的页面，所以一个页面可以被多次创建
    * routeName: string routeName用于替换路由
    * params: object 将合并到目标路由的参数 （通过this.props.navigation.state.params 在目标路由获取）
    * action: object 可选 （高级）如果页面是navigator,则是在子路由器中运行的子操作

import { StackActions } from 'react-navigation'

const pushAction = StackActions.push({
    routeName: 'Profile',
    params: {
        myUserId: 9
    }
})

Pop
The pop 一个可以返回到堆栈中上一个路由的方法，通过设置参数n,可以指定返回的多少层
    * n: number 返回的层数

import { StackActions } from 'react-navigation'

const pushAction = StackActions.pop({
    n: 1
})

PopToTop

The popToTop 一个可以直接跳转到堆栈最顶层，并销毁其它所有页面的方法，它在功能上与
StackActions.pop({n: currentIndex})相同

import { StackActions } from 'react-navigation'

this.props.navigation.dispatch(StackActions.popToTop())
