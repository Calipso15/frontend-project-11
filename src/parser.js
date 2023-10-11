import Axios from 'axios';
import { Modal } from 'bootstrap';
import _ from 'lodash';
import i18n from 'i18next';
import yupMessages from './message';
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
const newPosts = [];
const addedPosts = [];

function checkForNewPosts(url) {
  return Axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
    .then((response) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data.contents, 'text/xml');
      const items = Array.from(xmlDoc.querySelectorAll('item'));
      newPosts.length = 0;
      const newPostLinks = Array.from(items, (item) => item.querySelector('link').textContent);
      const uniqueNewPostLinks = _.difference(newPostLinks, addedPosts);
      const newUniquePosts = items.filter((item) => uniqueNewPostLinks.includes(item.querySelector('link').textContent));
      newPosts.push(...newUniquePosts);
      addedPosts.push(...uniqueNewPostLinks);

      createListBatton(newUniquePosts);
    })
    .catch(() => i18n.t(yupMessages.mixed.default));
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
      items.forEach((item) => {
        const postLink = item.querySelector('link').textContent;
        addedPosts.push(postLink);
      });

      createListBatton(items);

      createFeedContainer(title, description);

      checkForNewPosts(url);

      setInterval(() => {
        checkForNewPosts(url);
      }, 5000);
    })
    .catch(() => i18n.t(yupMessages.mixed.default));
}

export default loadRSSFeed;
