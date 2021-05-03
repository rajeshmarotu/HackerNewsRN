import Snackbar from 'react-native-snackbar';

export const getMinutesDiffernce = (time1, time2) => {
  const difference = time1 - time2;
  return difference / 1000 / 60;
};

export const isRecentStory = (
  firstUpdatedAt,
  lastUpdatedAt,
  storyTimestamp,
) => {
  if (!lastUpdatedAt) return false;
  const minutesDifference = Math.round(
    getMinutesDiffernce(lastUpdatedAt, storyTimestamp),
  );
  const lastFetchedTime = Math.round(
    getMinutesDiffernce(lastUpdatedAt, firstUpdatedAt),
  );
  return lastFetchedTime >= 5 && minutesDifference < 5;
};

export const showNewStoriesBadge = (firstUpdatedAt, lastUpdatedAt) => {
  const lastFetchedTime = getMinutesDiffernce(lastUpdatedAt, firstUpdatedAt);
  return lastFetchedTime > 5;
};

export const ShowSnackBar = (text, duration, error, actionText, action) => {
  let options = {};
  options['text'] = text;
  switch (duration) {
    case 'long':
      options['duration'] = Snackbar.LENGTH_LONG;
      break;
    case 'short':
      options['duration'] = Snackbar.LENGTH_LONG;
      break;
    case 'indefinite':
      options['duration'] = Snackbar.LENGTH_LONG;
      break;
    default:
      options['duration'] = Snackbar.LENGTH_SHORT;
      break;
  }
  if (action) {
    options['action'] = {
      text: actionText || 'Okay',
      textColor: '#fff',
      onPress: () => {
        action();
      },
    };
  }
  options['backgroundColor'] = error ? 'red' : 'green';

  Snackbar.show({
    ...options,
  });
};
