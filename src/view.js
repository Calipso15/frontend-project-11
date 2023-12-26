import { Modal } from 'bootstrap';
import _ from 'lodash';
import showLink from './controller';

const elements = {
  form: document.querySelector('.rss-form'),
  feedback: document.querySelector('.feedback'),
  input: document.getElementById('url-input'),
  postsContainer: document.querySelector('.posts'),
  feedsContainer: document.querySelector('.feeds'),
  ulFeeds: document.getElementById('feeds-container'),
  ulPosts: document.getElementById('posts-container'),
  button: document.querySelector('button[type="submit"]'),

  modal: {
    modalElement: document.getElementById('modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    readMoreButton: document.querySelector('.btn-primary'),
  },
};

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
  elements.modal.readMoreButton.href = postLink;
  elements.modal.modalTitle.textContent = postTitle;
  elements.modal.modalBody.textContent = postContent;

  const modal = new Modal(elements.modal.modalElement);

  modal.show();

  setupModalController(elements.modal.modalElement);
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

const renderMessage = (updatedState) => new Promise((resolve) => {
  setTimeout(() => {
    if (updatedState.isValid) {
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = updatedState.message;
      elements.input.value = '';
      elements.input.focus();
    } else {
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = updatedState.message;
      elements.input.focus();
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
  ulElement.classList.add('list-group', 'border-0', 'rounded-0', 'lala');
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
  createTitle(elements.feedsContainer, 'Фиды', 'feeds-container');
  renderFeeds(updatedState.feeds);
  renderMessage(updatedState);
};

const handleFeedsChange = (watchedState, value, prevValue) => {
  if (!prevValue.length) {
    renderFeedsAndSuccessMessage(watchedState);
  } else {
    const diff = _.differenceWith(
      value,
      prevValue,
      (val, prev) => val.feedsId === prev.feedsId,
    );
    renderFeeds(diff);
  }
};

const handlePostsChange = (value, prevValue) => {
  if (value.length && !prevValue.length) {
    createTitle(elements.postsContainer, 'Посты', 'posts-container');
  }
  const diff = _.differenceWith(
    value,
    prevValue,
    (val, prev) => val.postId === prev.postId,
  );
  renderPost(diff);
};

const render = (state, path, value, prevValue) => {
  switch (path) {
    case 'isValid':
      renderMessage(state);
      break;
    case 'feeds': {
      handleFeedsChange(state, value, prevValue);
      break;
    }
    case 'posts': {
      handlePostsChange(value, prevValue);
      break;
    }
    default:
      renderMessage(state);
  }
};

export default render;
