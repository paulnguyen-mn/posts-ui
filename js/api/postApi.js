import fetchClient from "./fetchClient.js";

class PostApi {
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }

  parseJson(response) {
    return response.json()
  }

  async sayHello() {
    return fetch('https://js-post-api.herokuapp.com/posts')
      .then(this.checkStatus)
      .then(this.parseJson)
      .then(posts => {
        console.log('JSON response: ', posts);
      })
      .catch(error => {
        console.log('Failed to fetch list of posts: ', error);
      });
  }

  async sayHelloV2() {
    try {
      const pagination = {
        _page: 1,
        _limit: 5,
      };
      await fetchClient.get('http://localhost:8080/api/posts', pagination);

      // Add new post
      const post = {
        title: 'Random title 11',
        author: 'Po Nguyen',
        description: 'for testing',
      }
      // await fetchClient.post('https://js-post-api.herokuapp.com/posts', post);
      // await fetchClient.patch('https://js-post-api.herokuapp.com/posts/11', post);
      // await fetchClient.delete('https://js-post-api.herokuapp.com/posts/11');
    } catch (error) {
      console.log('Failed to fetch posts: ', error);
    }


    // try {
    //   const response = await fetch('https://js-post-api.herokuapp.com/posts');
    //   await this.checkStatus(response);
    //   const posts = await this.parseJson(response);

    //   console.log('JSON response: ', posts);
    // } catch (error) {
    //   console.log('Failed to fetch list of posts: ', error);
    // };

  }
}

const postApi = new PostApi();
export default postApi;
