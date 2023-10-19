import i18n from 'i18next';
import yupMessages from './message';

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

initI18n();

export default i18n;
