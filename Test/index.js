/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App'
import {createAppContainer} from 'react-navigation'
import AppNavigator from './navigators/AppNavigators';
import {name as appName} from './app.json';

const AppStackNavigatorContainer = createAppContainer(AppNavigator)

AppRegistry.registerComponent(appName, () => AppStackNavigatorContainer);
