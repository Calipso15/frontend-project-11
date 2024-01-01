import _ from 'lodash';
import axios from 'axios';

const parser = (xmlString) => {
  const parserDom = new DOMParser();
  const xmlDoc = parserDom.parseFromString(xmlString, 'text/xml');

  const title = xmlDoc.querySelector('channel > title')?.textContent.trim();
  const description = xmlDoc.querySelector('channel > description')?.textContent.trim();
  const feedsId = xmlDoc.querySelector('channel > item > guid')?.textContent.trim();
  const rss = xmlDoc.querySelector('rss');
  const items = xmlDoc.querySelectorAll('item');

  return {
    rss,
    title,
    description,
    feedsId,
    items: Array.from(items).map((item) => ({
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
      guid: item.querySelector('guid').textContent,
    })),
  };
};

const fetchAndParseXML = (url) => {
  const corsProxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;

  return axios.get(corsProxyUrl)
    .then((response) => {
      const xmlContent = response.data.contents;
      return parser(xmlContent);
    });
};

const checkFeedsForNewPosts = (watchedState) => {
  const promisesFeeds = watchedState.feeds.map((feed) => fetchAndParseXML(feed.url)
    .then((parsedData) => {
      const newPosts = parsedData.items.map((item) => ({
        postId: item.guid,
        postTitle: item.title,
        postDescription: item.description,
        postLink: item.link,
      }));

      const uniqueNewPosts = _.differenceWith(
        newPosts,
        watchedState.posts,
        (newPost, existingPost) => newPost.postLink === existingPost.postLink,
      );

      watchedState.posts.push(...uniqueNewPosts);
    }));
  Promise.all(promisesFeeds).finally(() => {
    const updateFeeds = () => checkFeedsForNewPosts(watchedState);
    setTimeout(updateFeeds, 5000);
  });
};

const checkIsRssAndParse = (url, state) => {
  const watchedState = state;
  watchedState.loadProcess = 'loading';
  return new Promise((resolve, reject) => {
    fetchAndParseXML(url)
      .then((parsedData) => {
        if (parsedData.rss) {
          watchedState.feeds.push({
            feedsId: parsedData.feedsId,
            title: parsedData.title,
            description: parsedData.description,
            url,
          });

          watchedState.posts.push(...parsedData.items.map((item) => ({
            postId: item.guid,
            postTitle: item.title,
            postDescription: item.description,
            postLink: item.link,
          })));

          watchedState.loadProcess = 'success';
          setTimeout(() => { watchedState.loadProcess = 'idle'; }, 500);
          resolve(true);
        } else {
          watchedState.loadProcess = 'idle';
          resolve(false);
        }
      })
      .catch((error) => {
        watchedState.loadProcess = 'fail';
        setTimeout(() => { watchedState.loadProcess = 'idle'; }, 500);
        reject(error);
      });
  });
};

export { checkIsRssAndParse, checkFeedsForNewPosts };
