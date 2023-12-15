import _ from 'lodash';
import i18n from 'i18next';
import * as yup from 'yup';
import onChange from 'on-change';
import yupMessages from './locales/message';
import checkIsRssAndParse from './parser';
import {
  renderMessage, renderPost, renderFeedsAndSuccessMessage, titlePost,
} from './view';

const initI18n = () => {
  i18n.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru: {
        translation: yupMessages,
      },
    },
  });
};

initI18n();

const validationSchema = yup.string().url(i18n.t('string.notCorrectUrl'));

const state = {
  inputValue: '',
  isValid: true,
  message: '',
  feeds: [],
  posts: [],
  rssUrl: [],
  intervalId: '',
};
const watchedState = onChange(state, function render(path, value, prevValue) {
  switch (path) {
    case 'isValid':
      renderMessage(this);
      break;
    case 'feeds':
      renderFeedsAndSuccessMessage(this);
      break;
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = input.value.trim();

    watchedState.message = '';
    watchedState.inputValue = inputValue;

    if (!inputValue) {
      showMessage('string.notValue', false);
      return;
    }

    if (!validationSchema.isValidSync(inputValue)) {
      showMessage('string.notCorrectUrl', false);
      return;
    }

    if (!checkIsNewRss(inputValue)) {
      showMessage('string.rssAlreadyExists', false);
      return;
    }

    const postsContainer = document.querySelector('.posts');
    const feedsContainer = document.querySelector('.feeds');

    postsContainer.innerHTML = '';
    feedsContainer.innerHTML = '';

    checkIsRssAndParse(inputValue, watchedState)
      .then((isRss) => {
        if (isRss) {
          showMessage('string.rssLoaded', true);
        } else {
          showMessage('string.notRssUrl', false);
        }
      })
      .catch(() => {
        showMessage('mixed.default', false);
      });
  });
};

export {
  setupFormHandler, showMessage,
};
