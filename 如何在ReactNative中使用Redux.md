# 如何在React Native中使用Redux

# 准备工作

    根据需要安装以下组件

        * redux（必选）
        * react-redux（必选）：redux作者为方便在react上使用redux开发的一个用户react上的redux库
        * redux-devtools（可选）：Redux开发者工具支持热加载、action 重放、自定义UI等功能
        * redux-thunk：实现action异步的middleware
        * redux-persist（可选）：支持store本地持久化
        * redux-observable（可选）：实现可取消的action

    npm install --save redux
    npm install --save react-redux
    npm install --save-dev redux-devtools


# react-redux介绍

    react-redux是Redux官方提供的React绑定库。具有高效且灵活的特性。

# 视图层绑定引入了几个概念：

    * <Provider> 组件：这个组件需要包裹在整个组件树的最外层。这个组件让根组件的所有子孙组件能够轻松的使用 connect() 方法绑定store
    * connect()：这是 react-redux 提供的一个方法。如果一个组件想要响应状态的变化，就把自己作为参数传给 connect() 的结果，
                 connect()方法会处理与store绑定的细节，并通过selector确定该绑定 store中哪一部分的数据
    * selector：这是你自己编写的一个函数。这个函数声明了你的组件需要整个store中的哪一部分数据作为自己的props
    * dispatch：每当你想要改变应用中的状态时，你就要dispatch一个action，这也是唯一改变状态的方法

    react-redux提供以下API：

    * Provider
    * connect

# Provider

    API原型： <Provider store>

使组件层级中的connect()方法都能够获得Redux store（将store传递给App框架）。通常情况下我们需要将根组件嵌套在标签中才能使用connect()方法

class Index extends Component {
    render () {
        return <Provider store={configureStore()}>
            <AppWithNavigationState />
        </Provider>
    }
}

在上述代码中我们用标签包裹了根组件AppWithNavigationState，然后为它设置了store参数，store（Redux Store）接受的是应用程序中唯一的
Redux store对象


# connect

    API原型：connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

连接React组件与Redux store，连接操作会返回一个新的与Redux store 连接的组件类，并且连接操作不会改变原来的组件类

    react-redux提供了connect函数，connect是一个高阶函数，首先传入mapStateToProps,mapDispatchToProps，然后返回一个生产Component
    的函数wrapWithConnect(MyComponent)，这样就生产出一个经过包裹的Connect组件，如export default connect(mapStateToProps)(HomePage)


# 使用步骤

    * 创建action

    // action 类型
    export const ADD_TODO = 'ADD_TODO'
    export const COMPLETE_TODO = 'COMPLETE_TODO'
    export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

    // 其它的常量
    export const VisibilityFilters = {
        SHOW_ALL: 'SHOW_ALL',
        SHOW_COMPLETED: 'SHOW_COMPLETED',
        SHOW_ACTIVE: 'SHOW_ACTIVE'
    }

    // action 创建函数
    export function addTodo(text) {
        return {type: ADD_TODO, text}
    }

    export function completeTodo(index) {
        return {type: COMPLETE_TODO, index}
    }

    export function setVisibilityFilter(filter) {
        return {type: SET_VISIBILITY_FILTER, filter}
    }

    * 创建reducer

    import {combineReducers} from 'redux'
    import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './action'
    const { SHOW_ALL } = VisibilityFilters

    function visibilityFilter(state = SHOW_ALL, action) {
        switch (action.type) {
            case SET_VISIBILITY_FILTER:
                return action.filter
            default:
                return state
        }
    }

    function todos(state = [], action) {
        switch (action.type) {
            case ADD_TODO:
                return [
                    ...state,
                    {
                        text: action.text,
                        completed: false
                    }
                ]
            case COMPLETE_TODO:
                return [
                    ...state.slice(0, action.index),
                    Object.assign({}, state[action.index], {
                        completed: true
                    }),
                    ...state.slice(action.index + 1)
                ]
            default:
                return state
        }
    }

    // 通过combineReducers将多个reducer合并成一个rootReducer
    const todoApp = combineReducers({
        visibilityFilter,
        todos
    })

    export default todoApp

    这里通过Redux提供的combineReducers方法，将多个reducer聚合成一个rootReducer

    * 创建store

    import {createStore} from 'redux'
    import todoApp from './reducers'

    let store = createStore(todoApp)

    这里通过Redux提供的createStore方法，创建了store

    * 使用<Provider>包裹根组件

    import {Provider} from 'react-redux'

    export default class index extends Component {
        render () {
            return (
                <Provider store={store}>
                    <App />
                </Provider>
            )
        }
    }

    这里我们使用react-redux提供的<Provider>来包裹我们的根组件，让根组件的所有子组件都能使用 connect() 方法绑定 store

        * 包装 component:

            function selectTodos(todos, filter) {
                switch (filter) {
                    case VisibilityFilters.SHOW_ALL:
                        return todos
                    case VisibilityFilters.SHOW_COMPLETED:
                        return todos.filter(todo => todo.completed)
                }
            }

            // Which props do we want to inject, given the golobal state
            // Note: use https://github.com/faassen/reselect for better performance
            function select(state) {
                return {
                    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
                    visibilityFilter: state.visibilityFilter
                }
            }

            // 包装 component， 注入 dispatch 和 state 到其默认的 connect(select)(App) 中：
            export default connect(select)(App)

            通过上述代码我们声明App组件需要整个store中的哪一部分数据作为自己的props，这里用到了connect，我们将select作为
            参数传给connect，connect会返回一个生成组件函数，然后我们将App组件当做参数传给这个函数

            connect 是一个高阶函数，首先传入mapStateToProps,mapDispatchToProps，然后返回一个生产Component的函数wrapWithConnect,
            然后再将真正的Component作为参数传入wrapWithConnect(MyComponent)，这样就生产出一个经过包裹的Connect组件

        * 发送(dispatch)action

            render () {
                // Injected by connect() call
                const { dispatch, visibleTodos, visibilityFilter } = this.props
                return (
                    <View>
                        <AddTodo
                            onAddClick = {text =>
                                dispatch(addTodo(text))
                            }
                            toast = {this.toast}
                        />
                        <TabBar
                            filter = {visibilityFilter}
                            onFilterChange = {nextFilter =>
                                dispatch(setVisibilityFilter(nextFilter))
                            }
                        />
                        <TodoList
                            todos = {visibleTodos}
                            onTodoClick = { index =>
                                dispatch(completeTodo(index))
                            }
                            toast = {this._toast()}
                        />
                        <Toast ref={toast => this.toast = toast} />
                    </View>
                )
            }

            在这里我们通过dispatch将action发送到store，store会将这个action分发给reducer,reducer会创建当前state的副本，然后
            修改该副本并返回一个新的state，这样一来store树将被更新，然后对应组件的props将被更新，从而组件被更新

# 在React Native中使用Redux和react-navigation组合

    在使用 React Navigation 的项目中，想要集成redux就必须要引入 react-navigation-redux-helpers 这个库

# 第一步： 安装react-navigation-redux-helpers

    npm install --save react-navigation-redux-helpers

# 第二步： 配置Navigation

    import React from 'react'
    import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
    import { connect } from 'react-redux'
    import { createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers'

    export const rootCon = 'Init' // 设置根路由

    export const RootNavigator = createSwitchNavigator({
        ...
    })

    /*
        1.初始化react-navigation与redux的中间件，
          该方法的一个很大的作用就是为reduxifyNavigator的key设置actionSubscribers（行为订阅者）
          设置订阅者 @https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js #L29
          检测订阅者是否存在 @https://github.com/react-navigator/react-navigation-redux-helpers/blob/master/src/middleware.js #97
          @type {Middleware}
    */
    export const middleware = createReactNavigationReduxMiddleware(
        'root',
        state => state.nav
    )

    /*
        2.将根导航器组件传递给 reduxifyNavigator 函数
          并返回一个将navigation state 和 dispatch 函数作为 props的新组件
          注意：要在createReactNavigationReduxMiddleware之后执行
    */
    const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root')

    /*
        State到Props的映射关系
    */
    const mapStateToProps = state => ({
        state: state.nav
    })

    /*
        3.连接 React 组件与 Redux store
    */
    export default connect(mapStateToProps)(AppWithNavigationState)


# 第二步： 配置 Reducer

    import { combineReducers } from 'redux'
    import theme from './theme'
    import { rootCom, RootNavigator } from '../navigator/AppNavigator'

    // 1. 指定默认state
    const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom))

    // 2. 创建自己的 navigation reducer
    const navReducer = (state = navState, action) => {
        const nextState = RootNavigator.router.getStateForAction(action, state)
        // 如果 nextState 为 null或未定义，只需返回原始 state
        return nextState || state
    }

    // 3.合并reducer
    const index = combineReducers({
        nav: navReducer,
        theme: theme
    })

    export default index

#第三步： 配置store

    import {applyMiddleware, createStore} from 'redux'
    import thunk from 'redux-thunk'
    import reducers from '../reducer'
    import {middleware} from '../navigator/AppNavigator'

    const middlewares = [
        middleware
    ]

    // 创建store
    export default createStore(reducers, applyMiddleware(...middlewares))

#第四步： 在组件中应用

    import React, {Component} from 'react'
    import {Provider} from 'react-redux'
    import AppNavigator from './navigator/AppNavigator'
    import store from './store'

    type Props = {}

    export default class App extends Component<Props> {
        render () {
            // 将store传递给App框架
            return <Provider store={store}>
                <AppNavigator />
            </Provider>
        }
    }

经过上述4步呢，我们已经完成了react-navigator + redux 的集成， 那么如何使用它呢？

# 使用 react-navigation + redux

    1.订阅state

    import React from 'react'
    import {connect} from 'react-redux'

    class TabBarComponent extends React.Component {
        render () {
            return (
                <BottomTabBar
                    {...this.props}
                    activeTintColor = {this.props.theme}
                />
            )
        }
    }

    const mapStateToProps = state => ({
        theme: state.theme.theme
    })

    export default connect(mapStateToProps)(TabBarComponent)

    在上述代码中我们订阅了store中的theme state， 然后该组件就可以通过 this.props.theme 获取到所订阅的 theme state 了

    2. 触发action改变state

    import React, {Component} from 'react'
    import {connect} from 'react-redux'
    import {onThemeChange} from '../action/theme'

    class FavoritePage extends Component<Props> {
      render() {
          return (
            <View style={styles.container}>
              <Text style={styles.welcome}>FavoritePage</Text>
              <Button
                  title="改变主题色"
                  onPress={() => {
                      this.props.onThemeChange('#206')
                  }}
              />
            </View>
          );
      }
    }

    const mapStateToProps = state => ({})

    const mapDispatchToProps = dispatch => ({
        onThemeChange: theme => dispatch(actions.onThemeChange(theme))
    })

    export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage)

    触发action有两种方式：
        * 一种是通过mapDispatchToProps将dispatch创建函数和props绑定，这样就可以通过 this.props.onThemeChange('#096') 调用
          这个dispatch创建函数来触发onThemeChange action了
        * 另外一种方式是通过this.props中的navigation来获取dispatch，然后通过这个dispatch手动触发一个action

            let {dispatch} = this.props.navigation
            dispatch(onThemeChange('red'))

#在Redux+react-navigation场景中处理Android中的物理返回键

    在Redux+react-navigation场景中处理Android的物理返回键需要注意当前路由的所在位置，然后根据指定路由的索引位置来进行操作，
    这里需要用到BackHandler

    import React, {Component} from 'react'
    import {BackHandler} from 'react-native'
    import {NavigationActions} from 'react-navigation'
    import {connect} from 'react-redux'
    import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
    import NavigatorUtil from '../navigator/NavigatorUtil'

    type Props = {}

    class HomePage extends Component<Props> {
        componentDidMount () {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
        }

        componentWillUnmount () {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
        }

        /*
            处理 Android 中的物理返回键
            https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-
        */
        onBackPress = () => {
            const {dispatch, nav} = this.props
            if (nav.routes[1].index === 0) { // 如果RootNavigator中的MainNavigator的index为0，则不处理
                return false
            }
            dispatch(NavigationAction.back())
            return true
        }

        render () {
            return <DynamicTabNavigator />
        }
    }

    const mapStateToProps = state => ({
        nav: state.nav
    })

    export default connect(mapStateToProps)(HomePage)


emulator -avd a81
