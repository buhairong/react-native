import React, {Component} from 'react';
import {Platform, Text, View, Image, Dimensions, StyleSheet} from 'react-native';
import BackPressComponent from "../../common/BackPressComponent"
import NavigationUtil from "../../navigator/NavigationUtil"
import config from '../../res/data/config'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import ViewUtil from "../../util/ViewUtil";
import GlobalStyles from '../../res/styles/GlobalStyles'

const THEME_COLOR = '#678'

export default class AboutCommon {
    constructor (props, updateState) {
        this.props = props
        this.updateState = updateState
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
    }

    onBackPress () {
        NavigationUtil.goBack(this.props.navigator)
        return true
    }

    componentDidMount () {
        this.backPress.componentDidMount()
        // http://www.devio.org/io/GitHubPopular/json/github_app_config.json
        fetch('http://www.devio.org/io/GitHubPopular/json/github_app_config.json')
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Network Error')
            })
            .then(config => {
                if (config) {
                    this.updateState({
                        data: config
                    })
                }
            })
            .catch(e => {
                console.log(e)
            })
    }

    componentWillUnmount () {
        this.backPress.componentWillUnmount()
    }

    onShare () {

    }

    getParallaxRenderConfig (params) {
        let config = {}
        let avatar = typeof(params.avatar) === 'string' ? {uri: params.avatar} : params.avatar

        config.renderBackground = () => (
            <View>
                <Image
                    source = {{
                        uri: params.backgroundImg,
                        width: window.width,
                        height: PARALLAX_HEADER_HEIGHT
                    }}
                />
                <View style = {{
                    position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT
                }}
                />
            </View>
        )

        config.renderForeground = () => (
            <View key="parallax-header" style={styles.parallaxHeader}>
                <Image
                    style = {styles.avatar}
                    source = {avatar}
                />
                <Text style = {styles.sectionSpeakerText}>
                    {params.name}
                </Text>
                <Text style = {styles.sectionTitleText}>
                    {params.description}
                </Text>
            </View>
        )

        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        )

        config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtil.getLeftBackButton(() => NavigationUtil.goBack(this.props.navigation))}
                {ViewUtil.getShareButton(() => this.onShare())}
            </View>
        )

        return config
    }

    render (contentView, params) {
        const renderConfig = this.getParallaxRenderConfig(params)
        return (
            <ParallaxScrollView
                backgroundColor={THEME_COLOR}
                contentBackgroundColor={GlobalStyles.backgroundColor}
                parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                backgroundScrollSpeed={10}
                {...renderConfig}
            >
                {contentView}
            </ParallaxScrollView>
        )
    }
}

const window = Dimensions.get('window')
const AVATAR_SIZE = 90
const PARALLAX_HEADER_HEIGHT = 270
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios + 20 : GlobalStyles.nav_bar_height_android

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        width: 300,
        justifyContent: 'flex-end'
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    }
})