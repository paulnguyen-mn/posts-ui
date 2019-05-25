import queryString from './lib/queryString.js';
import postApi from './api/postApi.js';
import AppConstants from './appConstants.js';
import utils from './utils.js';

const getPostFormValues = () => {
  const formValues = {
    title: utils.getValueByElementId('postTitle'),
    author: utils.getValueByElementId('postAuthor'),
    description: utils.getValueByElementId('postDescription'),
    imageUrl: utils.getBackgroundImageByElementId('postHeroImage'),
  };

  return formValues;
};


const setPostFormValues = (post) => {
  // Set title
  utils.setValueByElementId('postTitle', post.title);

  // Set author
  utils.setValueByElementId('postAuthor', post.author);

  // Set description
  utils.setValueByElementId('postDescription', post.description);

  // Set image
  utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl);
};


const handleChangeImageClick = () => {
  // Random a number: 1 ~ 1000
  const randomId = 1 + Math.trunc(Math.random() * 1000);

  // Generate image URL
  const imageUrl = `https://picsum.photos/id/${randomId}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT}`;

  // Update hero background image
  utils.setBackgroundImageByElementId('postHeroImage', imageUrl);
};


const validatePostForm = () => {

  return true;
};


const handlePostFormSubmit = async (postId) => {
  const formValues = getPostFormValues();

  // Form validation
  const isValid = validatePostForm();
  if (isValid) {
    try {
      // Add/update data
      const payload = {
        id: postId,
        ...formValues,
      };

      if (postId) {
        await postApi.updatePost(payload);
      } else {
        await postApi.addNewPost(payload);
      }

      alert('Save post successfully');
    } catch (error) {
      alert('Failed to save post: ', error);
    }
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
  const isEditMode = !!postId;
  // This page has two modes either add or edit a post
  // How to know which mode? If postId is present, then it's edit mode'
  if (isEditMode) {
    // Fetch post detail by id
    const post = await postApi.getById(postId);

    // Fill post data
    setPostFormValues(post);
  } else {
    // What we do in ADD mode
    // Random a post image =))
  }

  // Add event for button: change post image
  const postChangeImageButton = document.getElementById('postChangeImage');
  if (postChangeImageButton) {
    postChangeImageButton.addEventListener('click', handleChangeImageClick);
  }

  // Handle form submit button
  const postForm = document.getElementById('postForm');
  if (postForm) {
    postForm.addEventListener('submit', (e) => {
      handlePostFormSubmit(postId);
      e.preventDefault();
    });
  }
};
init();
