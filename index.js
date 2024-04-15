import React from 'react';
import AppNavigator from './src/AppNavigator';

const App = () => {
  return <AppNavigator />;
};

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
