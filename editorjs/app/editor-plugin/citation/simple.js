class SimpleImage {
    constructor() {
        this.button=null;
        this.state=false;
    }

    static get isInline() {
        return true;
    }

    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.textContext = "M";

        return this.button
    }

    surround(range) {
        if(this.state) return;

        const selectedText = range.extractContent();
        const mark = document.createElement('MARK');
        mark.appendChild(selectedText);
        range.insertNode(mark);
    }
    checkState(selection) {
        const text = selection.anchorNode;
    }
}

export default SimpleImage