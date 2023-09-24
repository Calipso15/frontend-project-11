import onChange from 'on-change';

const createState = () => {
  const state = {
    rssFeedUrl: '',
    isValid: true,
    errorMessage: '',
    rssFeeds: [],
  };

  return onChange(state, () => {});
};

export default createState;
