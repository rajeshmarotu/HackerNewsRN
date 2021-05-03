import {SAVE_STORIES, CONNECTION_STATUS_CHANGE} from '../actions/types';

const initialState = {
  stories: [],
  lastPolledAt: null,
  newStoriesCount: 0,
};

const appDataReducer = (state = initialState, action) => {
  switch (action.type) {
    // reducer for saving stories
    case SAVE_STORIES:
      const {stories, newStoriesCount, lastPolledAt} = action.payload;

      let data = {};
      const currentStoriesCount = state.stories.length;
      if (currentStoriesCount == 0 && newStoriesCount != 0) {
        data['firstUpdatedAt'] = lastPolledAt;
      }

      return {
        ...state,
        stories,
        newStoriesCount,
        lastPolledAt,
        ...data,
      };

    // reducer for handling network connection change
    case CONNECTION_STATUS_CHANGE:
      return {
        ...state,
        isConnected: action.payload.isConnected,
      };

    default:
      return state;
  }
};

export default appDataReducer;
