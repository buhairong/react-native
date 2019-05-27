import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation'
import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import NavigationUtil from "../navigator/NavigationUtil";

type Props = {};

const TABS = { // 在这里配置页面的路由
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: "最热",
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
            tabBarLabel: "趋势",
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
            tabBarLabel: "收藏",
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
            tabBarLabel: "我的",
            tabBarIcon: ({tintColor, focused}) => (
                <Entypo
                    name = {'user'}
                    size = {26}
                    style = {{color: tintColor}}
                />
            )
        }
    }
}

export default class DynamicTabNavigator extends Component<Props> {
    constructor (props) {
        super(props)
        console.disableYellowBox = true
    }

    _tabNavigator () {
        const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS
        const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage} //根据需要定制显示的tab
        PopularPage.navigationOptions.tabBarLabel = '最热' // 动态配置Tab属性
        return createBottomTabNavigator(tabs, { // 7:35
            tabBarComponent: null
        })
    }

  render() {
      NavigationUtil.navigation = this.props.navigation
      const Tab = this._tabNavigator()
      return <Tab />
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
