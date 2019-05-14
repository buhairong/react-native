import {createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator} from 'react-navigation'
import React from 'react'
import {Button, Platform} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import HomePage from '../page/HomePage'
import Page1 from '../page/Page1'
import Page2 from '../page/Page2'
import Page3 from '../page/Page3'
import Page4 from '../page/Page4'
import Page5 from '../page/Page5'

const AppTopNavigator = createMaterialTopTabNavigator({
        Page1:{
            screen: Page1,
            navigationOptions: {
                tabBarLabel: 'All'
            }
        },
        Page2:{
            screen: Page2,
            navigationOptions: {
                tabBarLabel: 'ios'
            }
        },
        Page3:{
            screen: Page3,
            navigationOptions: {
                tabBarLabel: 'React'
            }
        },
        Page4:{
            screen: Page4,
            navigationOptions: {
                tabBarLabel: 'React Native'
            }
        },
        Page5:{
            screen: Page5,
            navigationOptions: {
                tabBarLabel: 'Devio'
            }
        }
    },{
        tabBarOptions:{
            tabStyle:{
                mindWidth: 50
            },
            upperCaseLabel: false, // 是否使标签大写，默认为true
            scrollEnabled: true, // 是否支持 选项卡滚动，默认为false
            style: {
                backgroundColor: '#678' // TabBar 的背景色
            },
            indicatorStyle: {
                height: 2,
                backgroundColor: 'white'
            }, // 标签指示器的样式
            labelStyle: {
                fontSize: 13,
                marginTop: 6,
                marginBottom: 6
            }, // 文字的样式
        }
    }
)

const AppBottomNavigator = createBottomTabNavigator({
        Page1:{
            screen: Page1,
            navigationOptions: {
                tabBarLabel: '最热',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name = {'ios-home'}
                        size = {26}
                        style = {{color: tintColor}}
                    />
                )
            }
        },
        Page2:{
            screen: Page2,
            navigationOptions: {
                tabBarLabel: '趋势',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name = {'ios-people'}
                        size = {26}
                        style = {{color: tintColor}}
                    />
                )
            }
        },
        Page3:{
            screen: Page3,
            navigationOptions: {
                tabBarLabel: '收藏',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name = {'ios-chatboxes'}
                        size = {26}
                        style = {{color: tintColor}}
                    />
                )
            }
        },
        Page4:{
            screen: Page4,
            navigationOptions: {
                tabBarLabel: '我的',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name = {'ios-aperture'}
                        size = {26}
                        style = {{color: tintColor}}
                    />
                )
            }
        }
    },{
        tabBarOptions:{
            activeTintColor: Platform.OS === 'ios' ? '#e91e63' : '#fff',
        }
    }
)

export const AppStackNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage
    },
    Page1: {
        screen: Page1,
        navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.name}页面名` // 动态配置
        })
    },
    Page2: {
        screen: Page2,
        navigationOptions: { // 在这里定义每个页面的导航数据，静态配置
            title: 'This is Page2'
        }
    },
    Page3: {
        screen: Page3,
        navigationOptions: (props) => {
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
    },
    Page4: {
        screen: Page4,
        navigationOptions: { // 在这里定义每个页面的导航数据，静态配置
            title: 'This is Page4'
        }
    },
    Page5: {
        screen: Page5,
        navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.name}页面名`
        })
    },
    Bottom: {
        screen: AppBottomNavigator,
        navigationOptions: { // 在这里定义每个页面的导航数据，静态配置
            title: 'BottomNavigator'
        }
    },
    Top: {
        screen: AppTopNavigator,
        navigationOptions: { // 在这里定义每个页面的导航数据，静态配置
            title: 'TopNavigator'
        }
    }
})