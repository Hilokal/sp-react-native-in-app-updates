/* eslint-disable no-alert */
import React from 'react';
import SpInAppUpdates, { IAUAvailabilityStatus, IAUUpdateKind, } from 'sp-react-native-in-app-updates';
import { SafeAreaView, StyleSheet, View, StatusBar, Button, Platform, Text, } from 'react-native';
const BUTTON_COLOR = '#46955f';
const HIGH_PRIORITY_UPDATE = 5; // Arbitrary, depends on how you handle priority in the Play Console
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            needsUpdate: null,
            otherData: null,
            error: null,
        };
        this.checkForUpdates = () => {
            this.inAppUpdates
                .checkNeedsUpdate({
                curVersion: 10,
                // toSemverConverter: (ver: SemverVersion) => {
                //   // i.e if 400401 is the Android version, and we want to convert it to 4.4.1
                //   const androidVersionNo = parseInt(ver, 10);
                //   const majorVer = Math.trunc(androidVersionNo / 10000);
                //   const minorVerStarter = androidVersionNo - majorVer * 10000;
                //   const minorVer = Math.trunc(minorVerStarter / 100);
                //   const patchVersion = Math.trunc(minorVerStarter - minorVer * 100);
                //   return `${majorVer}.${minorVer}.${patchVersion}`;
                // },
            })
                .then((result) => {
                this.setState({
                    needsUpdate: result.updateAvailability === IAUAvailabilityStatus.AVAILABLE,
                    otherData: result
                });
            })
                .catch((error) => {
                this.setState({
                    error,
                });
            });
        };
        this.startUpdating = () => {
            if (this.state.needsUpdate) {
                let updateOptions = { updateType: IAUUpdateKind.FLEXIBLE };
                if (Platform.OS === 'android' && this.state.otherData) {
                    const { otherData } = this.state || {
                        otherData: null,
                    };
                    // @ts-expect-error TODO: Check if updatePriority exists
                    if (otherData?.updatePriority >= HIGH_PRIORITY_UPDATE) {
                        updateOptions = {
                            updateType: IAUUpdateKind.IMMEDIATE,
                        };
                    }
                    else {
                        updateOptions = {
                            updateType: IAUUpdateKind.FLEXIBLE,
                        };
                    }
                }
                this.inAppUpdates.addStatusUpdateListener(this.onStatusUpdate);
                this.inAppUpdates.startUpdate(updateOptions);
            }
            else {
                // @ts-ignore
                alert('doesnt look like we need an update');
            }
        };
        this.onStatusUpdate = (event) => {
            // const {
            //   // status,
            //   bytesDownloaded,
            //   totalBytesToDownload,
            // } = status;
            // do something
            console.log(`@@ ${JSON.stringify(event)}`);
        };
        this.inAppUpdates = new SpInAppUpdates(true // debug verbosely
        );
    }
    render() {
        const { needsUpdate, error } = this.state;
        let statusTxt;
        if (needsUpdate) {
            statusTxt = 'YES';
        }
        else if (needsUpdate === false) {
            statusTxt = 'NO';
        }
        else if (error) {
            statusTxt = 'Error, check below';
        }
        else {
            statusTxt = 'Not sure yet';
        }
        return (React.createElement(React.Fragment, null,
            React.createElement(StatusBar, { barStyle: "dark-content" }),
            React.createElement(SafeAreaView, null,
                React.createElement(View, { style: styles.container },
                    React.createElement(View, { style: styles.aButton },
                        React.createElement(Button, { title: "Check for updates", color: BUTTON_COLOR, onPress: this.checkForUpdates })),
                    React.createElement(View, { style: styles.aButton },
                        React.createElement(Button, { disabled: !needsUpdate, title: "Start Updating", color: BUTTON_COLOR, onPress: this.startUpdating })),
                    React.createElement(View
                    // eslint-disable-next-line react-native/no-inline-styles
                    , { 
                        // eslint-disable-next-line react-native/no-inline-styles
                        style: {
                            // backgroundColor: 'pink'
                            alignItems: 'center',
                        } },
                        React.createElement(Text, { style: styles.textStyle }, `Needs update: ${'\n'}${statusTxt}`)),
                    error ? (React.createElement(View, { style: styles.errorContainer },
                        React.createElement(Text, { style: styles.errorTextStyle }, `Error: ${error}`))) : null))));
    }
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        height: '100%',
        backgroundColor: '#77464C',
        justifyContent: 'center',
    },
    aButton: {
        marginVertical: 25,
        borderRadius: 8,
        marginHorizontal: 50,
    },
    textStyle: {
        color: '#d09a9a',
        fontSize: 26,
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: 'red',
    },
    errorTextStyle: {
        color: 'black',
        fontSize: 14,
    },
});
