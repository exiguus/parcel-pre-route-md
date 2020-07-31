/* globals
  process
*/
import 'babel-polyfill';

import Text from './js/Text.class';
import ColorMode from './js/ColorMode.class';

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
  nav: {
    shadow: null,
    content: {},
  },
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
  if (window['__PRERENDER_INJECTED']) {
    document.getElementById(key).innerHTML = setup[key].content.html;
  } else {
    const wrapper = document.createElement(key);
    wrapper.id = key;
    wrapper.insertAdjacentHTML('afterbegin', setup[key].content.html + '');
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute(
      'href',
      document.querySelector('link[rel="stylesheet"]').href,
    );
    setup[key].shadow.appendChild(linkElem);
    setup[key].shadow.appendChild(wrapper);
  }
};

const createShadow = (key, item) => {
  if (!window['__PRERENDER_INJECTED'] && !item.shadow) {
    const wrapper = document.getElementById(key);
    setup[key].shadow = wrapper.attachShadow({mode: 'open'});
    wrapper.id = '';
  }
};

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
  const pathname = document.location.pathname.substring(1);
  const path =
    pathname.charAt(pathname.length - 1) === '/'
      ? pathname.slice(0, -1)
      : pathname;

  const main = () => {
    const page = pages[path] || pages['index'];
    return page;
  };
  setup.main.content = main();

  const navItems = () => {
    let items = '';
    Object.keys(pages).forEach((key) => {
      items += `<li><a href="/${pages[key].meta.id}"${
        pages[key].meta.id === path ? 'class="current"' : ''
      }>${pages[key].meta.title}</a></li>`;
    });
    return items;
  };
  setup.nav.content = {html: `<ul>${navItems()}</ul>`};

  updateDOM(status);

  if (window['__PRERENDER_INJECTED']) {
    document.querySelector('title').innerText =
      setup.main.content.meta.title || 'Title';
  }
};
render();

const init = () => {
  // Text DOM
  const text = new Text();

  const buttonText = document.querySelectorAll('#aside button');

  buttonText.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      text.toggle();
    });
  });

  // Color Mode shadow DOM
  const nav = setup.nav.shadow || document.getElementById('nav').parentNode;
  const container = nav.querySelector('#nav ul')
  const colorModeSwitch = document.createElement('li');
  const colorModeButton = document.createElement('button');
  colorModeButton.textContent = 'switch color mode';
  colorModeButton.style = `
    color: var(--primary-color);
    background-color: var(--secondary-color);
    border-color: var(--primary-color);
    cursor: pointer;
  `;
  colorModeSwitch.appendChild(colorModeButton);
  container.appendChild(colorModeSwitch);
  const colorMode = new ColorMode(container.querySelectorAll('#nav ul li button'));

  colorMode.init();
};

window.addEventListener('DOMContentLoaded', () => {
  init();
  setTimeout(() => {
    document.dispatchEvent(new Event('prerender-trigger'));
  }, 600);
});
window.addEventListener('hashchange', () => {
  render('main');
});
