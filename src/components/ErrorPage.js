import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// error component
export const ErrorPage = ({isOffline, text}) => {
  return (
    <View style={styles.container}>
      {/* if offline displays "device is offline" else shows error text */}
      <Text>{isOffline ? text : 'Device is offline!'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
