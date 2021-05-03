import React from 'react';
import {Route} from './src/navigation/routes';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Store, persistor} from './src/store';
import {StatusBar} from 'react-native';
// import RNBootSplash from 'react-native-bootsplash';
import NetInfo from '@react-native-community/netinfo';
import {ShowSnackBar} from './src/utils';

class App extends React.Component {
  componentDidMount() {
    // listen to network connection change
    this.unsubscribe = NetInfo.addEventListener(state =>
      this._handleConnectionChange(state.isConnected),
    );
  }

  // update network status change
  _handleConnectionChange = isConnected => {
    // isConnected value is true - if device is online
    // isConnected value is false - if device is offline
    const {appData} = Store.getState();
    if (appData.isConnected == isConnected) return;
    else
      Store.dispatch({
        type: 'CONNECTION_STATUS_CHANGE',
        payload: {isConnected},
      });

    // show a toast - if device went offline
    if (!isConnected) {
      ShowSnackBar('Device is offline', 'short', true);
    }
  };

  componentWillUnmount() {
    // unscribe network connection listener
    this.unsubscribe();
  }

  render() {
    // persistor.purge();
    return (
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar backgroundColor="#000" barStyle="light-content" />
          <Route />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
