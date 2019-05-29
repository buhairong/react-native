#什么是Redux

Redux 是 JavaScript 状态容器，提供可预测化的状态管理，可以让你构建一致化的应用，运行于不同的环境（客户端、服务器、原生应用），并且易于测试。

我们过下整个工作流程：
1.用户（操作View）发出Action，发出方式就用到了dispatch方法
2.然后，Store自动调用Reducer，并且传入两个参数（当前State和收到的Action），Reducer会返回新的State，如果有Middleware，Store会将当前State和
  收到的Action传递给Middleware，Middleware会调用Reducer，然后返回新的State
3.State一旦有变化，Store就会调用监听函数，来更新View

到这儿为止，一次用户交互流程结束。可以看到，在整个流程中数据都是单向流动的

#Redux和Flux的对比

Redux是Flux思想的一种实现，同时又在其基础上做了改进。Redux秉承了Flux单向数据流、Store是唯一的数据源的思想

    * Redux中没有Dispatcher:它使用Store的Store.dispatch()方法来把action传给Store，由于所有的action处理都会经过
      这个Store.dispatch()方法，所以在Rexux中很容易实现Middleware机制。Middleware可以让你在reducer执行前与执行后
      进行拦截并插入代码，来达到操作action和Store的目的，这样一来就很容易实现灵活的日志打印、错误收集、API请求、路由等操作
    * Redux只有一个Store:Flux中允许有多个Store，但是Redux中只允许有一个，相较于多个Store的Flux，一个Store更加清晰，并
      易于管理

  Redux和Flux的最大不同是Redux没有Dispatcher且不支持多个store。Redux只有一个单一的store和一个根级的reduce函数(reducer),
  随着应用不断变大，我们需要将根级的reducer拆成多个小的reducers，分别独立地操作state树的不同部分，而不是添加新的store


#Redux优点

    * 可预测：始终有一个唯一的准确的数据源(single source of truth) 就是store，通过actions和reducers来保证整个应用状态同步，
              做到绝不混乱
    * 易维护：具备可预测的结果和严格的组织结构让代码更容易维护
    * 易测试：编写可测试代码的首要准则是编写可以仅做一件事并且独立的小函数（single responsibility principle），Redux的代码
              几乎全部都是这样的函数：短小、纯粹、分离


#为什么要用Redux

随着JavaScript应用越来越大，越来越复杂，我们需要管理的state变得越来越多。这些state可能包括服务器响应、缓存数据、本地生成
尚未持久化到服务器的数据，也包括UI状态，如激活的路由，被选中的标签，是否显示加载动效或者分页器等等

管理不断变化的state非常困难。如果一个model的变化会引起另一个model变化，那么当view变化时，就可能引起对应model以及另一个
model的变化，依次地，可能会引起另一个view的变化。直至你搞不清楚到底发生了什么。state在什么时候，由于什么原因，如何变化
已然不受控制。当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得非常复杂

虽然React试图在视图层禁止异步和直接操作DOM来解决这个问题。美中不足的是，React依旧把处理state中数据的问题留给了你。Redux就是
为了帮你解决这个问题


#Redux 的三个基本原则

    * 单一数据源：整个应用的state被储存在一棵object tree 中，并且这个 object tree只存在于唯一一个store中
    * State 是只读的：唯一改变state的方法就是触发action,action是一个用于描述已发生事件的普通对象
    * 使用纯函数来执行修改：为了描述action如何改变state tree,你需要编写reducers


# Redux有哪几部分构成

    * action：action就是一个描述发生什么的对象
    * reducer：形式为（state,action） => state 的纯函数，功能是根据action修改state将其转变成下一个state
    * store：用于存储state，你可以把它看成一个容器，整个应用只能有一个store

Redux应用中所有的state都以一个对象树的形式存储在一个单一的store中，唯一改变state的办法是触发action，action就是一个描述
发生什么的对象。为了描述action如何改变state树，你需要编写reducers

先看一个redux的简单使用例子：

import {createStore} from 'redux'

// 创建Redux reducer
/*
    这个一个 reducer,形式为 (state,action) => state 的纯函数
    描述了action如何把state转变成下一个state

    state 的形式取决于你，可以是基本类型、数组、对象
    当 state 变化时需要返回全新的对象，而不是修改传入的参数

    下面例子使用 'switch' 语句和字符串来做判断，但你可以写帮助类（helper）
    根据不同的约定（如方法映射）来判断，只要适用你的项目即可
*/
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}

// 创建Redux store 来存放应用的状态
// API是 { subscribe, dispatch, getState }
let store = createStore(counter)

// 可以手动订阅更新，也可以事件绑定到视图层
store.subscribe(() =>
    console.log(store.getState())
)

// 改变内部 state 唯一方法是 dispatch 一个 action
// action 可以被序列化，用日记记录和存储下来，后期还可以以回放的方式执行
store.dispatch({type: 'INCREMENT'})
// 1
store.dispatch({type: 'INCREMENT'})
// 2
store.dispatch({type: 'DECREMENT'})
// 1

以上代码便是一个redux的最简单的使用，接下来我们来分别介绍一个redux的三大组成部分：action、reducer以及store

#action

Action 是把数据从应用传到store的有效载荷。它是store数据的唯一来源，也就是说要改变store中的state就需要触发一个action

Action 本质上是一个普通的JavaScript对象。action 内必须使用一个字符串类型的type字段来表示将要执行的动作，除了type字段外，
action对象的结构完全由你自己决定。多数情况下，type会被定义成字符串常量。当应用规模越来越大时，建议使用单独的模块或文件
来存放action

import { ADD_TODO, REMOVE_TODO} from '../actionTypes'

// action
{
    type: ADD_TODO,
    text: 'Build my first Redux app'
}

提示：使用单独的模块或文件来定义action type常量并不是必须的，甚至根本不需要定义。对于小应用来说，使用字符串做action type
      更方便些。不过，在大型应用中把它们显式地定义成常量还是利大于弊的

# Action 创建函数

Action 创建函数就是生成action的方法。"action" 和 "action创建函数" 这两个概念很容易混在一起，使用时最好注意区分

在Redux中action创建函数只是简单的返回一个 action

function addTodo (text) {
    return {
        type: ADD_TODO
        text
    }
}

这样做将使action创建函数更容易被移植和测试


# reducer

reducer是根据action修改state将其转变成下一个state，记住actions只是描述了有事情发生了这一事实，并没有描述应用如何更新state

(previousState, action) => newState

保持 reducer 纯净非常重要。永远不要在reducer里做这些操作：

    * 修改传入参数
    * 执行有副作用的操作，如API请求和路由跳转
    * 调用非纯函数，如 Date.now() 或 Math.random()

    提示：reducer 是纯函数。它仅仅用于计算下一个state。它应该是完全可预测的：多次传入相同的输入必须产生相同的输出。它不应做有
          副作用的操作。如API调用或路由跳转。这些应该在dispatch action前发生


// render
function todoApp(state = initialState, action){
    switch(action.type){
        case SET_VISIBILITY_FILTER
            return Object.assign({}, state, {
                visibilityFilter: action.filter
            })
        default:
            return state
    }
}

提示：

    * 不要修改state。使用 Object.assign() 新建了一个副本。不能这样使用 Object.assign(state, { visibilityFilter: action.filter })，
      因为它会改变第一个参数的值。你必须把第一个参数设置为空对象。你也可以开启对ES7提案对象展开运算符的支持，从而使用
      { ...state.visibilityFilter: action.filter } 达到相同的目的
    * 在 default 情况下返回旧的 state。遇到未知的 action 时，一定要返回旧的 state


# 拆分与合并Reducer

    function onAction(state = defaultState, action) {
        switch (action.type) {
            case Types.THEME_CHANGE: // 主题
                return {
                    ...state,
                    theme: action.theme
                }
            case Types.SHOW_THEME_VIEW: // 主题
                return {
                    ...state,
                    customThemeViewVisible: action.customThemeViewVisible
                }
            case Types.SORT_LANGUAGE: // 排序
                return Object.assign({}, state, {
                    checkedArray: action.checkedArray
                })
            case Types.REFRESH_ABOUT: // 关于
                return Object.assign({}, state, {
                    [action.flag]: {
                        ...state[action.flag],
                        projectModels: action.projectModels
                    }
                })
            case Types.ABOUT_SHOW_MORE: // 关于
                return Object.assign({}, state, {
                    me: {
                        ...state.me,
                        [action.menuFlag]: action.menuShow
                    }
                })
            default:
                return state
        }
    }

上述代码看起来有些冗长，并且主题、排序、关于的更新看起来是相互独立的，能不能将他们拆到单独的函数或文件里呢，答案是可以的

拆分：
3:33







































