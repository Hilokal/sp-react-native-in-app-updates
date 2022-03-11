import { NativeModules, NativeEventEmitter } from 'react-native';
import { AndroidUpdateType, } from './types';
import InAppUpdatesBase from './InAppUpdatesBase';
const { SpInAppUpdates } = NativeModules;
const SpInAppUpdatesOrEmpty = SpInAppUpdates || {};
export default class InAppUpdates extends InAppUpdatesBase {
    constructor() {
        super();
        this.onIncomingNativeResult = (event) => {
            this.resultListeners.emitEvent(event);
        };
        this.onIncomingNativeStatusUpdate = (event) => {
            let { bytesDownloaded, totalBytesToDownload, status } = event;
            // This data comes from Java as a string, since React's WriteableMap doesn't support `long` type values.
            bytesDownloaded = parseInt(bytesDownloaded, 10);
            totalBytesToDownload = parseInt(totalBytesToDownload, 10);
            status = parseInt(`${status}`, 10);
            this.statusUpdateListeners.emitEvent({
                ...event,
                bytesDownloaded,
                totalBytesToDownload,
                status,
            });
        };
        this.addStatusUpdateListener = (callback) => {
            this.statusUpdateListeners.addListener(callback);
            if (this.statusUpdateListeners.hasListeners()) {
                SpInAppUpdates.setStatusUpdateSubscription(true);
            }
        };
        this.removeStatusUpdateListener = (callback) => {
            this.statusUpdateListeners.removeListener(callback);
            if (!this.statusUpdateListeners.hasListeners()) {
                SpInAppUpdates.setStatusUpdateSubscription(false);
            }
        };
        this.addIntentSelectionListener = (callback) => {
            this.resultListeners.addListener(callback);
        };
        this.removeIntentSelectionListener = (callback) => {
            this.resultListeners.removeListener(callback);
        };
        /**
         * Checks if there are any updates available.
         */
        this.checkNeedsUpdate = () => {
            return SpInAppUpdates.checkNeedsUpdate().catch((err) => {
                this.debugLog(err);
                this.throwError(err, 'checkNeedsUpdate');
            });
        };
        /**
         *
         * Shows pop-up asking user if they want to update, giving them the option to download said update.
         */
        this.startUpdate = (updateOptions) => {
            const { updateType } = updateOptions || {};
            if (updateType !== AndroidUpdateType.FLEXIBLE &&
                updateType !== AndroidUpdateType.IMMEDIATE) {
                this.throwError(`updateType should be one of: ${AndroidUpdateType.FLEXIBLE} or ${AndroidUpdateType.IMMEDIATE}, ${updateType} was passed.`, 'startUpdate');
            }
            return SpInAppUpdates.startUpdate(updateType).catch((err) => {
                this.throwError(err, 'startUpdate');
            });
        };
        this.installUpdate = () => {
            SpInAppUpdates.installUpdate();
        };
        this.eventEmitter = new NativeEventEmitter(SpInAppUpdates);
        this.eventEmitter.addListener(SpInAppUpdatesOrEmpty?.IN_APP_UPDATE_STATUS_KEY, this.onIncomingNativeStatusUpdate);
        this.eventEmitter.addListener(SpInAppUpdatesOrEmpty?.IN_APP_UPDATE_RESULT_KEY, this.onIncomingNativeResult);
    }
}
