export var AndroidInstallStatus;
(function (AndroidInstallStatus) {
    AndroidInstallStatus[AndroidInstallStatus["UNKNOWN"] = 0] = "UNKNOWN";
    AndroidInstallStatus[AndroidInstallStatus["PENDING"] = 1] = "PENDING";
    AndroidInstallStatus[AndroidInstallStatus["DOWNLOADING"] = 2] = "DOWNLOADING";
    AndroidInstallStatus[AndroidInstallStatus["INSTALLING"] = 3] = "INSTALLING";
    AndroidInstallStatus[AndroidInstallStatus["INSTALLED"] = 4] = "INSTALLED";
    AndroidInstallStatus[AndroidInstallStatus["FAILED"] = 5] = "FAILED";
    AndroidInstallStatus[AndroidInstallStatus["CANCELED"] = 6] = "CANCELED";
    AndroidInstallStatus[AndroidInstallStatus["DOWNLOADED"] = 11] = "DOWNLOADED";
})(AndroidInstallStatus || (AndroidInstallStatus = {}));
export var AndroidOther;
(function (AndroidOther) {
    AndroidOther["IN_APP_UPDATE_RESULT_KEY"] = "in_app_update_result";
    AndroidOther["IN_APP_UPDATE_STATUS_KEY"] = "in_app_update_status";
})(AndroidOther || (AndroidOther = {}));
export var AndroidAvailabilityStatus;
(function (AndroidAvailabilityStatus) {
    AndroidAvailabilityStatus[AndroidAvailabilityStatus["UNKNOWN"] = 0] = "UNKNOWN";
    AndroidAvailabilityStatus[AndroidAvailabilityStatus["AVAILABLE"] = 2] = "AVAILABLE";
    AndroidAvailabilityStatus[AndroidAvailabilityStatus["UNAVAILABLE"] = 1] = "UNAVAILABLE";
    AndroidAvailabilityStatus[AndroidAvailabilityStatus["DEVELOPER_TRIGGERED"] = 3] = "DEVELOPER_TRIGGERED";
})(AndroidAvailabilityStatus || (AndroidAvailabilityStatus = {}));
export var AndroidUpdateType;
(function (AndroidUpdateType) {
    AndroidUpdateType[AndroidUpdateType["FLEXIBLE"] = 0] = "FLEXIBLE";
    AndroidUpdateType[AndroidUpdateType["IMMEDIATE"] = 1] = "IMMEDIATE";
})(AndroidUpdateType || (AndroidUpdateType = {}));
