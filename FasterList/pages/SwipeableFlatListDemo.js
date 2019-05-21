/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator, SwipeableFlatList, TouchableHighlight} from 'react-native';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

const CITY_NAMES = ['北京', '上海', '广州', '深圳', '杭州', '苏州', '成都', '武汉', '郑州', '洛阳', '厦门', '青岛', '拉萨']

export default class SwipeableFlatListDemo extends Component<Props> {
    constructor (props) {
        super(props)
        this.state = {
            isLoading: false,
            dataArray: CITY_NAMES
        }
    }

    _renderItem (data) {
        return <View style={styles.item}>
            <Text style={styles.text}>
                {data.item}
            </Text>
        </View>
    }

    loadData (refreshing) {
        if (refreshing) {
            this.setState({
                isLoading: true
            })
        }

        setTimeout(() => {
            let dataArray = []

            if (refreshing) {
                for (let i = this.state.dataArray.length -1; i >= 0; i--) {
                    dataArray.push(this.state.dataArray[i])
                }
            } else {
                dataArray = this.state.dataArray.concat(CITY_NAMES)
            }

            this.setState({
                dataArray: dataArray,
                isLoading: false
            })
        }, 2000)
    }

    genIndicator () {
        return <View style = {styles.indicatorContainer}>
            <ActivityIndicator
                style = {styles.indicator}
                size = {'large'}
                color = {'red'}
                animating = {true}
            />
            <Text>正在加载更多...</Text>
        </View>
    }

    genQuickActions () {
        return <View style = {styles.quickContainer}>
            <TouchableHighlight
                onPress = {() => {
                    alert('确认删除？')
                }}
            >
                <View>
                    <Text style = {styles.quick}>删除</Text>
                </View>
            </TouchableHighlight>
        </View>
    }

    render() {
        return (
            <View style={styles.container}>
                <SwipeableFlatList
                    data = {this.state.dataArray}
                    renderItem = {(data) => this._renderItem(data)}
                    /*refreshing = {this.state.isLoading}
                    onRefresh = {() => {
                        this.loadData()
                    }}*/
                    refreshControl = {
                        <RefreshControl
                            title = {'Loading'}
                            colors = {['red']}
                            tintColor = {'orange'}
                            titleColor = {'red'}
                            refreshing = {this.state.isLoading}
                            onRefresh = {() => {
                                this.loadData(true)
                            }}
                        />
                    }
                    ListFooterComponent = {() => this.genIndicator()}
                    onEndReached = {() => {this.loadData()}}
                    renderQuickActions = {() => this.genQuickActions()}
                    maxSwipeDistance = {100}
                    bounceFirstRowOnMount = {false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        backgroundColor: '#169',
        height: 100,
        marginRight: 15,
        marginLeft: 15,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        fontSize: 20
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    },
    quick: {
        backgroundColor: 'red',
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 10,
        width: 200,
        color: '#000'
    },
    quickContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 15,
        marginBottom: 15
    }
});
