import EventListenerCollection from './EventListenerCollection';
export default class InAppUpdatesBase {
    constructor(isDebug) {
        this.throwError = (err, scope) => {
            throw new Error(`${this.name} ${`${scope} ` || ''}error: ${err}`);
        };
        this.toString = () => {
            return this.name;
        };
        this.debugLog = (message) => {
            if (this.isDebug) {
                console.log(`@@ in-app-updates: ${message}`);
            }
        };
        this.name = 'sp-react-native-in-app-updates';
        this.statusUpdateListeners = new EventListenerCollection();
        this.resultListeners = new EventListenerCollection();
        this.isDebug = isDebug || false;
    }
}
