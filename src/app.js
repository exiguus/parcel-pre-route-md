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
    shadow: document.getElementById('header').attachShadow({mode: 'open'}),
    content: header,
  },
  main: {
    shadow: document.getElementById('main').attachShadow({mode: 'open'}),
    content: index,
  },
  footer: {
    shadow: document.getElementById('footer').attachShadow({mode: 'open'}),
    content: footer,
  },
};

const appendDOM = (key) => {
  // if isEqualNode
  const wrapper = document.createElement('div');
  wrapper.insertAdjacentHTML('afterbegin', setup[key].content.html);
  return setup[key].shadow.appendChild(wrapper);
}

const updateDOM = (status) => {
  const items = setup[status] || setup;
  Object.keys(items).forEach((key) => {
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
  }, 200);
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
