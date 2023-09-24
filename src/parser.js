import Axios from 'axios';
import { Modal } from 'bootstrap';
import { createFeedContainer, createPostContainer } from './addFeedPost';

let modal;

function showModal(postTitle, postContent, postLink) {
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const readMoreButton = document.querySelector('.btn-primary');
  readMoreButton.href = postLink;
  modalTitle.textContent = postTitle;
  modalBody.textContent = postContent;

  modal.show();
}

document.addEventListener('DOMContentLoaded', () => {
  const modalElement = document.getElementById('modal');
  modal = new Modal(modalElement);
});

function createListBatton(items) {
  const postsListElement = document.createElement('ul');
  postsListElement.classList.add('list-group', 'border-0', 'rounded-0');
  items.forEach((item, index) => {
    const postTitle = item.querySelector('title').textContent;
    const postLink = item.querySelector('link').textContent;

    const postItemElement = document.createElement('li');
    postItemElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const linkId = `link-${index}`;
    const postLinkElement = document.createElement('a');
    postLinkElement.id = linkId;
    postLinkElement.classList.add('fw-bold');
    postLinkElement.textContent = postTitle;
    postLinkElement.href = postLink;
    postLinkElement.target = '_blank';
    postItemElement.appendChild(postLinkElement);
    const ulPosts = document.querySelector('.rounded-0');
    ulPosts.appendChild(postItemElement);

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
      const postTitle1 = item.querySelector('title').textContent;
      const postContent = item.querySelector('description').textContent;

      showModal(postTitle1, postContent, postLink);
    });
  });
}

function loadRSSFeed(url) {
  if (modal) {
    modal.hide();
  }
  return Axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data.contents, 'text/xml');

      const title = xmlDoc.querySelector('channel > title').textContent;
      const description = xmlDoc.querySelector('channel > description').textContent;
      createPostContainer();
      const items = xmlDoc.querySelectorAll('item');
      createListBatton(items);

      createFeedContainer(title, description);
    })

    .catch((error) => {
      console.error('Произошла ошибка при загрузке RSS-потока:', error);
      // Здесь вы можете обработать ошибку и выполнить соответствующие действия
    });
}

export default loadRSSFeed;
