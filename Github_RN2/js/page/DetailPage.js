import React, {Component} from 'react';
import {WebView, StyleSheet, DeviceInfo, View, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationBar from '../common/NavigationBar'
import NavigationUtil from '../navigator/NavigationUtil'
import ViewUtil from '../util/ViewUtil'
import BackPressComponent from "../common/BackPressComponent";

const THEME_COLOR = '#678'
const TRENDING_URL = 'https://github.com/'

type Props = {};
export default class DetailPage extends Component<Props> {
    constructor (props) {
        super(props)
        this.params = this.props.navigation.state.params
        const {projectModels} = this.params
        this.url = projectModels.item.html_url || TRENDING_URL + projectModels.item.fullName

        const title = projectModels.item.full_name || projectModels.item.fullName
        this.state={
            title: title,
            url: this.url,
            canGoBack: false
        }
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
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
        this.onBack()
        return true
    }

    onBack () {
        if (this.state.canGoBack) {
            this.webView.goBack()
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
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

    onNavigationStateChange (navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url
        })
    }

    render() {
        const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            rightButton={this.renderRightButton()}
            title={this.state.title}
            style = {{backgroundColor: THEME_COLOR}}
            titleLayoutStyle = {titleLayoutStyle}
        />

        return (
          <View style={styles.container}>
              {navigationBar}
              <WebView
                  ref={webView => this.webView = webView}
                  startInLoadingState={true}
                  onNavigationStateChange={e => this.onNavigationStateChange(e)}
                  source={{uri: this.state.url}}
              />
          </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
});
