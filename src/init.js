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
  const currentUserSchema = yup.string()
    .required(i18n.t('string.notValue'))
    .url(i18n.t('string.notCorrectUrl'))
    .notOneOf(links, i18n.t('string.rssAlreadyExists'));

  return currentUserSchema.validate(url)
    .then(() => null)
    .catch((error) => error.message);
};

const setupFormHandler = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    input: document.getElementById('url-input'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    button: document.querySelector('button[type="submit"]'),
    ulPosts: document.getElementById('posts-container'),

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
        const inputValue = elements.input.value.trim();
        validateURL(inputValue, watchedState.feeds)
          .then((validationError) => {
            if (validationError) {
              showMessage(validationError, false);
              return;
            }
            checkIsRssAndParse(inputValue, watchedState)
              .then((isRss) => {
                if (isRss) {
                  elements.input.value = '';
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
      elements.postsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          watchedState.modalPost = e.target.dataset.id;
        }
        if (!watchedState.viewPosts.includes(e.target.dataset.id)) {
          watchedState.viewPosts.push(e.target.dataset.id);
        }
      });

      checkFeedsForNewPosts(watchedState);
    });
};

export default setupFormHandler;
