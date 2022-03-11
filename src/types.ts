export enum AndroidInstallStatus {
  UNKNOWN = 0,
  PENDING = 1,
  DOWNLOADING = 2,
  INSTALLING = 3,
  INSTALLED = 4,
  FAILED = 5,
  CANCELED = 6,
  DOWNLOADED = 11,
}

export type InstallationResult =
  | AndroidInstallStatus.INSTALLED
  | AndroidInstallStatus.CANCELED;

export type StatusUpdateEvent = {
  bytesDownloaded: any;
  totalBytesToDownload: any;
  status: AndroidInstallStatus;
};

/**
 * Whether the iOS APNs message was configured as a background update notification.
 */
export type CheckOptions = {
  /**
   * The build number of your current app version
   */
  curVersion?: number;
};

export enum AndroidOther {
  IN_APP_UPDATE_RESULT_KEY = 'in_app_update_result',
  IN_APP_UPDATE_STATUS_KEY = 'in_app_update_status',
}

export enum AndroidAvailabilityStatus {
  UNKNOWN = 0,
  AVAILABLE = 2,
  UNAVAILABLE = 1,
  DEVELOPER_TRIGGERED = 3,
}

export enum AndroidUpdateType {
  FLEXIBLE = 0,
  IMMEDIATE = 1,
}

export type AndroidInAppUpdateExtras = {
  updateAvailability: AndroidAvailabilityStatus;
  installStatus: AndroidInstallStatus;
  versionCode: number;
  isFlexibleUpdateAllowed: boolean;
  isImmediateUpdateAllowed: boolean;
  packageName: string;
  totalBytes: number;
  updatePriority: number;
};

export type AndroidStatusEventListener = (status: StatusUpdateEvent) => void;
export type AndroidIntentResultListener = (
  intentResult: InstallationResult
) => void;

export type AndroidStartUpdateOptions = {
  updateType: AndroidUpdateType;
};

export type StartUpdateOptions = AndroidStartUpdateOptions;
