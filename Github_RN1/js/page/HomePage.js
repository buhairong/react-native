import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
    createBottomTabNavigator,
    createStackNavigator,
    createAppContainer
} from 'react-navigation'

import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './MyPage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'

type Props = {};

const TabNavigator = createBottomTabNavigator({
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '最热',
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons
                    name = {'whatshot'}
                    size = {26}
                    style = {{color: tintColor}}
                />
            )
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name = {'md-trending-up'}
                    size = {26}
                    style = {{color: tintColor}}
                />
            )
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '收藏',
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons
                    name = {'favorite'}
                    size = {26}
                    style = {{color: tintColor}}
                />
            )
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor, focused}) => (
                <Entypo
                    name = {'user'}
                    size = {26}
                    style = {{color: tintColor}}
                />
            )
        }
    }
})

const StackNavigator = createStackNavigator({
        Home: {
            screen: TabNavigator,
            navigationOptions: {
                header: null // 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
            }
        }
})

const StackNavigatorContainer = createAppContainer(StackNavigator)

export default class HomePage extends Component<Props> {
  render() {
    return <StackNavigatorContainer />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
