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
        * float:无透明效果，默认
        * screen:有渐变透明效果，如微信QQ的一样
        * none:隐藏导航栏
    * headerBackTitleVisible: 提供合理的默认值以确定后退按钮标题是否可见，但如果要覆盖它，则可以使用true或false 在此选项中
        * fade-in-place:标题组件交叉淡入淡出而不移动，类似于ios的Twitter,Instagram和Facebook应用程序。这是默认值
        * uikit:ios的默认行为的近似值。headerTransitionPreset:指定在启用headerMode:float时header应如何从一个屏幕转换到另一个屏幕
    * cardStyle:样式 (ios上页面切换会有白色渐变蒙层，想去掉则可以这样设置，cardStyle:{opacity:null},切换页面时的页面边框也在这里可以设置)
    * onTransitionStart:页面切换开始时的回调函数（我们可以在这里注册一些通知，告知我们切换的状态，方便后面处理页面切换事件）
    * onTransitionEnd:页面切换结束时的回调函数

###################################################################################################################################
navigationOptions(屏幕导航选项)
支持一下参数：
    * title:可以作为headerTitle的备选字段（当没设置headerTitle时会用该字段作为标题），也可以作为TabNavigator的tabBarLabel以及DrawerNavigator的drawerLabel
    * header:自定义导航条，可以通过设置null来隐藏导航条
    * headerTitle: 标题
    * headerTitleAllowFontScaling:标题是否允许缩放，默认true
    * headerBackTitle:定义在ios上当前页面进入到下一页面的回退标题，可以通过设置null来禁用它
    * headerTruncatedBackTitle:当回退标题不能显示的时候显示此属性的标题，比如回退标题太长了
    * headerBackImage:React元素或组件在标题的后退按钮中显示自定义图片。当组件被调用时，它会在渲染时收到许多props如：（tintColor,title）。默认为带有
    react-navigation/views/assets/back-icon.png 这张图片的组件，后者是平台的默认后图标图像(ios上为向左的符号，Android上为箭头)
    * headerRight:定义导航栏右边视图
    * headerLeft:定义导航栏左边视图
    * headerStyle:定义导航栏的样式，比如背景色等
    * headerTitleStyle:定义标题的样式
    * headerLeftContainerStyle:自定义headerLeft组件容器的样式，例如，增加padding
    * headerRightContainerStyle:自定义headerRight组件容器的样式，例如，增加padding
    * headerTitleContainerStyle:自定义headerTitle组件容器的样式，例如，增加padding
    * headerBackTitleStyle:定义返回标题的样式
    * headerPressColorAndroid:颜色为材料波纹(Android >= 5.0)
    * headerTintColor:定义导航条的tintColor,会覆盖headerTitleStyle中的颜色
    * headerTransparent:默认为false。如果true，则标头将不会有背景，除非您显示提供headerStyle 或 headerBackground
    * headerBackground:与headerTransparent一起使用，以提供在标题后台呈现的组件。例如：您可以使用模糊视图来创建半透明标题
    * gesturesEnabled:定义是否能侧滑返回，ios默认true,Android默认false
    * gestureResponseDistance:定义滑动返回的有效距离，水平状态下默认：25，垂直状态默认135
    * gestureDirection:设置关闭手势的方向。默认从左向右，可以设置从右到左的滑动操作。


案例：使用StackNavigator做界面导航、配置navigationOptions

#第一步：创建一个StackNavigator类型的导航器
export const AppStackNavigator = createStackNavigator({
    HomePage: {
      screen: HomePage
    },
    Page1: {
        screen: Page1,
        navigationOptions: ({navigation} => ({
            title: `${navigation.state.params.name}页面名` // 动态设置navigationOptions
        }))
    },
    Page2: {
        screen: Page2,
        navigationOptions: { // 在这里定义每个页面的导航属性，静态配置
            title: "This is Pages"
        }
    },
    Page3: {
        screen: Page3,
        navigationOptions: (props) => { //在这里定义每个页面的导航属性，动态配置
            const {navigation} = props
            const {state, setParams} = navigation
            const {params} = state
            return {
                title:params.title ? params.title : 'This is Page3',
                headerRight: (
                    <Button
                        title = {params.mode === 'edit' ? '保存' : '编辑'}
                        onPress = {() => setParams(mode: params.mode === 'edit' ? '' : 'edit')}
                    />
                )
            }
        }
    },
},{
    defaultNavigationOptions: {
        // header: null // 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
    }
})

#第二步：配置navigationOptions：

步骤一的代码中通过两种方式配置了navigationOptions：

静态配置：

对Page2的navigationOptions配置是通过静态配置完成的：

Page2 : {
    screen: Page2,
    navigationOptions: { // 在这里定义每个页面的导航属性，静态配置
        title: "This is Page2"
    }
}

这种方式被称为静态配置，因为navigationOptions中的参数是直接Hard Code的不依赖于变量

动态配置：

对Page3的navigationOptions配置是通过动态配置完成的：

Page3: {
    screen: Page3,
    navigationOptions: (props) => { // 在这里定义每个页面的导航属性，动态配置
        const {navigation} = props
        const {state, setParams} = navigation
        const {params} = state
        return {
            title: params.title ? params.title : 'This is Page3',
            headerRight: (
                <Button
                    title = {params.mode === 'edit' ? '保存' : '编辑'}
                    onPress = {() => setParams({mode: params.mode === 'edit' ? '' : 'edit'})}
                />
            )
        }
    }
}

从上述代码中可以看出Page3的navigationOption依赖于props这个变量所以是动态的，当props中的内容发生变化时，navigationOptions也会跟着变化

提示：除了在创建createStackNavigator时配置navigationOptions外，在StackNavigator之外也可以配置navigationOptions

createStackNavigator之外也可以配置navigationOptions

方式一：

Page2.navigationOptions = {
    title: "This is Page2"
}

方式二：

export default class Page1 extends React.Component {
    // 也可在这里定义每个页面的导航属性，这里的定义会覆盖掉别处的定义
    static navigationOptions = {
        title: 'Page1'
    }
    ……
}

#第三步：界面跳转

export default class HomePage extends React.Component {
    // 在这里定义每个页面的导航属性
    static navigationOptions = {
        title: 'Home',
        headerBackTitle: '返回哈哈', // 设置返回此页面的返回按钮文案，有长度限制
    }

    render () {
        const {navigation} = this.props
        return <View>
            <Text style={styles.text}>欢迎来到HomePage</Text>
            <Button
                title = "Go To Page1"
                onPress = {() => {
                    navigation.navigate('Page1', {name: '动态的'})
                }}
            />
            <Button
                title = "Go To Page2"
                onPress = {() => {
                    navigation.navigate('Page2')
                }}
            />
            <Button
                title = "Go To Page3"
                onPress = {() => {
                    navigation.navigate('Page3', {name: 'Devio'})
                }}
            />
        </View>
    }
}

页面跳转可分为两步：

1.获取navigation

const {navigation} = this.props

2.通过navigate(routeName, params, action)进行跳转

navigation.navigate('Page2')
navigation.navigate('Page3', {name: 'Devio'})

这里在跳转到Page3的时候传递了参数{name: 'Devio'}

#第四步：更新页面Params与返回
export default class Page3 extends React.Component {
    render () {
        const {navigation} = this.props
        const {state, setParams} = navigation
        const (params) = state
        const showText = params.mode === 'edit' ? '正在编辑' : '编辑完成'
        return <View>
            <Text style = {styles.text}>欢迎来到Page3</Text>
            <Text style = {styles.showText}>{showText}</Text>
            <TextInput
                style = {styles.input}
                onChangeText = {text => {
                    setParams({title:text})
                }}
            />
            <Button
                title = "Go Back"
                onPress = {() => {
                    navigation.goBack()
                }}
            />
        </View>
    }
}

代码解析：

在上述代码中通过：

<TextInput
    style = {styles.input}
    onChangeText = {text => {
        setParams({title:text})
    }}
/>

将输入框中内容的变化，通过setParams({title:text})更新到页面的标题上，你会看到当输入框中内容发生变化时，标题也会跟着变

当用户单机Go Back按钮时，通过：

navigation.goBack()

实现了返回上一页

安装navigation
yarn add react-navigation

安装navigation第三方插件，用于tab首次操作
yarn add react-native-gesture-handler

将react-native-gesture-handler关联到react-native项目里
react-native link react-native-gesture-handler