/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {createAppContainer} from 'react-navigation'
import App from './js/App';
import {name as appName} from './app.json';

const AppStackNavigatorContainers = createAppContainer(App)

AppRegistry.registerComponent(appName, () => AppStackNavigatorContainers);
