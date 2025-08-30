// Minimal HR block for Editor.js (renders a real <hr />)
type ConstructorArgs = {
  api: any;
  readOnly?: boolean;
  config?: { className?: string };
};

export default class DelimiterTool {
  private api: any;
  private readOnly: boolean;
  private wrapper!: HTMLElement;
  private className?: string;

  static get toolbox() {
    return {
      title: 'Delimiter',
      icon: `
        <svg width="17" height="17" viewBox="0 0 24 24">
          <path d="M3 12h18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>`,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }
  static get sanitize() {
    return {};
  } // no inline content to sanitize

  constructor({ data, api, readOnly, config }: ConstructorArgs) {
    this.api = api;
    this.readOnly = !!readOnly;
    this.className = config?.className;
  }

  render() {
    const holder = document.createElement('div');
    holder.classList.add('ce-hr');
    holder.contentEditable = 'false';
    holder.tabIndex = -1;

    const hr = document.createElement('hr');
    hr.className = this.className || 'ce-hr__line';

    holder.appendChild(hr);
    this.wrapper = holder;
    return holder;
  }

  save() {
    return {};
  }

  validate(_: any) {
    return true;
  }
}
