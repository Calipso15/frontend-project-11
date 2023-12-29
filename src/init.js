import i18n from 'i18next';
import * as yup from 'yup';
import yupMessages from './locales/message';
import { checkIsRssAndParse, checkFeedsForNewPosts } from './parser';
import createWatchedState from './view';

const state = {
  isValid: true,
  message: '',
  feeds: [],
  posts: [],
  viewPosts: [],
  modalPost: null,
  loadProcess: 'success',
};

const validateURL = (url, feeds) => {
  const links = feeds.map((feed) => feed.url);
  const currentUserSchema = yup.string().url().required().notOneOf(links);
  return currentUserSchema
    .validate(url)
    .then(() => null)
    .catch((e) => {
      if (e.type === 'url') {
        return i18n.t('string.notCorrectUrl');
      } if (e.type === 'notOneOf') {
        return i18n.t('string.rssAlreadyExists');
      }
      return null;
    });
};

const setupFormHandler = () => {
  const input = document.getElementById('url-input');

  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    input: document.getElementById('url-input'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    button: document.querySelector('button[type="submit"]'),

    modal: {
      modalElement: document.getElementById('modal'),
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      readMoreButton: document.querySelector('.btn-primary'),
    },
  };
  const watchedState = createWatchedState(elements, state);
  const showMessage = (message, isValid) => {
    watchedState.message = i18n.t(message);
    watchedState.isValid = isValid;
  };

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
      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputValue = input.value.trim();
        setTimeout(() => checkFeedsForNewPosts(inputValue, watchedState), 5000);

        if (!inputValue) {
          showMessage('string.notValue', false);
          return;
        }
        validateURL(inputValue, watchedState.feeds)
          .then((validationError) => {
            if (validationError) {
              showMessage(validationError, false);
              return;
            }
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
      });
    });
};

export default setupFormHandler;
