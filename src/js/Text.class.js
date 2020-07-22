export default class Text {
  constructor() {
    this.text = 'this is a test';
    this.selector = 'p';
    this.elements = document.querySelectorAll(this.selector);
    this.init();
  }

  init() {
    this.elements.forEach((element) => {
      element.setAttribute('data-text', this.text);
    });
  }
  toggle() {
    this.elements.forEach((element) => {
      const text = element.getAttribute('data-text');
      // eslint-disable-next-line no-param-reassign
      element.setAttribute('data-text', element.textContent);
      element.textContent = text;
    });
    // eslint-disable-next-line no-console
    console.info(`Changed text to "${this.text}"`, this.elements);
  }
}
