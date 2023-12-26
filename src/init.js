import i18n from 'i18next';
import * as yup from 'yup';
import onChange from 'on-change';
import yupMessages from './locales/message';
import { checkIsRssAndParse, checkFeedsForNewPosts } from './parser';
import render from './view';

const validationSchema = yup.string().url(i18n.t('string.notCorrectUrl'));

const state = {
  isValid: true,
  message: '',
  feeds: [],
  posts: [],
  rssUrl: [],
};

const watchedState = onChange(state, (path, value, prevValue) => {
  render(state, path, value, prevValue);
});

const showMessage = (message, isValid) => {
  watchedState.message = i18n.t(message);
  watchedState.isValid = isValid;
};

const checkIsNewRss = (inputValue) => !watchedState.rssUrl.includes(inputValue);

const setupFormHandler = () => {
  const input = document.getElementById('url-input');
  const form = document.querySelector('.rss-form');

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
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        input.readOnly = false;
        const inputValue = input.value.trim();
        setTimeout(() => checkFeedsForNewPosts(inputValue, watchedState), 5000);
        if (!inputValue) {
          input.readOnly = false;
          showMessage('string.notValue', false);
          return;
        }

        if (!validationSchema.isValidSync(inputValue)) {
          input.readOnly = false;
          showMessage('string.notCorrectUrl', false);
          return;
        }

        if (!checkIsNewRss(inputValue)) {
          input.readOnly = false;
          showMessage('string.rssAlreadyExists', false);
          return;
        }
        input.readOnly = true;
        checkIsRssAndParse(inputValue, watchedState)
          .then((isRss) => {
            if (isRss) {
              input.readOnly = false;
              showMessage('string.rssLoaded', true);
            } else {
              input.readOnly = false;
              showMessage('string.notRssUrl', false);
            }
          })
          .catch(() => {
            input.readOnly = false;
            showMessage('mixed.default', false);
          });
      });
    })
    .catch(() => {
      console.error('Ошибка инициализации i18next');
    });
};

export { setupFormHandler, showMessage };
