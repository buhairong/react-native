import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import actions from '../action/index'
import NavigationBar from '../common/NavigationBar'

const THEME_COLOR = '#678'

type Props = {};
class MyPage extends Component<Props> {
    getRightButton () {
        return <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                        onPress={() => {

                        }}
                    >
                    <View style={{padding:5,marginRight:8}}>
                        <Feather
                            name={'search'}
                            size={24}
                            style={{color:'white'}}
                        />
                    </View>
                </TouchableOpacity>
        </View>
    }

    getLeftButton(callBack) {
        return <TouchableOpacity
            style={{padding:8,paddingLeft:12}}
            onPress={callBack}
        >
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color: 'white'}}
            />
        </TouchableOpacity>
    }

    render () {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        }

        let navigationBar =
            <NavigationBar
                title={'我的'}
                statusBar={statusBar}
                rightButton={this.getRightButton()}
                leftButton={this.getLeftButton()}
                style={{backgroundColor:THEME_COLOR}}
            />

        return (
            <View style={styles.container}>
                {navigationBar}
                <Text style={styles.welcome}>MyPage</Text>
                <Button
                    title="改变主题色"
                    onPress={() => {
                        this.props.onThemeChange('#ff0000')
                    }}
                />
                <Text onPress={() => {
                    NavigationUtil.goPage({
                        navigation: this.props.navigation
                    }, 'DetailPage')
                }}>跳转到详情页</Text>
                <Button
                    title={'Fetch 使用'}
                    onPress={() => {
                        NavigationUtil.goPage({
                            navigation: this.props.navigation
                        }, 'FetchDemoPage')
                    }}
                />
                <Button
                    title={'AsyncStorage 使用'}
                    onPress={() => {
                        NavigationUtil.goPage({
                            navigation: this.props.navigation
                        }, 'AsyncStorageDemoPage')
                    }}
                />
                <Button
                    title={'离线缓存框架'}
                    onPress={() => {
                        NavigationUtil.goPage({
                            navigation: this.props.navigation
                        }, 'DataStoreDemoPage')
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPage)
