import { Modal } from 'bootstrap';
import _ from 'lodash';
import onChange from 'on-change';

const setupModalController = (modalElement) => {
  modalElement.addEventListener('hidden.bs.modal', () => {
    document.body.style = '';
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  });
};

const showModal = (elements, postTitle, postContent, postLink) => {
  const updatedElements = { ...elements };

  updatedElements.modal.readMoreButton.href = postLink;
  updatedElements.modal.modalTitle.textContent = postTitle;
  updatedElements.modal.modalBody.textContent = postContent;

  const modal = new Modal(updatedElements.modal.modalElement);

  modal.show();

  setupModalController(updatedElements.modal.modalElement);
};

const findPostById = (postId, diff) => diff.find((post) => post.postId === postId);

const changeViewedPostLinksColor = (postIds) => {
  postIds.forEach((postId) => {
    const postLinkElement = document.querySelector(`a[data-id="${postId}"]`);
    if (postLinkElement) {
      postLinkElement.classList.remove('fw-bold');
      postLinkElement.classList.add('fw-normal', 'link-secondary');
    }
  });
};

const renderMessage = (elements, updatedState) => new Promise((resolve) => {
  setTimeout(() => {
    const updatedElements = { ...elements };
    if (updatedState.isValid) {
      updatedElements.input.classList.remove('is-invalid');
      updatedElements.feedback.classList.remove('text-danger');
      updatedElements.feedback.classList.add('text-success');
      updatedElements.feedback.textContent = updatedState.message;
      updatedElements.input.value = '';
      updatedElements.input.focus();
    } else {
      updatedElements.input.classList.add('is-invalid');
      updatedElements.feedback.classList.remove('text-success');
      updatedElements.feedback.classList.add('text-danger');
      updatedElements.feedback.textContent = updatedState.message;
      updatedElements.input.focus();
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
  const ulPosts = document.getElementById('posts-container');
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
    ulPosts.appendChild(postItemElement);

    const createButton = document.createElement('button');
    createButton.setAttribute('type', 'button');
    createButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    createButton.setAttribute('data-bs-toggle', 'modal');
    createButton.setAttribute('data-bs-target', '#modal');
    createButton.textContent = 'Просмотр';
    createButton.dataset.id = item.postId;

    postItemElement.append(createButton);
  });
};

const renderFeedsAndSuccessMessage = (elements, updatedState) => {
  createTitle(elements.feedsContainer, 'Фиды', 'feeds-container');
  renderFeeds(updatedState.feeds);
  renderMessage(elements, updatedState);
};

const handleFeedsChange = (elements, watchedState, value, prevValue) => {
  if (!prevValue.length) {
    renderFeedsAndSuccessMessage(elements, watchedState);
  } else {
    const diff = _.differenceWith(
      value,
      prevValue,
      (val, prev) => val.feedsId === prev.feedsId,
    );
    renderFeeds(diff);
  }
};

const handlePostsChange = (elements, value, prevValue) => {
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

const render = (originalElements, state, path, value, prevValue) => {
  const elements = { ...originalElements };

  switch (path) {
    case 'isValid':
      renderMessage(elements, state);
      break;
    case 'feeds':
      handleFeedsChange(elements, state, value, prevValue);
      break;
    case 'posts':
      handlePostsChange(elements, value, prevValue);
      break;
    case 'viewPosts':
      changeViewedPostLinksColor(state.viewPosts);
      break;
    case 'modalPost':
      if (value) {
        const post = findPostById(value, state.posts);
        if (post) {
          const { postTitle, postDescription, postLink } = post;
          showModal(elements, postTitle, postDescription, postLink);
        }
      }
      break;
    case 'loadProcess':
      switch (value) {
        case 'loading':
          elements.button.disabled = true;
          elements.input.readOnly = true;
          break;
        case 'success':
          elements.button.disabled = false;
          elements.input.readOnly = false;
          break;
        case 'fail':
          elements.button.disabled = false;
          elements.input.readOnly = false;
          break;
        case 'idle':
          elements.button.disabled = false;
          elements.input.readOnly = false;
          break;
        default:
          break;
      }
      break;
    default:
      renderMessage(elements, state);
  }
};

const createWatchedState = (elements, state) => onChange(state, (path, value, prevValue) => {
  render(elements, state, path, value, prevValue);
});

export default createWatchedState;
