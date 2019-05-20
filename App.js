/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { PermissionsAndroid, View, Text } from "react-native";
import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import { ActivityIndicator } from "react-native-paper";
import { DB } from "./database/database";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      granted: null
    };
  }

  async testDBConnection() {
    DB.getDatabase()
      .then(db => {
        console.log(db);
        console.log("succès");
      })
      .catch(err => {
        console.log(err);
        console.log("erreur");
      });
  }

  async componentDidMount() {
    await this.testDBConnection();
    await this.requestLocationPermission();
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Please allow the app to access to your location.",
          message: "This app needs your location in order to work properly.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ granted: "granted" });
      } else {
        this.setState({ granted: "no" });
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    return this.state.granted ? (
      this.state.granted === "granted" ? (
        <Navigation />
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>
            You must grant access to your location to the application!
          </Text>
        </View>
      )
    ) : (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
