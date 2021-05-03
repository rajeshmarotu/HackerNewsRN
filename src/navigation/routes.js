import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/stack';

import Home from '../screens/common/home';

const Stack = createStackNavigator();
const AppStack = createStackNavigator();

// default header options
const headerOptions = {
  headerStyle: {
    backgroundColor: '#e5e6e1',
  },
  headerLeft: props => <HeaderBackButton {...props} />,
  headerTitleAlign: 'center',
};

// home screen in appstack navigator
const AppScreens = () => (
  <AppStack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{
        ...headerOptions,
        title: 'HackerNews',
        headerLeft: null,
        headerTitleAlign: 'left',
      }}
    />
  </AppStack.Navigator>
);

export const Route = () => {
  return (
    <NavigationContainer>
      <AppScreens options={{animationEnabled: false}} />
    </NavigationContainer>
  );
};
