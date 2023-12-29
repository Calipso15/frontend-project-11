import _ from 'lodash';
import axios from 'axios';

const fetchAndParseXML = (url) => {
  const corsProxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;

  return axios.get(corsProxyUrl)
    .then((response) => {
      const xmlContent = response.data.contents;

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

  return new Promise((resolve) => {
    fetchAndParseXML(url)
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
        resolve();
      })
      .catch(() => resolve())
      .finally(() => setTimeout(() => checkFeedsForNewPosts(url, watchedState), 5000));
  });
};

const checkIsRssAndParse = (url, watchedState) => {
  const state = watchedState;
  state.loadProcess = 'loading';

  return new Promise((resolve, reject) => {
    fetchAndParseXML(url)
      .then((xmlDoc) => {
        if (xmlDoc.querySelector('rss')) {
          const title = xmlDoc.querySelector('channel > title').textContent.trim();
          const description = xmlDoc.querySelector('channel > description').textContent.trim();
          const feedsId = _.uniqueId();

          const items = xmlDoc.querySelectorAll('item');
          state.posts.push(...extractPostData(items));

          state.feeds.push({
            feedsId, title, description, url,
          });
          state.loadProcess = 'success';
          setTimeout(() => { state.loadProcess = 'idle'; }, 500);
          resolve(true);
        } else {
          state.loadProcess = 'idle';
          resolve(false);
        }
      })
      .catch((error) => {
        state.loadProcess = 'fail';
        setTimeout(() => { state.loadProcess = 'idle'; }, 500);
        reject(error);
      });
  });
};

export { checkIsRssAndParse, checkFeedsForNewPosts };
