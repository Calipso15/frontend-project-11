const showLink = (postLinkElement) => {
  postLinkElement.addEventListener('click', () => {
    postLinkElement.classList.remove('fw-bold');
    postLinkElement.classList.add('fw-normal', 'link-secondary');
  });
};

export default showLink;
