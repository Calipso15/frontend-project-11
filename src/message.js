import * as yup from 'yup';

const yupMessages = {
  mixed: {
    default: 'Ошибка валидации',
  },
  string: {
    notCorrectUrl: 'Введите корректный URL',
    rssAlreadyExists: 'RSS уже существует',
    notValidateUrl: 'Ресурс не содержит валидный RSS',
    rssLoaded: 'RSS успешно загружен',
  },
};

yup.setLocale(yupMessages);

export default yupMessages;
