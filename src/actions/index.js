import {SAVE_STORIES} from './types';

// action for saving stories
export const saveStories = (data, newStoriesCount, lastPolledAt) => ({
  type: SAVE_STORIES,
  payload: {
    stories: data,
    newStoriesCount,
    lastPolledAt,
  },
});
