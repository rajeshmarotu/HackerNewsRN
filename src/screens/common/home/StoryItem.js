import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {isRecentStory} from '../../../utils';
import Ripple from 'react-native-material-ripple';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

export const StoryItem = ({item, index, lastPolledAt, firstUpdatedAt}) => {
  const highlightStory = isRecentStory(
    firstUpdatedAt,
    lastPolledAt,
    item.timestamp,
  );
  return (
    <View style={styles.mainContainer}>
      {/* title */}
      <Text style={styles.itemTitle}>{item.title}</Text>
      <View style={styles.nameContainer}>
        <View style={styles.userContainer}>
          {/* author icon */}
          <EvilIcon name="user" size={18} color="#12121270" />

          {/* author name */}
          <Text style={styles.username}>{item.by}</Text>

          {/* highlight - if it is recent story */}
          {highlightStory && (
            <View style={styles.highlightContainer}>
              <Text style={styles.highlightText}>New</Text>
            </View>
          )}
        </View>

        {/* score */}
        <View style={styles.scoreContainer}>
          <EvilIcon name="like" size={18} color="#12121270" />
          <Text style={styles.score}>{item.score}</Text>
        </View>
      </View>

      {/* url */}
      <Ripple>{item.url && <Text style={styles.url}>{item.url}</Text>}</Ripple>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {marginVertical: 14, flex: 1},
  itemTitle: {
    fontSize: 18,
    color: '#121212',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {fontSize: 14, color: '#12121290', marginLeft: 5},
  highlightContainer: {
    marginLeft: 20,
    backgroundColor: 'red',
    borderRadius: 4,
  },
  highlightText: {
    fontSize: 9,
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  scoreContainer: {flexDirection: 'row', alignItems: 'center'},
  score: {fontSize: 14, color: '#12121290'},
  url: {fontSize: 13, color: '#410DAA', fontStyle: 'italic'},
});
