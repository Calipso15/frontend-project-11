import onChange from 'on-change';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  rssFeedUrl: yup
    .string()
    .url('Введите корректный URL')
    .required('Обязательное поле'),
});

function initializeView(initialState) {
  const state = { ...initialState };
  function addRssFeed(inputValue, rssFeeds) {
    const input = document.getElementById('url-input');
    const feedback = document.querySelector('.feedback');
    state.isValid = true;
    state.errorMessage = '';

    try {
      validationSchema.validateSync({ rssFeedUrl: inputValue });
      if (rssFeeds.includes(inputValue)) {
        state.isValid = false;
        state.errorMessage = 'RSS уже существует';
        feedback.textContent = state.errorMessage;
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
        input.classList.add('is-invalid');
        input.focus();
        return;
      }
      const corsProxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(inputValue)}`;
      fetch(corsProxyUrl)
        .then((response) => response.json())
        .then((data) => {
          const htmlCode = data.contents;
          if (!htmlCode.includes('<rss')) {
            state.isValid = false;
            state.errorMessage = 'Ресурс не содержит валидный RSS';
            input.classList.add('is-invalid');
          } else {
            state.rssFeeds.push(inputValue);
            state.rssFeedUrl = '';
          }
          input.classList.remove('is-invalid');

          if (state.isValid) {
            feedback.textContent = 'RSS успешно загружен';
            feedback.classList.remove('text-danger');
            feedback.classList.add('text-success');
            input.focus();
            input.value = '';
          } else {
            feedback.textContent = state.errorMessage;
            feedback.classList.remove('text-success');
            feedback.classList.add('text-danger');
          }
        })
        .catch(() => {
          state.isValid = false;
          state.errorMessage = 'Что-то пошло не так';
          input.classList.add('is-invalid');
          input.focus();
        });
    } catch (error) {
      state.isValid = false;
      feedback.textContent = 'Введите корректный URL';
      state.errorMessage = '';
      input.classList.add('is-invalid');
      input.focus();
    }
  }

  const watchedState = onChange(state, (path) => {
    if (path === 'rssFeedUrl') {
      addRssFeed(state.rssFeedUrl, state.rssFeeds);
    }
  });
  return watchedState;
}

export default initializeView;
