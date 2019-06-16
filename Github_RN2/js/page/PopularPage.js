import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import {
    createAppContainer,
    createMaterialTopTabNavigator
} from 'react-navigation'

import NavigationUtil from '../navigator/NavigationUtil'

type Props = {};
export default class PopularPage extends Component<Props> {
    constructor (props) {
        super(props)
        this.tabNames=['Java', 'Android', 'iOS', 'React', 'React Native', 'PHP']
    }

    _genTabs () {
        const tabs = {}
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`]={
                screen: props => <PopularTab {...props} tabLabel={item} />,
                navigationOptions: {
                    title: item
                }
            }
        })
        return tabs
    }

    render () {
        const TabNavigator = createMaterialTopTabNavigator(
            this._genTabs(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false, // 是否使标签大写，默认为true
                    scrollEnabled: true, // 是否支持 选项卡滚动， 默认false
                    style: {
                        backgroundColor: '#678' // TabBar 的背景颜色
                    },
                    indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
                    labelStyle: styles.labelStyle, // 文字的样式
                }
            }
        )
        const StackNavigatorContainer = createAppContainer(TabNavigator)
        return <View style={{flex:1}}>
          <StackNavigatorContainer/>
        </View>
    }
}

class PopularTab extends Component<Props> {
    render() {
        const {tabLabel} = this.props
        return (
            <View style={styles.container}>
              <Text style={styles.welcome}>{tabLabel}</Text>
              <Text onPress={() => {
                  NavigationUtil.goPage({
                      navigation: this.props.navigation
                  }, 'DetailPage')
              }}>跳转到详情页</Text>
                <Button
                    title={'Fetch 使用'}
                    onPress={() => {
                        NavigationUtil.goPage({
                            navigation: this.props.navigation
                        }, 'FetchDemoPage')
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabStyle: {
        minWidth: 50
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6,
    }
});
