import * as yup from 'yup';

const yupMessages = {
  mixed: {
    default: 'Ошибка сети',
  },
  string: {
    notCorrectUrl: 'Ссылка должна быть валидным URL',
    rssAlreadyExists: 'RSS уже существует',
    notValidateUrl: 'Ресурс не содержит валидный RSS',
    rssLoaded: 'RSS успешно загружен',
    notValue: 'Поле не должно быть пустым',
  },
};

yup.setLocale(yupMessages);

export default yupMessages;
