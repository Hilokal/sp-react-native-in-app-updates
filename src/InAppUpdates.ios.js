import InAppUpdatesBase from './InAppUpdatesBase';
const noop = () => { };
export default class InAppUpdates extends InAppUpdatesBase {
    constructor() {
        super(...arguments);
        this.installUpdate = noop;
        this.addStatusUpdateListener = noop;
        this.removeStatusUpdateListener = noop;
        this.addIntentSelectionListener = noop;
        this.removeIntentSelectionListener = noop;
    }
    checkNeedsUpdate(
    // @ts-ignore - unused variable
    checkOptions) {
        return Promise.reject(Error("This API isn't available on iOS"));
    }
    // @ts-ignore - unused variable
    startUpdate(options) {
        return Promise.reject(Error("This API isn't available on iOS"));
    }
}
