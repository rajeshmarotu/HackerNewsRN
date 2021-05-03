import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';

// loader Component
export const Loader = ({size, color}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size || 'large'} color={color || '#121212'} />
      <Text style={{marginTop: 6, fontSize: 15, color: '#12121280'}}>
        Loading stories
      </Text>
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
