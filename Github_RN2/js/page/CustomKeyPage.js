import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, FlatList, RefreshControl, ActivityIndicator, DeviceInfo} from 'react-native';
import {connect} from 'react-redux'
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'

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
import ViewUtil from "../util/ViewUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import LanguageDao from "../expand/dao/LanguageDao";

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const pageSize = 10

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

type Props = {};
class CustomKeyPage extends Component<Props> {
    constructor (props) {
        super(props)
        this.params = this.props.navigation.state.params
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)})
        this.changeValues = []
        this.isRemoveKey = !!this.params.isRemoveKey
        this.languageDao = new LanguageDao(this.params.flag)
        this.state = {
            keys: []
        }
    }

    static getDerivedStateFromProps (nextProps, prevState) {
        if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
            return {
                keys: CustomKeyPage._keys(nextProps, null, prevState)
            }
        }
        return null
    }

    componentDidMount () {
        this.backPress.componentDidMount()
        // 如果props中标签为空则从本地存储中获取标签
        if (CustomKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props
            onLoadLanguage(this.params.flag)
        }
        this.setState({
            keys: CustomKeyPage._keys(this.props)
        })
    }

    componentWillUnmount () {
        this.backPress.componentWillUnmount()
    }

    /*
        获取标签
    */
    static _keys(props, original, state) {
        const {flag, isRemoveKey} = props.navigation.state.params
        let key = flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages"
        if (isRemoveKey && !original) {

        } else {
            return props.language[key]
        }
    }

    onBackPress (e) {
        this.onBack()
        return true
    }

    onSave () {

    }

    renderView () {
        let dataArray = this.state.keys
        if (!dataArray || dataArray.length === 0) return
        let len = dataArray.length
        let views = []
        for (let i=0, l=len; i<l;i+=2) {
            views.push(
               <View keys={i}>
                   <View style={styles.item}>
                       {this.renderCheckBox(dataArray[i], i)}
                       {i + 1 < len && this.renderCheckBox(dataArray[i+1], i+1)}
                       <View style={styles.line}/>
                   </View>
               </View>
            )
        }
    }

    onClick (data, index) {

    }

    _checkedImage (checked) {
        const {theme} = this.params
        return <Ionicons
            name = {checked ? 'ios-checkbox' : 'md-square-outline'}
            size = {20}
            style = {{color: THEME_COLOR}}
        />
    }

    renderCheckBox (data, index) {
        return <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={() => this.onClick(data, index)}
            isChecked={data.isChecked}
            leftText={data.name}
            checkedImage={this._checkedImage(true)}
            unCheckedImage={this._checkedImage(false)}
        />
    }

    render () {
        let title = this.isRemoveKey ? '标签移除' : '自定义标签'
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title
        let rightButtonTitle = this.isRemoveKey ? '移除': '保存'

        let navigationBar = <NavigationBar
            title={title}
            style = {{backgroundColor: THEME_COLOR}}
            rightButton = {ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
        />
        return <View style={styles.container}>
            {navigationBar}
            <ScrollView>
                {this.renderView()}
            </ScrollView>
        </View>
    }
}

const mapPopularStateToProps = state => ({
    language: state.language
})

const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        flexDirection: 'row'
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray'
    }
})