import Axios from 'axios';
import { Modal } from 'bootstrap';

let modal; // Глобальная переменная для хранения экземпляра модального окна

function showModal(postTitle, postContent) {
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');

  modalTitle.textContent = postTitle;
  modalBody.textContent = postContent;

  modal.show();
}

// Создаем модальное окно один раз при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const modalElement = document.getElementById('modal');
  modal = new Modal(modalElement);
});

// Функция для загрузки и отображения RSS-потока
function loadRSSFeed(url) {
  if (modal) {
    modal.hide();
  }
  let activeTabs = '';
  // Выполняем HTTP-запрос к RSS-потоку
  return Axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      // Парсим полученный XML-документ с помощью DOMParser
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data.contents, 'text/xml');

      const title = xmlDoc.querySelector('channel > title').textContent;
      const description = xmlDoc.querySelector('channel > description').textContent;

      const postsContainer = document.querySelector('.posts');
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
      ulPosts.classList.add('list-group', 'border-0', 'rounded-0');
      divPost.appendChild(ulPosts);

      const items = xmlDoc.querySelectorAll('item');

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
          const battonId = createBatton.getAttribute('id');
          activeTabs = battonId;
          const postTitle1 = item.querySelector('title').textContent;
          const postContent = item.querySelector('description').textContent;

          showModal(postTitle1, postContent);
        });

        const readMoreButton = document.querySelector('.btn-primary');
        readMoreButton.addEventListener('click', () => {
          const searchId = document.querySelector(`a#${activeTabs}`);
          window.open(searchId.href, '_blank'); // Открываем ссылку в новой вкладке
        });

        postLinkElement.addEventListener('click', () => {
          postLinkElement.classList.remove('fw-bold');
          postLinkElement.classList.add('fw-normal', 'link-secondary');
          const postLink1 = postLinkElement.href; // Получаем ссылку
          window.open(postLink1, '_blank'); // Открываем ссылку в новой вкладке
        });
      });

      const feedsContainer = document.querySelector('.feeds');
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
      h3.textContent = title;
      liFeeds.appendChild(h3);

      const p = document.createElement('p');
      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = description;
      liFeeds.appendChild(p);
    })

    .catch((error) => {
      console.error('Произошла ошибка при загрузке RSS-потока:', error);
      // Здесь вы можете обработать ошибку и выполнить соответствующие действия
    });
}

export default loadRSSFeed;
