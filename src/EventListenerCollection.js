export default class EventListenerCollection {
    constructor() {
        this.listenerCollection = [];
    }
    emitEvent(valueToEmit) {
        if (this.listenerCollection && this.listenerCollection.length > 0) {
            for (const aListener of this.listenerCollection) {
                if (aListener) {
                    aListener(valueToEmit);
                }
            }
        }
    }
    addListener(callback) {
        if (!this.listenerCollection.includes(callback)) {
            this.listenerCollection.push(callback);
        }
    }
    removeListener(callback) {
        const index = this.listenerCollection.indexOf(callback);
        if (index > -1) {
            this.listenerCollection.splice(index, 1);
        }
    }
    hasListeners() {
        return this.listenerCollection.length > 0;
    }
}
