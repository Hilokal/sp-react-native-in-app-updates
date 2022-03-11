import InAppUpdatesBase from './InAppUpdatesBase';
import type {
  CheckOptions,
  StartUpdateOptions,
} from './types';

const noop = () => {};

export default class InAppUpdates extends InAppUpdatesBase {
  public checkNeedsUpdate(
    // @ts-ignore - unused variable
    checkOptions?: CheckOptions
  ): Promise<any> {
    return Promise.reject(Error("This API isn't available on iOS"));
  }

  // @ts-ignore - unused variable
  startUpdate(options?: StartUpdateOptions): Promise<void> {
    return Promise.reject(Error("This API isn't available on iOS"));
  }

  installUpdate = noop;
  addStatusUpdateListener = noop;
  removeStatusUpdateListener = noop;
  addIntentSelectionListener = noop;
  removeIntentSelectionListener = noop;
}
