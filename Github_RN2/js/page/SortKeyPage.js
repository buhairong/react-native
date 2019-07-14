import React, {Component} from 'react';
import {TouchableHighlight, StyleSheet, Alert, View, Text} from 'react-native';
import {connect} from 'react-redux'
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SortableListView from 'react-native-sortable-listview'

import actions from '../action/index'
import NavigationBar from '../common/NavigationBar'
import NavigationUtil from '../navigator/NavigationUtil'
import ViewUtil from "../util/ViewUtil";
import ArrayUtil from "../util/ArrayUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import LanguageDao from "../expand/dao/LanguageDao";

const THEME_COLOR = '#678'

type Props = {};
class SortKeyPage extends Component<Props> {
    constructor (props) {
        super(props)
        this.params = this.props.navigation.state.params
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)})
        this.languageDao = new LanguageDao(this.params.flag)
        this.state = {
            checkedArray: SortKeyPage._keys(this.props)
        }
    }

    static getDerivedStateFromProps (nextProps, prevState) {
        const checkedArray = SortKeyPage._keys(nextProps, prevState)
        if (prevState.keys !== checkedArray) {
            return {
                keys: checkedArray
            }
        }
        return null
    }

    componentDidMount () {
        this.backPress.componentDidMount()
        // 如果props中标签为空则从本地存储中获取标签
        if (SortKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props
            onLoadLanguage(this.params.flag)
        }
    }

    componentWillUnmount () {
        this.backPress.componentWillUnmount()
    }

    /*
        获取标签
    */
    static _keys(props, state) {
        // 如果state中有checkedArray则使用state中的checkedArray
        if (state && state.checkedArray && state.checkedArray.length) {
            return state.checkedArray
        }

        // 否则从原始数据中获取checkedArray
        const flag = SortKeyPage._flag(props)
        let dataArray = props.language[flag] || []
        let keys = []
        for (let i = 0, j = dataArray.length; i < j; i++) {
            let data = dataArray[i]
            if (data.checked) keys.push(data)
        }
        return keys
    }

    static _flag (props) {
        const {flag} = props.navigation.state.params
        return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
    }

    onBackPress (e) {
        this.onBack()
        return true
    }

    onSave (hasChecked) {
        if (!hasChecked) {
            // 如果没有排序则直接返回
            if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
                NavigationUtil.goBack(this.props.navigation)
            }
        }
        // todo 保存排序后的数据
        // 获取排序后的数据

        // 更新本地数据
        this.languageDao.save()
        const {onLoadLanguage} = this.props
        // 更新store
        onLoadLanguage(this.params.flag)
        NavigationUtil.goBack(this.props.navigation)
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
                   </View>
                   <View style={styles.line}/>
               </View>
            )
        }
        return views
    }

    onClick (data, index) {
        data.checked = !data.checked
        ArrayUtil.updateArray(this.changeValues, data)
        this.state.keys[index] = data // 更新state以便显示选中状态
        this.setState({
            keys: this.state.keys
        })
    }

    onBack () {
        if (this.changeValues.length > 0) {
            Alert.alert('提示', '要保存修改吗？',
                [
                    {
                        text: '否',
                        onPress: () => {
                            NavigationUtil.goBack(this.props.navigation)
                        }
                    },
                    {
                        text: '是',
                        onPress: () => {
                            this.onSave()
                        }
                    }
                ])
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
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
            isChecked={data.checked}
            leftText={data.name}
            checkedImage={this._checkedImage(true)}
            unCheckedImage={this._checkedImage(false)}
        />
    }

    render () {
        let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序'
        let navigationBar = <NavigationBar
            title={title}
            leftButton = {ViewUtil.getLeftBackButton(() => this.onBack())}
            style = {{backgroundColor: THEME_COLOR}}
            rightButton = {ViewUtil.getRightButton('保存', () => this.onSave())}
        />
        return <View style={styles.container}>
            {navigationBar}
            <SortableListView
                data = {this.state.checkedArray}
                order = {Object.keys(this.state.checkedArray)}
                onRowMoved={e => {
                    this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
                    this.forceUpdate()
                }}
                renderRow={row => <SortCeil data={row} {...this.params} />}
            />
        </View>
    }
}

class SortCeil extends Component {
    render () {
        return <TouchableHighlight
            underlayColor={'#eee'}
            style={this.props.data.checked ? styles.item : styles.hidden}
            {...this.props.sortHandlers}
        >
            <View style={{marginLeft: 10, flexDirection: 'row'}}>
                <MaterialCommunityIcons
                    name={'sort'}
                    size={16}
                    style={{marginRight: 10, color: THEME_COLOR}}
                />
                <Text>{this.props.data.name}</Text>
            </View>
        </TouchableHighlight>
    }
}

constmapPopularStateToProps = state => ({
    language: state.language
})

const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray'
    },
    hidden: {
        height: 0
    },
    item: {
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center'
    }
})