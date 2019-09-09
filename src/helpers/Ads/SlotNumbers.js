class SlotNumbers {
    constructor() {
        this._counter = 0;
        this.updateCounter(this._counter);
    }

    get counter() {
        return this._counter;
    }

    set counter(val) {
        this._counter = val;
        this.updateCounter();
    }

    updateCounter() {
        window.localStorage.setItem('slotNumber', this.counter);
    }
}

export default SlotNumbers;
