class MyBlockTune {
  constructor({ api }) {
    this.api = api;
  }

  static get isTune() {
    return true;
  }

  render() {
    return {
        icon: "test", 
        title: 'H',
    };
  }
}

export default MyBlockTune

