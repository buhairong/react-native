/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import FlatListDemo from './pages/FlatListDemo';
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
    }
})

const AppStackNavigatorContainer = createAppContainer(AppRoot)

AppRegistry.registerComponent(appName, () => AppStackNavigatorContainer);
