import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import actions from '../action/index'
import NavigationBar from '../common/NavigationBar'
import {MORE_MENU} from '../common/MORE_MENU'
import GlobalStyles from '../res/styles/GlobalStyles'
import ViewUtil from '../util/ViewUtil'
import NavigationUtil from '../navigator/NavigationUtil'
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";

type Props = {};
class MyPage extends Component<Props> {
    onClick (menu) {
        let RouteName, params = {}
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName = 'WebViewPage'
                params = {
                    title: '教程',
                    url: 'https://coding.m.imooc.com/classindex.html?cid=89'
                }
                break
            case MORE_MENU.About:
                RouteName = 'AboutPage'
                break
            case MORE_MENU.Custom_Theme:
                const {onShowCustomThemeView} = this.props
                onShowCustomThemeView(true)
                break
            case MORE_MENU.Sort_Key:
                RouteName = 'SortKeyPage'
                params.flag = FLAG_LANGUAGE.flag_key
                break
            case MORE_MENU.Sort_Language:
                RouteName = 'SortKeyPage'
                params.flag = FLAG_LANGUAGE.flag_language
                break
            case MORE_MENU.Custom_Key:
            case MORE_MENU.Custom_Language:
            case MORE_MENU.Remove_Key:
                RouteName = 'CustomKeyPage'
                params.isRemoveKey = menu === MORE_MENU.Remove_Key
                params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language
                break
            case MORE_MENU.About_Author:
                RouteName = 'AboutMePage'
                break
        }
        if (RouteName) {
            NavigationUtil.goPage(params, RouteName)
        }
    }

    getItem (menu) {
        const {theme} = this.props
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor)
    }

    render () {
        const {theme} = this.props
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content'
        }

        let navigationBar =
            <NavigationBar
                title={'我的'}
                statusBar={statusBar}
                style={theme.styles.navBar}
            />

        return (
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                <ScrollView>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => this.onClick(MORE_MENU.About)}
                    >
                        <View style={styles.about_left}>
                            <Ionicons
                                name={MORE_MENU.About.icon}
                                size={40}
                                style={{
                                    marginRight: 10,
                                    color: theme.themeColor
                                }}
                            />
                            <Text>GitHub Popular</Text>
                        </View>
                        <Ionicons
                            name={'ios-arrow-forward'}
                            size={16}
                            style={{
                                marginRight: 10,
                                alignSelf: 'center',
                                color: theme.themeColor
                            }}
                        />
                    </TouchableOpacity>
                    <View style={GlobalStyles.line} />
                    {this.getItem(MORE_MENU.Tutorial)}
                    {/*趋势管理*/}
                    <Text style={styles.groupTitle}>趋势管理</Text>
                    {/*自定义语言*/}
                    {this.getItem(MORE_MENU.Custom_Language)}
                    {/*语言排序*/}
                    <View style={GlobalStyles.line} />
                    {this.getItem(MORE_MENU.Sort_Language)}
                    {/*最热管理*/}
                    <Text style={styles.groupTitle}>最热管理</Text>
                    {/*自定义标签*/}
                    {this.getItem(MORE_MENU.Custom_Key)}
                    {/*标签排序*/}
                    <View style={GlobalStyles.line} />
                    {this.getItem(MORE_MENU.Sort_Key)}
                    {/*标签移除*/}
                    <View style={GlobalStyles.line} />
                    {this.getItem(MORE_MENU.Remove_Key)}
                    {/*设置*/}
                    <Text style={styles.groupTitle}>设置</Text>
                    {/*自定义主题*/}
                    {this.getItem(MORE_MENU.Custom_Theme)}
                    {/*关于作者*/}
                    <View style={GlobalStyles.line} />
                    {this.getItem(MORE_MENU.About_Author)}
                    <View style={GlobalStyles.line} />
                    {/*反馈*/}
                    {this.getItem(MORE_MENU.Feedback)}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    about_left: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    item: {
        backgroundColor: 'white',
        padding: 10,
        height: 90,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    groupTitle: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color: 'gray'
    }
});

const mapStateToProps = state => ({
    theme: state.theme.theme
})

const mapDispatchToProps = dispatch => ({
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPage)
