'use strict';

import postApi from './api/postApi.js';
// postApi.sayHello();

const sayHi = async () => {
  console.log('Hiiiii');

  await postApi.sayHelloV2();

  return '';
};

sayHi();
