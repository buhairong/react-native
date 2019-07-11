import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, FlatList, RefreshControl, ActivityIndicator, DeviceInfo, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action/index'
import {
    createAppContainer,
    createMaterialTopTabNavigator
} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import NavigationBar from '../common/NavigationBar'
import TrendingItem from '../common/TrendingItem'
import TrendingDialog, {TimeSpans} from "../common/TrendingDialog";
import NavigationUtil from '../navigator/NavigationUtil'
import FavoriteUtil from "../util/FavoriteUtil"
import {FLAG_STORAGE} from "../expand/dao/DataStore"
import FavoriteDao from "../expand/dao/FavoriteDao"
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao"
import ArrayUtil from "../util/ArrayUtil";

const URL = 'https://github.com/trending/'
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const pageSize = 10
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)

type Props = {};

class TrendingPage extends Component<Props> {
    constructor (props) {
        super(props)
        this.state = {
            timeSpan: TimeSpans[0]
        }
        const {onLoadLanguage} = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_language)
        this.prekeys = []
    }

    _genTabs () {
        const tabs = {}
        const {keys} = this.props
        this.prekeys = keys
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`]={
                    screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} />,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        })
        return tabs
    }

    renderTitleView () {
        return <View>
            <TouchableOpacity
                underlayColor='transparent'
                onPress={() => this.dialog.show()}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 18, color: '#fff', fontWeight: '400'}}>
                        趋势 {this.state.timeSpan.showText}
                    </Text>
                    <MaterialIcons
                        name={'arrow-drop-down'}
                        size={22}
                        style={{color: 'white'}}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    onSelectTimeSpan (tab) {
        this.dialog.dismiss()
        this.setState({
            timeSpan: tab
        })
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)
    }

    renderTrendingDialog () {
        return <TrendingDialog
            ref={dialog => this.dialog=dialog}
            onSelect={(tab) => this.onSelectTimeSpan(tab)}
        />
    }

    tabNav () {
        if (this.Tabs && ArrayUtil.isEqual(this.prekeys, this.props.keys)) {
            return this.Tabs
        }

        const TabNavigator = createMaterialTopTabNavigator(
            this._genTabs(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false, // 是否使标签大写，默认为true
                    scrollEnabled: true, // 是否支持 选项卡滚动， 默认false
                    style: {
                        backgroundColor: '#678', // TabBar 的背景颜色
                        height: 30 // fix 开启scrollEnabled后再Android上初次加载时闪烁问题
                    },
                    indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
                    labelStyle: styles.labelStyle, // 文字的样式
                }
            }
        )
        return this.Tabs = createAppContainer(TabNavigator)
    }

    render () {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        }

        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style = {{backgroundColor: THEME_COLOR}}
        />
        const TabNavigator = createMaterialTopTabNavigator(
            this._genTabs(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false, // 是否使标签大写，默认为true
                    scrollEnabled: true, // 是否支持 选项卡滚动， 默认false
                    style: {
                        backgroundColor: '#678', // TabBar 的背景颜色
                        height: 30 // fix 开启scrollEnabled后再Android上初次加载时闪烁问题
                    },
                    indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
                    labelStyle: styles.labelStyle, // 文字的样式
                }
            }
        )
        const StackNavigatorContainer = this.tabNav()
        return <View style={{flex:1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
            {navigationBar}
            <StackNavigatorContainer/>
            {this.renderTrendingDialog()}
        </View>
    }
}

const mapPopularStateToProps = state => ({
    keys: state.language.languages
})

const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(TrendingPage)

class TrendingTab extends Component<Props> {
    constructor(props) {
        super(props)
        const {tabLabel, timeSpan} = this.props
        this.storeName = tabLabel
        this.timeSpan = timeSpan
    }

    componentDidMount() {
        this.loadData()
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan
            this.loadData()
        })
    }

    componentWillUnmount () {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove()
        }
    }

    loadData(loadMore) {
        const {onRefreshTrending, onLoadMoreTrending} = this.props
        const store = this._store()
        const url = this.genFetchUrl(this.storeName)
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else {
            onRefreshTrending(this.storeName, url, pageSize)
        }
    }

    /*
        获取与当前页面有关的数据
    */
    _store () {
        const {trending} = this.props
        let store = trending[this.storeName]
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModes: [], // 要显示的数据
                hideLoadingMore: true // 默认隐藏加载更多
            }
        }
        return store
    }

    genFetchUrl(key) {
        return URL + key + '?' + this.timeSpan.searchText
    }

    renderItem(data) {
        const item =data.item
        return <TrendingItem
            projectModels={item}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    projectModels:item,
                    flag: FLAG_STORAGE.flag_trending,
                    callback
                }, 'DetailPage')
            }}
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
        />
    }

    genIndicator() {
        return this._store().hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }

    render() {
        let store = this._store()

        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor = {item => '' + (item.id || item.fullName)}
                    refreshControl = {
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => {
                        setTimeout(() => {
                            if (this.canLoadMore) {
                                this.loadData(true)
                                this.canLoadMore = false
                            }
                        }, 100)
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true // fix 初始化滚动调用onEndReached的问题
                    }}
                />
                <Toast
                    ref={'toast'}
                    position={'center'}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    trending: state.trending
})

const mapDispatchToProps = dispatch => ({
    onRefreshTrending: (storeName, url, pageSize, favoriteDao) =>dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) =>dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callBack))
})

// 注意： connect只是个function, 并不一定非要放在export后面
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabStyle: {
        //minWidth: 50 // fix minWidth 会导致tabStyle初次加载时闪烁
        padding: 0
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        margin: 0
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    }
});
