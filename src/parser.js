import _ from 'lodash';

const fetchAndParseXML = (url) => {
  const corsProxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;

  return fetch(corsProxyUrl)
    .then((response) => response.json())
    .then((data) => {
      const xmlContent = data.contents;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      return xmlDoc;
    });
};

const extractPostData = (items) => Array.from(items).map((item) => {
  const postLink = item.querySelector('link').textContent;
  const postTitle = item.querySelector('title').textContent;
  const postDescription = item.querySelector('description').textContent;
  const postId = _.uniqueId();
  return {
    postId,
    postTitle,
    postDescription,
    postLink,
  };
});

const checkFeedsForNewPosts = (url, watchedState) => {
  const state = watchedState;

  return fetchAndParseXML(url)
    .then((xmlDoc) => {
      const items = xmlDoc.querySelectorAll('item');
      const newParsPost = extractPostData(items);

      const newPosts = [...newParsPost];

      const uniqueNewPostLinks = _.differenceWith(
        newPosts,
        state.posts,
        (newPost, existingPost) => newPost.postLink === existingPost.postLink,
      );
      state.posts.push(...uniqueNewPostLinks);
    })
    .catch(() => []);
};

const checkIsRssAndParse = (url, watchedState) => {
  const state = watchedState;

  if (state.intervalId) {
    clearInterval(state.intervalId);
  }

  return fetchAndParseXML(url)
    .then((xmlDoc) => {
      if (xmlDoc.querySelector('rss')) {
        state.posts = [];
        state.feeds = [];
        state.rssUrl.push(url);

        const title = xmlDoc.querySelector('channel > title').textContent.trim();
        const description = xmlDoc.querySelector('channel > description').textContent.trim();

        const items = xmlDoc.querySelectorAll('item');
        state.posts.push(...extractPostData(items));

        state.feeds.push({ title, description });
        state.intervalId = setInterval(() => {
          checkFeedsForNewPosts(url, state);
        }, 5000);

        return true;
      }
      return false;
    })
    .catch(() => false);
};

export default checkIsRssAndParse;
