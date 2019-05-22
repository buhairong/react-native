/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator, SectionList} from 'react-native';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

const CITY_NAMES = [{data: ['北京', '上海', '广州', '深圳'], title: '一线'},
                     {data: ['杭州', '苏州', '成都', '武汉', '郑州'], title: '二线'},
                    {data: ['洛阳', '厦门', '青岛', '拉萨'], title: '三线'}]

export default class SectionListDemo extends Component<Props> {
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

    _renderSectionHeader ({section}) {
        return <View style={styles.sectionHeader}>
            <Text style={styles.text}>
                {section.title}
            </Text>
        </View>
    }

    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    sections = {this.state.dataArray}
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
                    renderSectionHeader = {(data) => this._renderSectionHeader(data)}
                    ItemSeparatorComponent = {() => <View style={styles.separator} />}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    item: {
        height: 80,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 20
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    },
    sectionHeader: {
        height: 50,
        backgroundColor: '#93ebbe',
        alignItems: 'center',
        justifyContent: 'center'
    },
    separator: {
        height: 1,
        backgroundColor: 'gray',
        flex: 1
    }
});
