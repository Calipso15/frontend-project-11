const yupMessages = {
  mixed: {
    default: 'Произошла ошибка при загрузке RSS-потока',
  },
  string: {
    notCorrectUrl: 'Ссылка должна быть валидным URL',
    rssAlreadyExists: 'RSS уже существует',
    notValidateUrl: 'Ресурс не содержит валидный RSS',
    rssLoaded: 'RSS успешно загружен',
    notValue: 'Не должно быть пустым',
  },
};

export default yupMessages;
