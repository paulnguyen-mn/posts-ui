import queryString from './lib/queryString.js';
import postApi from './api/postApi.js';
import AppConstants from './appConstants.js';
import utils from './utils.js';


const fillPostData = (post) => {
  // Set SEO meta tags
  document.title = post.title;
  document.description = utils.truncateTextlength(post.description, 120);

  // Set hero image
  const imageElement = document.getElementById('postHeroImage');
  if (imageElement) {
    imageElement.style.backgroundImage = `url(${post.imageUrl || AppConstants.DEFAULT_HERO_IMAGE_URL})`;
  }

  // Set title
  const titleElement = document.getElementById('postDetailTitle');
  if (titleElement) {
    titleElement.innerText = post.title;
  }

  // Set author
  const authorElement = document.getElementById('postDetailAuthor');
  if (authorElement) {
    authorElement.innerText = post.author;
  }

  // Set time span
  const timeSpanElement = document.getElementById('postDetailTimeSpan');
  if (timeSpanElement) {
    const timeString = utils.formatDate(post.updatedAt);
    timeSpanElement.innerText = ` - ${timeString}`;
  }

  // Set description
  const descriptionElement = document.getElementById('postDetailDescription');
  if (descriptionElement) {
    descriptionElement.innerText = post.description;
  }
};


// ---------------------------
// MAIN LOGIC
// ---------------------------
const init = async () => {
  // Parse search params to get postId
  let search = window.location.search;
  // Remove beginning question mark
  search = search ? search.substring(1) : '';

  const { postId } = queryString.parse(search);
  if (postId) {
    // Fetch post detail by id
    const post = await postApi.getById(postId);

    // Fill post data
    fillPostData(post);
  }
};
init();
