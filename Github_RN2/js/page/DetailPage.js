import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'

const THEME_COLOR = '#678'
const TRENDING_URL = 'https://github.com/'

type Props = {};
export default class DetailPage extends Component<Props> {
    constructor (props) {
        super(props)
        this.params = this.props.navigation.state.params
        const {projectModel} = this.params
        this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName
        const title = projectModel.full_name || projectModel.fullName
        this.state={
            title: title,
            url: this.url,
            canGoBack: false
        }
    }

    onBack () {

    }

    renderRightButton () {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {

                    }}
                >
                    <FontAwesome
                        name={'star-o'}
                        size={20}
                        style={{color: 'white', marginRight: 10}}
                    />
                </TouchableOpacity>
                {ViewUtil.getShareButton(() => {

                })}
            </View>
        )
    }

    render() {
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            rightButton={this.renderRightButton()}
            title={this.state.title}
            style = {{backgroundColor: THEME_COLOR}}
        />

        return (
          <View style={styles.container}>
              {navigationBar}
          </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
