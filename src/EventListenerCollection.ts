export default class EventListenerCollection {
  listenerCollection: Array<Function> = [];

  public emitEvent(valueToEmit: unknown): void {
    if (this.listenerCollection && this.listenerCollection.length > 0) {
      for (const aListener of this.listenerCollection) {
        if (aListener) {
          aListener(valueToEmit);
        }
      }
    }
  }

  public addListener(callback: Function): void {
    if (!this.listenerCollection.includes(callback)) {
      this.listenerCollection.push(callback);
    }
  }

  public removeListener(callback: any) {
    const index = this.listenerCollection.indexOf(callback);
    if (index > -1) {
      this.listenerCollection.splice(index, 1);
    }
  }

  public hasListeners(): boolean {
    return this.listenerCollection.length > 0;
  }
}
