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
import TrendingItem from "../common/TrendingItem";
import EventTypes from "../util/EventTypes";

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const pageSize = 10

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

type Props = {};
export default class FavoritePage extends Component<Props> {
    constructor (props) {
        super(props)
        this.tabNames=['最热', '趋势']
    }

    render () {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        }

        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style = {{backgroundColor: THEME_COLOR}}
        />
        const TabNavigator = createMaterialTopTabNavigator({
                'Popular': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />, // 初始化Component时
                    navigationOptions: {
                        title: '最热'
                    }
                },
                'Trending': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} />, // 初始化Component时
                    navigationOptions: {
                        title: '趋势'
                    }
                },
            }, {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false, // 是否使标签大写，默认为true
                    style: {
                        backgroundColor: '#678', // TabBar 的背景颜色
                        height: 30 // fix 开启scrollEnabled后再Android上初次加载时闪烁问题
                    },
                    indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
                    labelStyle: styles.labelStyle, // 文字的样式
                }
            }
        )
        const StackNavigatorContainer = createAppContainer(TabNavigator)
        return <View style={{flex:1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
            {navigationBar}
            <StackNavigatorContainer/>
        </View>
    }
}

class FavoriteTab extends Component<Props> {
    constructor(props) {
        super(props)
        const {flag} = this.props
        this.storeName = flag
        this.favoriteDao = new FavoriteDao(flag)
    }

    componentDidMount() {
        this.loadData()
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
            if (data.to === 2) {
                this.loadData(false)
            }
        })
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener)
    }

    loadData(isShowLoading) {
        const {onLoadFavoriteData} = this.props
        onLoadFavoriteData(this.storeName, isShowLoading)
    }

    /*
        获取与当前页面有关的数据
    */
    _store () {
        const {favorite} = this.props
        console.log('storeName='+this.storeName)
        console.log('storeName1='+JSON.stringify(favorite))
        let store = favorite[this.storeName]

        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [], // 要显示的数据
            }
        }
        return store
    }

    onFavorite(item, isFavorite) {
        FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag)
        if (this.storeName === FLAG_STORAGE.flag_popular) {
            EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular)
        } else {
            EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending)
        }
    }

    renderItem(data) {
        const item =data.item
        const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
        return <Item
            projectModels={item}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    projectModels:item,
                    flag: this.storeName,
                    callback
                }, 'DetailPage')
            }}
            onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
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
                    keyExtractor = {item => '' + (item.item.id || item.item.fullName)}
                    refreshControl = {
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(true)}
                            tintColor={THEME_COLOR}
                        />
                    }
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
    favorite: state.favorite
})

const mapDispatchToProps = dispatch => ({
    onLoadFavoriteData: (storeName, isShowLoading) =>dispatch(actions.onLoadFavoriteData(storeName, isShowLoading))
})

// 注意： connect只是个function, 并不一定非要放在export后面
const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab)

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
