import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, FlatList, RefreshControl, ActivityIndicator, DeviceInfo} from 'react-native';
import {connect} from 'react-redux'
import actions from '../action/index'
import {
    createAppContainer,
    createMaterialTopTabNavigator
} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'

import NavigationBar from '../common/NavigationBar'
import PopularItem from '../common/PopularItem'
import NavigationUtil from '../navigator/NavigationUtil'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventTypes from "../util/EventTypes";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

const pageSize = 10

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

type Props = {};
class PopularPage extends Component<Props> {
    constructor (props) {
        super(props)
        const {onLoadLanguage} = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_key)
    }

    _genTabs () {
        const tabs = {}
        const {keys, theme} = this.props
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`]={
                    screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme} />,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        })
        return tabs
    }

    render () {
        const {keys, theme} = this.props
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content'
        }

        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style = {theme.styles.navBar}
        />
        const TabNavigator = keys.length ? createMaterialTopTabNavigator(
            this._genTabs(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false, // 是否使标签大写，默认为true
                    scrollEnabled: true, // 是否支持 选项卡滚动， 默认false
                    style: {
                        backgroundColor: theme.themeColor, // TabBar 的背景颜色
                        height: 30 // fix 开启scrollEnabled后再Android上初次加载时闪烁问题
                    },
                    indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
                    labelStyle: styles.labelStyle, // 文字的样式
                },
                lazy: true
            }
        ) : null
        const StackNavigatorContainer = TabNavigator ? createAppContainer(TabNavigator) : null
        return <View style={{flex:1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
            {navigationBar}
            {StackNavigatorContainer && <StackNavigatorContainer/>}
        </View>
    }
}

const mapPopularStateToProps = state => ({
    keys: state.language.keys,
    theme: state.theme.theme
})

const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage)

class PopularTab extends Component<Props> {
    constructor(props) {
        super(props)
        const {tabLabel} = this.props
        this.storeName = tabLabel
        this.isFavoriteChanged = false
    }

    componentDidMount() {
        this.loadData()
        EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true
        })
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
            if (data.to === 0 && this.isFavoriteChanged) {
                this.loadData(null, true)
            }
        })
    }

    componentWillUnmount () {
        EventBus.getInstance().removeListener(this.favoriteChangeListener)
        EventBus.getInstance().removeListener(this.bottomTabSelectListener)
    }

    loadData(loadMore,refreshFavorite) {
        const {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} = this.props
        const store = this._store()
        const url = this.genFetchUrl(this.storeName)
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else if (refreshFavorite) {
            onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        } else {
            onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
        }
    }

    /*
        获取与当前页面有关的数据
    */
    _store () {
        const {popular} = this.props
        let store = popular[this.storeName]

        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [], // 要显示的数据
                hideLoadingMore: true // 默认隐藏加载更多
            }
        }
        return store
    }

    genFetchUrl(key) {
        return URL + key + QUERY_STR
    }

    renderItem(data) {
        const item =data.item
        const {theme} = this.props
        return <PopularItem
            projectModels={item}
            theme={theme}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    theme,
                    projectModels:item,
                    flag: FLAG_STORAGE.flag_popular,
                    callback
                }, 'DetailPage')
            }}
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
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
        const {theme} = this.props
        return (
            <View style={styles.container}>
              <FlatList
                data={store.projectModels}
                renderItem={data => this.renderItem(data)}
                keyExtractor = {item => '' + item.item.id}
                refreshControl = {
                    <RefreshControl
                        title={'Loading'}
                        titleColor={theme.themeColor}
                        colors={[theme.themeColor]}
                        refreshing={store.isLoading}
                        onRefresh={() => this.loadData()}
                        tintColor={theme.themeColor}
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
    popular: state.popular
})

const mapDispatchToProps = dispatch => ({
    onRefreshPopular: (storeName, url, pageSize, favoriteDao) =>dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) =>dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) =>dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao))
})

// 注意： connect只是个function, 并不一定非要放在export后面
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

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
})