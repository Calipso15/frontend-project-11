import _ from 'lodash';
import i18n from 'i18next';
import * as yup from 'yup';
import onChange from 'on-change';
import yupMessages from './locales/message';
import { checkIsRssAndParse, checkFeedsForNewPosts } from './parser';
import {
  renderMessage, renderStatus, renderFeeds, renderPost, renderFeedsAndSuccessMessage, titlePost,
} from './view';

const initI18n = () => new Promise((resolve, reject) => {
  i18n
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru: {
          translation: yupMessages,
        },
      },
    })
    .then(() => {
      resolve();
    })
    .catch((error) => {
      reject(error);
    });
});

const validationSchema = yup.string().url(i18n.t('string.notCorrectUrl'));

const state = {
  registrationProcess: {
    state: 'filling',
  },
  inputValue: '',
  isValid: true,
  message: '',
  feeds: [],
  posts: [],
  rssUrl: [],
};

const watchedState = onChange(state, function render(path, value, prevValue) {
  switch (path) {
    case 'isValid':
      renderMessage(this);
      break;
    case 'feeds': {
      if (!prevValue.length) {
        renderFeedsAndSuccessMessage(this);
      } else {
        const diff = _.differenceWith(
          value,
          prevValue,
          (val, prev) => val.feedsId === prev.feedsId,
        );
        renderFeeds(diff);
      }
      break;
    }
    case 'posts': {
      if (value.length && !prevValue.length) {
        titlePost();
      }
      const diff = _.differenceWith(
        value,
        prevValue,
        (val, prev) => val.postId === prev.postId,
      );
      renderPost(diff);
      break;
    }
    case 'registrationProcess.state':
      renderStatus(state);
      break;
    default:
      renderMessage(this);
  }
});

const showMessage = (message, isValid) => {
  watchedState.message = i18n.t(message);
  watchedState.isValid = isValid;
};

const checkIsNewRss = (inputValue) => !watchedState.rssUrl.includes(inputValue);

const setupFormHandler = () => {
  const input = document.getElementById('url-input');
  const form = document.querySelector('.rss-form');

  initI18n();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.registrationProcess.state = 'filling';

    const inputValue = input.value.trim();
    watchedState.inputValue = inputValue;

    if (!inputValue) {
      watchedState.registrationProcess.state = 'success';
      showMessage('string.notValue', false);
      return;
    }

    if (!validationSchema.isValidSync(inputValue)) {
      watchedState.registrationProcess.state = 'success';
      showMessage('string.notCorrectUrl', false);
      return;
    }

    if (!checkIsNewRss(inputValue)) {
      watchedState.registrationProcess.state = 'success';
      showMessage('string.rssAlreadyExists', false);
      return;
    }
    watchedState.registrationProcess.state = 'processing';
    checkIsRssAndParse(inputValue, watchedState)
      .then((isRss) => {
        if (isRss) {
          watchedState.registrationProcess.state = 'success';
          showMessage('string.rssLoaded', true);
        } else {
          watchedState.registrationProcess.state = 'success';
          showMessage('string.notRssUrl', false);
        }
      })
      .catch(() => {
        watchedState.registrationProcess.state = 'success';
        showMessage('mixed.default', false);
      });

    setTimeout(() => checkFeedsForNewPosts(inputValue, watchedState), 5000);
  });
};

export { setupFormHandler, showMessage };
