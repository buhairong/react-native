/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import FlatListDemo from './pages/FlatListDemo';
import SwipeableFlatListDemo from './pages/SwipeableFlatListDemo';
import SectionListDemo from './pages/SectionListDemo';
import {name as appName} from './app.json';
import {createAppContainer, createStackNavigator} from 'react-navigation'


const AppRoot = createStackNavigator({
    App: {
        screen: App
    },
    FlatListDemo: {
        screen: FlatListDemo,
        navigationOptions: {
            title: 'FlatListDemo'
        }
    },
    SwipeableFlatListDemo: {
        screen: SwipeableFlatListDemo,
        navigationOptions: {
            title: 'SwipeableFlatListDemo'
        }
    },
    SectionListDemo: {
        screen: SectionListDemo,
        navigationOptions: {
            title: 'SectionListDemo'
        }
    }
})

const AppStackNavigatorContainer = createAppContainer(AppRoot)

AppRegistry.registerComponent(appName, () => AppStackNavigatorContainer);
