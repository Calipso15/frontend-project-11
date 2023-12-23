import { Modal } from 'bootstrap';
import showLink from './controller';

const feedback = document.querySelector('.feedback');
const input = document.getElementById('url-input');
const feedsContainer = document.querySelector('.feeds');
const button = document.querySelector('button[type="submit"]');

const setupModalController = (modalElement) => {
  modalElement.addEventListener('hidden.bs.modal', () => {
    document.body.style = '';
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  });
};

const showModal = (postTitle, postContent, postLink) => {
  const modalElement = document.getElementById('modal');
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const readMoreButton = document.querySelector('.btn-primary');
  readMoreButton.href = postLink;
  modalTitle.textContent = postTitle;
  modalBody.textContent = postContent;

  const modal = new Modal(modalElement);

  modal.show();

  setupModalController(modalElement);
};

const findPostById = (postId, diff) => diff.find((post) => post.postId === postId);

const showModalController = (diff) => {
  const container = document.getElementById('posts-container');

  container.addEventListener('click', (e) => {
    const { target } = e;

    if (target.classList.contains('btn-outline-primary')) {
      const postId = target.dataset.id;
      const post = findPostById(postId, diff);
      const postLinkElement = document.querySelector(`a[data-id="${postId}"]`);

      postLinkElement.classList.remove('fw-bold');
      postLinkElement.classList.add('fw-normal', 'link-secondary');

      if (post) {
        const { postTitle, postDescription, postLink } = post;
        showModal(postTitle, postDescription, postLink);
      }
    }
  });
};

const renderStatus = (state) => {
  switch (state.registrationProcess.state) {
    case 'filling':
      input.readOnly = false;
      button.disabled = false;
      break;
    case 'processing':
      input.readOnly = true;
      button.disabled = true;
      break;
    case 'success':
      input.readOnly = false;
      button.disabled = false;
      break;
    default:
      break;
  }
};

const renderMessage = (updatedState) => new Promise((resolve) => {
  setTimeout(() => {
    if (updatedState.isValid) {
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = updatedState.message;
      input.value = '';
      input.focus();
    } else {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = updatedState.message;
      input.focus();
    }
    resolve();
  }, 0);
});

const createTitle = (container, titleText, listId) => {
  const divElement = document.createElement('div');
  divElement.classList.add('card', 'border-0');
  container.appendChild(divElement);

  const divBody = document.createElement('div');
  divBody.classList.add('card-body');
  divElement.appendChild(divBody);

  const titleElement = document.createElement('h2');
  titleElement.classList.add('card-title', 'h4');
  titleElement.textContent = titleText;
  divBody.appendChild(titleElement);

  const ulElement = document.createElement('ul');
  ulElement.setAttribute('id', listId);
  ulElement.classList.add('list-group', 'border-0', 'rounded-0');
  divElement.appendChild(ulElement);
};

const renderFeeds = (feeds) => {
  const ulFeeds = document.getElementById('feeds-container');
  feeds.forEach((feed) => {
    const liFeeds = document.createElement('li');
    liFeeds.classList.add('list-group-item', 'border-0', 'border-end-0');
    ulFeeds.appendChild(liFeeds);

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    liFeeds.appendChild(h3);

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    liFeeds.appendChild(p);
  });
};

const renderPost = (diff) => {
  const container = document.getElementById('posts-container');

  diff.forEach((item) => {
    const postItemElement = document.createElement('li');
    postItemElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const postLinkElement = document.createElement('a');
    postLinkElement.classList.add('fw-bold');
    postLinkElement.textContent = item.postTitle;
    postLinkElement.href = item.postLink;
    postLinkElement.target = '_blank';
    postLinkElement.dataset.id = item.postId;

    postItemElement.appendChild(postLinkElement);
    container.appendChild(postItemElement);
    showLink(postLinkElement);

    const createButton = document.createElement('button');
    createButton.setAttribute('type', 'button');
    createButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    createButton.setAttribute('data-bs-toggle', 'modal');
    createButton.setAttribute('data-bs-target', '#modal');
    createButton.textContent = 'Просмотр';
    createButton.dataset.id = item.postId;

    postItemElement.append(createButton);
  });
  showModalController(diff);
};

const renderFeedsAndSuccessMessage = (updatedState) => {
  createTitle(feedsContainer, 'Фиды', 'feeds-container');
  renderFeeds(updatedState.feeds);
  renderMessage(updatedState);
};

export {
  renderMessage,
  renderStatus,
  renderFeedsAndSuccessMessage, renderPost, createTitle, renderFeeds,
};
