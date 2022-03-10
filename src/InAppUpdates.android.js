import { NativeModules, NativeEventEmitter } from 'react-native';
import { getBuildNumber } from 'react-native-device-info';
import { AndroidInstallStatus, AndroidAvailabilityStatus, AndroidUpdateType, } from './types';
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
        this.checkNeedsUpdate = (checkOptions) => {
            const { curVersion } = checkOptions || {};
            let appVersion;
            if (curVersion == null) {
                appVersion = parseInt(getBuildNumber(), 10);
            }
            else {
                appVersion = curVersion;
            }
            this.debugLog('Checking store version (Android)');
            return SpInAppUpdates.checkNeedsUpdate()
                .then((inAppUpdateInfo) => {
                const { updateAvailability, versionCode: storeVersion } = inAppUpdateInfo || {};
                if (updateAvailability === AndroidAvailabilityStatus.AVAILABLE) {
                    if (storeVersion > appVersion) {
                        this.debugLog(`Compared cur version (${appVersion}) with store version (${storeVersion}). The store version is higher!`);
                        // play store version is higher than the current version
                        return {
                            shouldUpdate: true,
                            storeVersion,
                            other: { ...inAppUpdateInfo },
                        };
                    }
                    this.debugLog(`Compared cur version (${appVersion}) with store version (${storeVersion}). The current version is higher!`);
                    return {
                        shouldUpdate: false,
                        storeVersion,
                        reason: `current version (${appVersion}) is already later than the latest store version (${storeVersion})`,
                        other: { ...inAppUpdateInfo },
                    };
                }
                else if (updateAvailability === AndroidAvailabilityStatus.DEVELOPER_TRIGGERED) {
                    this.debugLog('Update has already been triggered by the developer');
                    if (inAppUpdateInfo.installStatus === AndroidInstallStatus.DOWNLOADED) {
                        return {
                            shouldUpdate: true,
                            storeVersion,
                            other: { ...inAppUpdateInfo },
                        };
                    }
                }
                else {
                    this.debugLog(`Failed to fetch a store version, status: ${updateAvailability}`);
                }
                return {
                    shouldUpdate: false,
                    reason: `status: ${updateAvailability} means there's no new version available`,
                    other: { ...inAppUpdateInfo },
                };
            })
                .catch((err) => {
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
