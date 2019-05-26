'use strict';

import postApi from './api/postApi.js';
import AppConstants from './appConstants.js';
import utils from './utils.js';
import queryString from './lib/queryString.js';

const handlePostItemRemoveClick = async (post) => {
  try {
    const confirmMessage = `Remove this post ${post.title}. Really?!`;
    if (window.confirm(confirmMessage)) {
      // Remove this post
      await postApi.removePost(post.id);

      // Reload current page
      window.location.reload();
    }
  } catch (error) {
    alert('Failed to remove post: ', error);
  }
};

const renderPostItem = (post) => {
  // Get post item template
  const postItemTemplate = document.getElementById('postItemTemplate');
  const postItemElement = postItemTemplate.content.cloneNode(true);

  // Fill post data to template
  // Set title
  const titleElement = postItemElement.getElementById('postItemTitle');
  if (titleElement) {
    titleElement.innerText = post.title;
  }

  // Set description
  const descriptionElement = postItemElement.getElementById('postItemDescription');
  if (descriptionElement) {
    descriptionElement.innerText = utils.truncateTextlength(post.description, 100);
  }

  // Set image
  const imageElement = postItemElement.getElementById('postItemImage');
  if (imageElement) {
    imageElement.src = post.imageUrl || AppConstants.DEFAULT_IMAGE_URL;
  }

  // Set author
  const authorElement = postItemElement.getElementById('postItemAuthor');
  if (authorElement) {
    authorElement.innerText = post.author;
  }

  // Set created time
  const timeSpanElement = postItemElement.getElementById('postItemTimeSpan');
  if (timeSpanElement) {
    const timeString = utils.formatDate(post.createdAt);
    timeSpanElement.innerText = ` - ${timeString}`;
  }

  // Add item click to go view detail page
  const postItem = postItemElement.getElementById('postItem');
  postItem.addEventListener('click', () => {
    const detailPageUrl = `post-detail.html?postId=${post.id}`;

    // Go to detail page
    window.location = detailPageUrl;
  });

  // Go to edit page when click on edit icon
  const editIcon = postItemElement.getElementById('postItemEdit');
  editIcon.addEventListener('click', (e) => {
    const editPageUrl = `add-edit-post.html?postId=${post.id}`;

    // Go to detail page
    window.location = editPageUrl;

    // Prevent bubbling click event on parent element
    e.stopPropagation();
  });

  // Confirm to remove a post
  const removeIcon = postItemElement.getElementById('postItemRemove');
  removeIcon.addEventListener('click', (e) => {
    handlePostItemRemoveClick(post);

    // Prevent bubbling click event on parent element
    e.stopPropagation();
  });

  return postItemElement;
};

const resetPostsElementNode = (postsElement) => {
  if (postsElement) {
    while (postsElement.firstChild) {
      postsElement.removeChild(postsElement.firstChild);
    }
  }
}

const renderListOfPosts = (posts) => {
  const postsElement = document.getElementById('postsList');

  if (postsElement) {
    // Clean up current list of posts displayed on UI
    resetPostsElementNode(postsElement);

    // Map each post item -> post item element
    if (Array.isArray(posts)) {
      for (const post of posts) {
        const postItemElement = renderPostItem(post);
        if (postItemElement) {
          postsElement.appendChild(postItemElement);
        }
      }
    }
  } else {
    console.log('Ooops! Can\'t find postsList item');
  }
};

/**
 * Return a list of 3 page value: prev, curr and next
 * -1 means you should hide that item
 * 0 means you should disable that item
 * otherwise, show that item
 * @param pagination 
 */
const getPageList = (pagination) => {
  const { _limit, _totalRows, _page } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);
  let prevPage = -1;

  // Return -1 if invalid page detected
  if (_page < 1 || _page > totalPages) return [0, -1, -1, -1, 0];


  // Calculate prev page
  if (_page === 1) prevPage = 1;
  else if (_page === totalPages) prevPage = _page - 2 > 0 ? _page - 2 : 1;
  else prevPage = _page - 1;

  const currPage = prevPage + 1 > totalPages ? -1 : prevPage + 1;
  const nextPage = prevPage + 2 > totalPages ? -1 : prevPage + 2;

  return [
    _page === 1 || _page === 1 ? 0 : _page - 1,
    prevPage, currPage, nextPage,
    _page === totalPages || totalPages === _page ? 0 : _page + 1,
  ];
}

const renderPostsPagination = (pagination) => {
  const postPagination = document.querySelector('#postsPagination');
  if (postPagination) {
    const pageList = getPageList(pagination);
    const { _page, _limit } = pagination;
    // Search list of 5 page items
    const pageItems = postPagination.querySelectorAll('.page-item');

    // Just to make sure pageItems has exactly 5 items
    if (pageItems.length === 5) {
      pageItems.forEach((item, idx) => {
        switch (pageList[idx]) {
          case -1:
            item.setAttribute('hidden', '');
            break;
          case 0:
            item.classList.add('disabled');
            break;
          default: {
            // Find page link
            const pageLink = item.querySelector('.page-link');
            if (pageLink) {
              // Update href of page link
              pageLink.href = `?_page=${pageList[idx]}&_limit=${_limit}`;

              // Update text content of page link for item: 1, 2, 3 (zero base)
              if (idx > 0 && idx < 4) {
                pageLink.textContent = pageList[idx];
              }
            }

            // Set current active page item, only for 1, 2, 3 (zero base)
            if (idx > 0 && idx < 4 && pageList[idx] === _page) {
              item.classList.add('active');
            }
          }
        }
      });

      // Show pagination
      postPagination.removeAttribute('hidden');
    }
  }
};



// -----------------------
// MAIN LOGIC
// -----------------------
const init = async () => {
  try {
    let search = window.location.search;
    // Remove beginning question mark
    search = search ? search.substring(1) : '';

    const { _page, _limit } = queryString.parse(search);
    // Fetch list of posts item
    const params = {
      _page: _page || AppConstants.DEFAULT_PAGE,
      _limit: _limit || AppConstants.DEFAULT_LIMIT,
      _sort: 'updatedAt',
      _order: 'desc',
    };
    const response = await postApi.getAll(params);

    if (response) {
      const { data: posts, pagination } = response;
      renderListOfPosts(posts);
      renderPostsPagination(pagination);
    }
  } catch (error) {
    console.log('Failed to fetch list of posts: ', error);
  }
};

// Start initialization process
init();
