import { NativeModules, NativeEventEmitter } from 'react-native';

import {
  StatusUpdateEvent,
  InstallationResult,
  AndroidInAppUpdateExtras,
  AndroidStatusEventListener,
  AndroidIntentResultListener,
  AndroidStartUpdateOptions,
  AndroidUpdateType,
} from './types';
import InAppUpdatesBase from './InAppUpdatesBase';

const { SpInAppUpdates } = NativeModules;
const SpInAppUpdatesOrEmpty: {
  IN_APP_UPDATE_STATUS_KEY: any;
  IN_APP_UPDATE_RESULT_KEY: any;
} = SpInAppUpdates || {};

export default class InAppUpdates extends InAppUpdatesBase {
  constructor() {
    super();
    this.eventEmitter = new NativeEventEmitter(SpInAppUpdates);
    this.eventEmitter.addListener(
      SpInAppUpdatesOrEmpty?.IN_APP_UPDATE_STATUS_KEY,
      this.onIncomingNativeStatusUpdate
    );
    this.eventEmitter.addListener(
      SpInAppUpdatesOrEmpty?.IN_APP_UPDATE_RESULT_KEY,
      this.onIncomingNativeResult
    );
  }

  protected onIncomingNativeResult = (event: InstallationResult) => {
    this.resultListeners.emitEvent(event);
  };

  protected onIncomingNativeStatusUpdate = (event: StatusUpdateEvent) => {
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

  public addStatusUpdateListener = (callback: AndroidStatusEventListener) => {
    this.statusUpdateListeners.addListener(callback);
    if (this.statusUpdateListeners.hasListeners()) {
      SpInAppUpdates.setStatusUpdateSubscription(true);
    }
  };

  public removeStatusUpdateListener = (
    callback: AndroidStatusEventListener
  ) => {
    this.statusUpdateListeners.removeListener(callback);
    if (!this.statusUpdateListeners.hasListeners()) {
      SpInAppUpdates.setStatusUpdateSubscription(false);
    }
  };

  public addIntentSelectionListener = (
    callback: AndroidIntentResultListener
  ) => {
    this.resultListeners.addListener(callback);
  };

  public removeIntentSelectionListener = (
    callback: AndroidIntentResultListener
  ) => {
    this.resultListeners.removeListener(callback);
  };

  /**
   * Checks if there are any updates available.
   */
  public checkNeedsUpdate = (): Promise<AndroidInAppUpdateExtras> => {
    return SpInAppUpdates.checkNeedsUpdate().catch((err: any) => {
      this.debugLog(err);
      this.throwError(err, 'checkNeedsUpdate');
    });
  };

  /**
   *
   * Shows pop-up asking user if they want to update, giving them the option to download said update.
   */
  public startUpdate = (
    updateOptions: AndroidStartUpdateOptions
  ): Promise<void> => {
    const { updateType } = updateOptions || {};
    if (
      updateType !== AndroidUpdateType.FLEXIBLE &&
      updateType !== AndroidUpdateType.IMMEDIATE
    ) {
      this.throwError(
        `updateType should be one of: ${AndroidUpdateType.FLEXIBLE} or ${AndroidUpdateType.IMMEDIATE}, ${updateType} was passed.`,
        'startUpdate'
      );
    }
    return SpInAppUpdates.startUpdate(updateType).catch((err: any) => {
      this.throwError(err, 'startUpdate');
    });
  };

  public installUpdate = (): void => {
    SpInAppUpdates.installUpdate();
  };
}
