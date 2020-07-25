export default class ColorMode {
  constructor(buttons) {
    this.mode = {
      selector: 'color-mode',
      element: document.documentElement,
    };
    this.switch = {
      primary: {
        selector: window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
      },
      secondary: {
        selector: window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'light'
          : 'dark',
      },
    };
    this.button = {
      elements: buttons,
    };

    this.status =
      localStorage.getItem(this.mode.selector) || this.switch.primary.selector;
  }

  init() {
    this.bindEvents();
  }

  toggleStatus() {
    return this.status === this.switch.primary.selector
      ? this.switch.secondary.selector
      : this.switch.primary.selector;
  }

  bindEvents() {
    this.button.elements.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        console.log(this.status);
        this.status = this.toggleStatus();
      });
    });
  }

  get status() {
    return (
      localStorage.getItem(this.mode.selector) || this.switch.primary.selector
    );
  }

  set status(mode) {
    localStorage.setItem(this.mode.selector, mode);
    this.mode.element.setAttribute(this.mode.selector, mode);
  }
}
