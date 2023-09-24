function createPostContainer() {
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
}

function createFeedContainer(title, description) {
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
}

export { createFeedContainer, createPostContainer };
