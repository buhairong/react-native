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
import BackPressComponent from "../common/BackPressComponent";
import LanguageDao from "../expand/dao/LanguageDao";

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

const pageSize = 10

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

type Props = {};
class SearchPage extends Component<Props> {
    constructor (props) {
        super(props)
        this.params = this.props.navigation.state.params
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)})
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.isKeyChange = false
    }

    componentDidMount() {
        this.backPress.componentDidMount()
    }

    componentWillUnmount () {
        this.backPress.componentWillUnmount()
    }

    loadData(loadMore) {
        const {onLoadMoreSearch, onSearch, search, keys} = this.props
        if (loadMore) {
            onLoadMoreSearch(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
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
    search: state.search,
    keys: state.language.keys
})

const mapDispatchToProps = dispatch => ({
    onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callBack) =>dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack)),
    onSearchCancel: (token) =>dispatch(actions.onSearchCancel(token)),
    onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callBack) =>dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callBack)),
    onLoadLanguage: (flag) =>dispatch(actions.onLoadLanguage(flag))
})

// 注意： connect只是个function, 并不一定非要放在export后面
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)

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