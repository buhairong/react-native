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

        * 包装 component: //4:35

            function selectTodos(todos, filter) {
                switch (filter) {
                    case VisibilityFilters.SHOW_ALL:
                        return todos
                    case VisibilityFilters.SHOW_COMPLETED:
                        return todos.filter(todo => todo.completed)
                }
            }