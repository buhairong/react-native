import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import actions from '../action/index'
import NavigationBar from '../common/NavigationBar'
import {MORE_MENU} from '../common/MORE_MENU'
import GlobalStyles from '../res/GlobalStyles'

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

    onClick (menu) {

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
                                    color: THEME_COLOR
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
                                color: THEME_COLOR
                            }}
                        />
                    </TouchableOpacity>
                    <View style={GlobalStyles.line} />
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
    }
});

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPage)
