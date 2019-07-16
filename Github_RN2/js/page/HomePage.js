import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {BackHandler} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'

import NavigationUtil from '../navigator/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
import BackPressComponent from "../common/BackPressComponent"
import CustomTheme from '../page/CustomTheme'
import {onShowCustomThemeView} from "../action/theme/index";

type Props = {};

class HomePage extends Component<Props> {
    constructor (props) {
        super(props)
        this.backPress = new BackPressComponent({backPress: this.onBackPress()})
    }

    componentDidMount () {
        this.backPress.componentDidMount()
    }

    componentWillUnmount () {
        this.backPress.componentWillUnmount()
    }

    /*
        处理 Android 中的物理返回键
        https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-
    */
    onBackPress = () => {
        const {dispatch, nav} = this.props
        if (nav.routes[1].index === 0) { // 如果RootNavigator中的MainNavigator的index为0，则不处理
            return false
        }
        dispatch(NavigationActions.back())
        return true
    }

    renderCustomThemeView () {
        const {customThemeViewVisible, onShowCustomThemeView} = this.props
        return (
            <CustomTheme
                visible = {customThemeViewVisible}
                {...this.props}
                onClose={() => onShowCustomThemeView(false)}
            />
        )
    }

    render () {
        NavigationUtil.navigation = this.props.navigation;
        return <View style={{flex:1}}>
            <DynamicTabNavigator />
            {this.renderCustomThemeView()}
        </View>
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
    customThemeViewVisible: state.theme.customThemeViewVisible
})

const mapDispatchToProps = dispatch => ({
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show))
})

export default connect(mapStateToProps)(HomePage)