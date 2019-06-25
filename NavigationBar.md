# 什么是NavigationBar

APP页面的顶部开始： 最上面是状态栏，接下来就是导航栏

# 为什么要自定义NavigationBar

    * 我们需要一款灵活，可扩展，易于使用，可定制程度高的NavigationBar
    * 虽然react-navigation带有导航栏的功能，但可以定制化程度低，使用不方便，扩展也不方便

# 导航栏的构成

    左侧按钮  标题  右侧按钮

    导航栏最主要的几部分构成分别是:

        * 以返回按钮为代表的左侧区域
        * 以标题为代表的中间区域
        * 以分享为代表的右侧区域

# 如何自定义RN组件

    在自定义NavigationBar之前呢，我们先来学习一下如何自定义RN控件

# 第一步：继承 React.Component

    export default class NavigationBar extends Component {
        ...

# 第二步：实现render方法

    render () {
        return (
            <View style={styles.container}>
                ...
            </View>
        )
    }

    根据具体要实现的功能不同，render方法可以很简单也可以很复杂

# 第三步：对属性进行类型检查

    class NavigationBar extends React.Component {
        render () {
            return (
                <Text>{this.props.title}</Text>
            )
        }
    }

    自定义的组件往往会提供一些属性供外界调用，如上述代码中的 this.props.title,那么如何确保在使用该自定义控件时能够正确设置属性呢？

    React中内置了类型检查的功能，要检查组件的属性，你需要配置特殊的propTypes属性：

    import PropTypes from 'prop-types'

    class NavigationBar extends React.Component {
        // 设置所提供属性的类型检查
        static propTypes = {
            title: PropTypes.string
        }

        render () {
            return (
                <Text>{this.props.title}</Text>
            )
        }
    }

    // 或者
    NavigationBar.propTypes = {
        title: PropTypes.string
    }

    注意：React.PropTypes 自 React v15.5 起已弃用。请使用 prop-types 库代替

# 第四步：设置默认属性

    有时我们需要为自定义组件设置比较多的属性以满足不同的业务需求，但在使用这个组件时并不是所有的属性都要设置，所以对于有些属性
    我们需要设置默认值，我们是否可以为我们自定义的组件设置一些默认属性呢？

        React 提供了 defaultProps来为一个组件设置默认属性，这对于未定义(undefined)的属性来说有用，而对于设为空(null)的属性并
        没用。例如：

    class NavigationBar extends React.Component {
        // 设置默认属性
        static defaultProps = {
            title: 'Test'
        }
    }

    // 或者
    NavigationBar.defaultProps = {
        title: 'Test'
    }

# 第五步：使用自定义的组件

    import NavigationBar from './NavigationBar'

    <NavigationBar
        title={'最热'}
    />

    在使用自定义组件时，首先需要将其导入到具体的页面，然后就可以使用它了

# 实现NavigationBar

    为了满足的不同的使用场景我们需要让NavigationBar包含状态栏，使用的可以根据场景不同来决定是否包含状态栏

# 相关高度参数

    在实现NavigationBar之前呢我们首先要考虑的是相关组件的高度：

    const NAV_BAR_HEIGHT_IOS = 44 // 导航栏在ios中的高度
    const NAV_BAR_HEIGHT_ANDROID = 50 // 导航栏在Android中的高度
    const STATUS_BAR_HEIGHT = 20 // 状态栏的高度

    通常来讲导航栏的高度在Android和iOS上是不同的，同学们也可以根据实际需要设置不同的高度

# 状态栏StatusBar

    RN提供了StatusBar组件以方便我们来控制状态栏

# 设置属性类型检查

    import {ViewPropTypes} from 'react-native'
    import {PropTypes} from 'prop-types'

    const StatusBarShape = { // 设置状态栏所接受的属性
        barStyle: PropTypes.oneOf(['light-content', 'default',]),
        hidden: PropTypes.bool,
        backgroundColor: PropTypes.string
    }

    static propsTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        titleLayoutStyle: ViewPropTypes.style,
        hide: PropTypes.bool,
        statusBar: PropTypes.shape(StatusBarShape),
        rightButton: PropTypes.element,
        leftButton: PropTypes.element
    }

    以上是对我们的NavigationBar的属性检查的设置，这里的PropTypes需要使用prop-types,使用prop-types需要首先将它安装到项目中

    npm add prop-types

    如果项目中已经引入了prop-types则可以忽略

# 设置默认属性

    有些属性是非必须设置的，比如 statusBar,这些非必须设置的参数我们需要为它定义默认属性

    static defaultProps = {
        statusBar: {
            barStyle: 'light-content', // 多个页面设置，只第一个页面设置有效
            hidden: false
        }
    }

# 实现render方法

    接下来进行最重要的异步，实现render方法：

    render () {
        let statusBar = !this.props.statusBar.hidden ?
            <View style={styles.statusBar}>
                <StatusBar {...this.props.statusBar} />
            </View> : null

        let titleView = this.props.titleView ? this.props.titleView :
            <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{this.props.title}</Text>

        let content = this.props.hide ? null :
            <View style={styles.navBar}>
                {this.getButtonElement(this.props.leftButton)}
                <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
                    {titleView}
                </View>
                {this.getButtonElement(this.props.rightButton)}
            </View>

        return (
            <View style=([styles.container,this.props.style])>
                {statusBar}
                {content}
            </View>
        )
    }

    render的实现分了几个部分：

        * 首先我们先设置statusBar
        * 然后我们设置titleView
        * 接着我们来组合content

# 使用

    import NavigationBar from '../common/NavigationBar'

    type Props = {}
    const THEME_COLOR = '#678'

    class MyPage extends Component<Props> {
        getRightButton () {
            return <View>
                <TouchableOpacity
                    onPress={() => {

                    }}
                >
                    <View>
                        <Feather
                            name={'search'}
                            size={24}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        }

        getLeftButton(callBack) {
            return <TouchableOpacity
                onPress={callBack}
            >
                <Ionicons
                    name={'ios-arrow-back'}
                    size={26}
                />
            </TouchableOpacity>
        }

        render () {
            let statusBar = {
                backgroundColor: THEME_COLOR,
                barStyle: 'light-content'
            }

            let navigationBar =
                <NavigationBar
                    title={'我的'}
                    statusBar={statusBar}
                    rightButton={this.getRightButton()}
                    leftButton={this.getLeftButton()}
                />

            return (
                <View style={styles.container}>
                    {navigationBar}
                    <Text style={styles.welcome}>MyPage</Text>
                </View>
            )
        }
    }

设置渐变色
https://blog.csdn.net/koufulong/article/details/81779323