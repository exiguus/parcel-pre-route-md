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
    content: main,
  },
  footer: {
    shadow: document.getElementById('footer').attachShadow({mode: 'open'}),
    content: footer,
  },
};

const render = (status) => {
  const currentPage = () => {
    const hash = document.location.hash.substring(3);
    const pathname = document.location.pathname.substring(1);
    const path = (pathname.charAt(pathname.length-1) === '/')
      ? pathname.slice(0, -1) : pathname;
    const page = pages[hash] || pages[path] || pages['index'];
    return page;
  };
  setup.main.content = currentPage();

  const meta = setup.main.content.meta || {};
  const defaultTitle = 'Default Title';
  let title = document.querySelector('title').textContent;
  if (title !== meta.title && title !== defaultTitle ) title = meta.title || defaultTitle;

  if (status) {
    if (setup[status].shadow.innerHTML !== setup[status].content.html) {
      setup[status].shadow.innerHTML = setup[status].content.html;
    }
    if (process.env.NODE_ENV === 'development') console.log(`render:${status}`);
  } else {
    Object.keys(setup).forEach((key) => {
      if (setup[key].shadow.innerHTML !== setup[key].content.html) {
        setup[key].shadow.innerHTML = setup[key].content.html;
      }
      if (process.env.NODE_ENV === 'development') console.log(`render:${key}`);
    });
  }
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
