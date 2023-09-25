import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import loadRSSFeed from './parser';
import yupMessages from './message';
import { showError, showSuccess } from './feedback';

const validationSchema = yup.object().shape({
  rssFeedUrl: yup
    .string()
    .url(yupMessages.string.notCorrectUrl)
    .required('Обязательное поле'),
});

i18n.init({ lng: 'ru', debug: true, resources: { yupMessages } });

const state = {
  rssFeedUrl: '',
  isValid: true,
  errorMessage: '',
  rssFeeds: [],
};

const handleErrors = (input, feedback, errorMessage) => {
  state.isValid = false;
  state.errorMessage = errorMessage;
  showError(input, feedback, errorMessage);
};

const fetchAndHandleResponse = (inputValue, input, feedback) => {
  const corsProxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(inputValue)}`;

  return fetch(corsProxyUrl)
    .then((response) => response.json())
    .then((data) => {
      const htmlCode = data.contents;
      if (!htmlCode.includes('<rss')) {
        state.isValid = false;
        state.errorMessage = i18n.t(yupMessages.string.notValidateUrl);
        showError(input, feedback, state.errorMessage);
      } else {
        showSuccess(input, feedback, i18n.t(yupMessages.string.rssLoaded));
        input.focus();
        const inputVal = input;
        inputVal.value = '';
      }
      if (state.isValid) {
        state.rssFeeds.push(inputValue);
        loadRSSFeed(inputValue);
        document.querySelector('.posts').innerHTML = '';
        document.querySelector('.feeds').innerHTML = '';
      }
    })
    .catch(() => {
      handleErrors(input, feedback, i18n.t(yupMessages.mixed.default));
    });
};

// Функция для периодической проверки RSS-потока
function checkRSSFeed() {
  // Проверяем только если rssFeedUrl задан
  if (state.rssFeedUrl) {
    loadRSSFeed(state.rssFeedUrl)
      .then(() => {
        // При успешной загрузке новых постов обновляем интерфейс
        // Вы можете добавить код для обновления интерфейса здесь
        // Например, если у вас есть массив новых постов newPosts:
        // newPosts.forEach((post) => {
        //   // Ваш код для обновления интерфейса с новыми постами
        // });
      })
      .catch((error) => {
        console.error(`Error checking RSS feed: ${error}`);
        // Отправить уведомление об ошибке, если необходимо
      })
      .finally(() => {
        // Установить следующую проверку через 5 секунд
        setTimeout(checkRSSFeed, 5000);
      });
  } else {
    // Если rssFeedUrl не задан, просто устанавливаем таймаут для следующей проверки
    setTimeout(checkRSSFeed, 5000);
  }
}

// Инициализация приложения
const input = document.getElementById('url-input');
const feedback = document.querySelector('.feedback');

const watchedState = onChange(state, (path) => {
  if (path === 'rssFeedUrl') {
    const inputValue = state.rssFeedUrl.trim();
    state.isValid = true;
    state.errorMessage = '';

    try {
      validationSchema.validateSync({ rssFeedUrl: inputValue });
      if (state.rssFeeds.includes(inputValue)) {
        state.isValid = false;
        state.errorMessage = i18n.t(yupMessages.string.rssAlreadyExists);

        showError(input, feedback, state.errorMessage);
        return;
      }

      fetchAndHandleResponse(inputValue, input, feedback);
    } catch (error) {
      handleErrors(input, feedback, i18n.t(yupMessages.string.notCorrectUrl));
    }
  }
});

// Начать периодическую проверку RSS-потока
checkRSSFeed();

export default watchedState;
