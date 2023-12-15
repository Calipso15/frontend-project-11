import { Modal } from 'bootstrap';

const feedback = document.querySelector('.feedback');
const input = document.getElementById('url-input');
const postsContainer = document.querySelector('.posts');
const feedsContainer = document.querySelector('.feeds');

const renderMessage = (updatedState) => {
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
};

const renderFeeds = (updatedState) => {
  updatedState.feeds.forEach((feed) => {
    const divFeeds = document.createElement('div');
    divFeeds.classList.add('card', 'border-0');
    feedsContainer.appendChild(divFeeds);

    const divFeedsBody = document.createElement('div');
    divFeedsBody.classList.add('card-body');
    divFeeds.appendChild(divFeedsBody);

    const tFeeds = document.createElement('h2');
    tFeeds.classList.add('card-title', 'h4');
    tFeeds.textContent = 'Фиды';
    divFeedsBody.appendChild(tFeeds);

    const ulFeeds = document.createElement('ul');
    ulFeeds.classList.add('list-group', 'border-0', 'rounded-0');
    divFeeds.appendChild(ulFeeds);

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

  modalElement.addEventListener('hidden.bs.modal', () => {
    document.body.style = '';
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  });
};

const titlePost = () => {
  const divPost = document.createElement('div');
  divPost.classList.add('card', 'border-0');
  postsContainer.appendChild(divPost);

  const divBody = document.createElement('div');
  divBody.classList.add('card-body');
  divPost.appendChild(divBody);

  const t = document.createElement('h2');
  t.classList.add('card-title', 'h4');
  t.textContent = 'Посты';
  divBody.appendChild(t);

  const ulPosts = document.createElement('ul');
  ulPosts.setAttribute('id', 'ul-container');
  ulPosts.classList.add('list-group', 'border-0', 'rounded-0');
  divPost.appendChild(ulPosts);
};

const renderPost = (diff) => {
  const container = document.getElementById('ul-container');
  diff.forEach((item) => {
    const postItemElement = document.createElement('li');
    postItemElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const linkId = `link-${item.postId}`;
    const postLinkElement = document.createElement('a');
    postLinkElement.id = linkId;
    postLinkElement.classList.add('fw-bold');
    postLinkElement.textContent = item.postTitle;
    postLinkElement.href = item.postLink;
    postLinkElement.target = '_blank';
    postItemElement.appendChild(postLinkElement);
    container.appendChild(postItemElement);

    postLinkElement.addEventListener('click', () => {
      postLinkElement.classList.remove('fw-bold');
      postLinkElement.classList.add('fw-normal', 'link-secondary');
    });

    const createBatton = document.createElement('button');
    createBatton.id = linkId;
    createBatton.setAttribute('type', 'button');
    createBatton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    createBatton.setAttribute('data-bs-toggle', 'modal');
    createBatton.setAttribute('data-bs-target', '#modal');
    createBatton.textContent = 'Просмотр';
    postItemElement.append(createBatton);

    createBatton.addEventListener('click', () => {
      postLinkElement.classList.remove('fw-bold');
      postLinkElement.classList.add('fw-normal', 'link-secondary');
      const postTitle1 = item.postTitle;
      const postContent = item.postDescription;

      showModal(postTitle1, postContent, item.postLink);
    });
  });
};

const renderFeedsAndSuccessMessage = (updatedState) => {
  renderFeeds(updatedState);
  renderMessage(updatedState);
};

export {
  renderMessage, renderFeedsAndSuccessMessage, renderPost, titlePost, renderFeeds,
};
