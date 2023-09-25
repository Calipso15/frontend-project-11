import i18n from 'i18next';

const showSuccess = (input, feedback, successMessage) => {
  const feedbackShow = feedback;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedbackShow.textContent = successMessage;
};

const showError = (input, feedback, errorMessage) => {
  const feedbackError = feedback;
  input.classList.add('is-invalid');
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
  feedbackError.textContent = errorMessage;
  input.focus();
};

function errorNetwork(errorMessage) {
  const localizedErrorMessage = i18n.t(errorMessage);
  document.querySelector('.feedback').textContent = localizedErrorMessage;
}
export { showError, showSuccess, errorNetwork };
