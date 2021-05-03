import React from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import {
  saveStories,
  handleNetworkStateChange,
  updateLastPollTime,
} from '../../../actions';
import {connect} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import axios from '../../../api/index';
import {ShowSnackBar, showNewStoriesBadge} from '../../../utils';
import * as polling from '../../../utils/polling';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {Loader} from '../../../components/Loader';
import {ErrorPage} from '../../../components/ErrorPage';
import {StoryItem} from './StoryItem';
import {NumberOfNewPosts} from '../../../components/NumberOfNewPosts';

const POLLING_TIME = 60 * 1000 * 5;
const NUMBER_OF_STORIES = 20;

class Home extends React.Component {
  constructor(props) {
    super(props);
    const {stories} = this.props;
    this.state = {
      stories,
      isLoading: false,
      errorText: null,
      sortBy: null,
    };
    this._poll_started = null;
  }

  async componentDidMount() {
    // get data if connected to network
    if (this.props.isConnected) {
      this.startPolling();
      // this._poll = poll(async () => {
      //   const pollingApi = await this.runAsyncFunctions();
      // }, POLLING_TIME);
    }

    // show sort option at header if stories avaialable
    this.state.stories.length != 0 && this.setSortOption();
  }

  componentWillUnmount() {
    polling.cancelCallback();
  }

  startPolling = () => {
    polling.poll(async () => {
      if (this._poll_started == null) {
        this._poll_started = true;
      }
      const response = await this.runAsyncFunctions();
      return response;
    }, POLLING_TIME);
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (this.state.stories.length != this.props.stories.length) {
      return {updateStories: true};
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    // sort with current sort field and update stories state on arrival of new stories
    if (snapShot && snapShot.updateStories) {
      const {sortBy} = this.state;
      let stories = [...this.props.stories];
      stories = this.sortStories(stories, sortBy);
      this.setState({stories});
    }

    // load data if network moved from offline to online and  there are no stories
    if (prevProps.isConnected == false && this.props.isConnected) {
      if (this._poll_started == null) {
        this.startPolling();
      }
      ShowSnackBar('Device is online', 'short');
      if (this.state.stories.length == 0) {
        this.runAsyncFunctions();
      }
    }
  }

  // get new stories ids
  getData = async () => {
    try {
      const API_URL =
        'https://hacker-news.firebaseio.com/v0/newstories.json?limitToFirst=' +
        NUMBER_OF_STORIES +
        '&orderBy="$key"';
      const response = await axios.get(API_URL);
      return response;
    } catch (err) {
      ShowSnackBar(err.errorText, 'long', true);
      this.setState({
        errorText: err.errorText,
      });

      //handle rate limit error
      if (err && err.errorCode == 429) {
        polling.cancelCallback();
      }
      return {error: true};
    }
  };

  // get story data from id
  getStoryData = async storyID => {
    try {
      const API_URL = `https://hacker-news.firebaseio.com/v0/item/${storyID}.json?print=pretty`;
      const response = await axios.get(API_URL);

      if (response && response.data) {
        return response;
      } else {
        //handle rate limit error - stop polling
        if (response.error && response.errorCode == 429) {
          polling.cancelCallback();
        }
        return new Promise.resolve({data: null});
      }
    } catch (error) {
      //handle error
      return new Promise.resolve({data: null});
    }
  };

  runAsyncFunctions = async () => {
    try {
      // start loader
      this.setState({isLoading: true, errorText: null});
      const {data, error} = await this.getData();

      // if error fetching ids return
      if (error) return;

      const ids = data.slice();
      return Promise.all(
        ids.map(async (id, index) => {
          const {data} = await this.getStoryData(id, index);
          return data;
        }),
      )
        .then(newStories => {
          // remove stories which do not have data ( fetch error)
          newStories = newStories.filter(story => story != null);

          // set timestamp for new stories
          const timestamp = new Date().getTime();
          newStories.forEach(newStory => {
            newStory['timestamp'] = timestamp;
          });

          let {stories, sortBy} = this.state;
          sortBy = sortBy || 'score';

          const currentStoriesCount = stories.length;
          stories = [...stories, ...newStories];

          // sort by timestamp in descending order
          stories.sort((a, b) => a['timestamp'] - b['timestamp']);

          // filter duplicate stories
          stories = stories.filter(
            (v, i, a) => a.findIndex(t => t.id === v.id) === i,
          );
          const updateStoriesCount = stories.length;

          //new stories count
          const newStoriesCount = updateStoriesCount - currentStoriesCount;

          // sort stories
          stories = this.sortStories(stories, sortBy);

          // save in store
          this.props.saveStories(stories, newStoriesCount, timestamp);

          // stop loader and show sort option
          this.setState(
            {
              isLoading: false,
              errorText: null,
            },
            () => {
              this.setSortOption();
            },
          );
        })
        .catch(error => {
          this.setState({isLoading: false, errorText: 'Error Fetching Data'});
        });
    } catch (error) {
      this.setState({isLoading: false, errorText: 'Error Fetching Data'});
    }
  };

  sortStories = (data, value) => {
    if (!value) value = 'score';

    // copy data
    let results = data.slice(0);
    results = results.sort((a, b) => {
      if (value == 'by' || value == 'title') {
        return a[value].toLowerCase().localeCompare(b[value].toLowerCase());
      } else {
        // sort by score
        if (a[value] != b[value]) {
          return a[value] - b[value];
        } else {
          // in case of equal score sort based on timestamp - in descending order -  new one will come at top
          return b['timestamp'] - a['timestamp'];
        }
      }
    });
    return results;
  };

  onSortByChange = value => {
    // on sorting field changes in sorting picker
    let {stories} = this.state;
    const noStories = stories.length == 0;
    // if no stories do nothing
    if (noStories) return;
    // sort based on selected sorting field and updated stories and sorting field
    stories = this.sortStories(stories, value);
    this.setState({stories, sortBy: value});
  };

  setSortOption = () => {
    // sorting option in header right

    this.props.navigation.setOptions({
      headerRight: props => (
        <View style={styles.sortOptionContainer}>
          <FAIcon name="sort" size={16} color="#12121270" />
          <Picker
            note
            mode="dialog"
            style={styles.pickerStyle}
            dropdownIconColor="#121212"
            selectedValue={'none'}
            onValueChange={this.onSortByChange}>
            <Picker.Item label="Score" value="score" color={'#12121290'} />
            <Picker.Item label="Title" value="title" color={'#12121290'} />
            <Picker.Item label="Author" value="by" color={'#12121290'} />
          </Picker>
        </View>
      ),
    });
  };

  renderItem = ({item, index}) => {
    // story item
    return (
      <StoryItem
        item={item}
        index={index}
        lastPolledAt={this.props.lastPolledAt}
        firstUpdatedAt={this.props.firstUpdatedAt}
      />
    );
  };

  _showNewStoriesBadge = (firstUpdatedAt, lastPolledAt) => {
    return showNewStoriesBadge(firstUpdatedAt, lastPolledAt);
  };

  render() {
    const {stories, errorText, isLoading} = this.state;
    const {
      isConnected,
      newStoriesCount,
      lastPolledAt,
      firstUpdatedAt,
    } = this.props;
    const noStories = stories.length == 0;
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />

        {/* if device is offline or error exists - shows error page */}
        {(!isConnected || errorText) && noStories ? (
          <ErrorPage text={errorText} isOffline={isConnected} />
        ) : (
          <>
            {/* loader */}
            {isLoading && noStories ? (
              <Loader />
            ) : (
              <View style={{flex: 1}}>
                {/* number of new stories - if any */}
                {!!newStoriesCount &&
                  this._showNewStoriesBadge(firstUpdatedAt, lastPolledAt) && (
                    <NumberOfNewPosts newStoriesCount={newStoriesCount} />
                  )}
                <FlatList
                  data={stories}
                  extraData={[this.props]}
                  keyExtractor={(item, index) => item.id}
                  renderItem={this.renderItem}
                  removeClippedSubviews={true}
                  style={styles.flatListStyle}
                />
              </View>
            )}
          </>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListStyle: {paddingHorizontal: 16},
  sortOptionContainer: {flexDirection: 'row', alignItems: 'center'},
  pickerStyle: {
    width: 130,
  },
});

const mapStateToProps = (state, ownProps) => {
  const {
    stories,
    isConnected,
    newStoriesCount,
    lastPolledAt,
    firstUpdatedAt,
  } = state.appData;
  return {
    stories,
    isConnected,
    newStoriesCount,
    lastPolledAt,
    firstUpdatedAt,
  };
};

const mapDispatchToProps = dispatch => ({
  saveStories: (stories, newStoriesCount, lastPolledAt) => {
    dispatch(saveStories(stories, newStoriesCount, lastPolledAt));
  },
  handleNetworkStateChange: networkState => {
    dispatch(handleNetworkStateChange(networkState));
  },
  updateLastPollTime: time => {
    dispatch(updateLastPollTime(time));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
