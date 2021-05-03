import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Badge} from 'native-base';

// number of new posts component - in home
export const NumberOfNewPosts = ({newStoriesCount}) => {
  return (
    <Badge style={styles.container}>
      <Text style={styles.text}>
        {newStoriesCount} New
        {newStoriesCount == 1 ? ' story' : ' stories'}
      </Text>
    </Badge>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#12121250',
    alignSelf: 'center',
    marginTop: 6,
  },
  text: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 6,
  },
});
