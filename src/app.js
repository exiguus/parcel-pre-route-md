/* globals
  process
*/
import 'babel-polyfill';

import Text from './js/Text.class';

import header from '../data/partials/Header.md';
import footer from '../data/partials/Footer.md';

import index from '../data/pages/Index.md';
import contact from '../data/pages/Contact.md';
import about from '../data/pages/About.md';

const pages = {
  index,
  contact,
  about,
};

const setup = {
  header: {
    shadow: null,
    content: header,
  },
  main: {
    shadow: null,
    content: index,
  },
  footer: {
    shadow: null,
    content: footer,
  },
};

const appendDOM = (key) => {
  let wrapper;
  if (window['__PRERENDER_INJECTED']) {
    wrapper = document.createElement('div');
    wrapper.insertAdjacentHTML('afterbegin', setup[key].content.html);
    document.getElementById(key).append(wrapper);
  } else {
    wrapper = document.createElement(key);
    wrapper.insertAdjacentHTML('afterbegin', setup[key].content.html);
    wrapper.id = key;
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', document.querySelector('link[rel="stylesheet"]').href);
    setup[key].shadow.appendChild(linkElem);
    setup[key].shadow.appendChild(wrapper);
  }
}

const createShadow = (key, item) => {
    if (!window['__PRERENDER_INJECTED'] && !item.shadow) {
      const wrapper = document.getElementById(key);
      setup[key].shadow = wrapper.attachShadow({mode: 'open'})
    }
}

const updateDOM = (status) => {
  const items = setup[status] || setup;
  Object.keys(items).forEach((key) => {
    createShadow(key, items[key]);
    appendDOM(key);
    if (process.env.NODE_ENV === 'development') console.log(`render:${key}`);
  });
};

const render = (status) => {
  // routing
  const main = () => {
    const pathname = document.location.pathname.substring(1);
    const path = (pathname.charAt(pathname.length-1) === '/')
      ? pathname.slice(0, -1) : pathname;
    const page = pages[path] || pages['index'];
    return page;
  };
  setup.main.content = main();
  updateDOM(status);
};
render();

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.dispatchEvent(new Event('prerender-trigger'));
  }, 600);
});
window.addEventListener('hashchange', () => {
  render('main');
});

// misc
const text = new Text();

const button = document.querySelector('button');

button.addEventListener('click', (event) => {
  event.preventDefault();
  text.toggle();
});
